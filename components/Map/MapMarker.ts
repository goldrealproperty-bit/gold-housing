import { Property } from "./mapTypes";
import { getPinInfo } from "./mapUtils";

type CreateMapMarkerArgs = {
  windowKakao: any;
  map: any;
  position: any;
  property: Property;
  onClick: () => void;
};

export function createMapMarker({
  windowKakao,
  map,
  position,
  property,
  onClick,
}: CreateMapMarkerArgs) {
  const pin = getPinInfo(property);
  const features = property.features || [];
  const isNoDeposit = features.some((item) => item.includes("무입"));

  const circle = new windowKakao.maps.Circle({
    center: position,
    radius: 250,
    strokeWeight: 2,
    strokeColor: pin.color,
    strokeOpacity: 0.75,
    fillColor: pin.color,
    fillOpacity: 0.13,
  });

  circle.setMap(map);

  const pinButton = document.createElement("button");

  pinButton.innerHTML = `
    <div style="
      position:relative;
      display:flex;
      flex-direction:column;
      align-items:center;
      transform:translateY(-8px);
    ">
      <div style="
        cursor:pointer;
        min-width:58px;
        padding:9px 13px;
        border-radius:999px;
        background:${pin.color};
        color:${pin.textColor};
        border:4px solid ${isNoDeposit ? "#10b981" : "white"};
        box-shadow:0 10px 24px rgba(0,0,0,0.28);
        font-size:14px;
        font-weight:900;
        white-space:nowrap;
      ">
        ${pin.label}
      </div>

      <div style="
        width:0;
        height:0;
        border-left:8px solid transparent;
        border-right:8px solid transparent;
        border-top:10px solid ${pin.color};
        margin-top:-1px;
        filter:drop-shadow(0 4px 3px rgba(0,0,0,.2));
      "></div>
    </div>
  `;

  pinButton.style.cssText = `
    border:0;
    background:transparent;
    padding:0;
    cursor:pointer;
  `;

  pinButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });

  const pinOverlay = new windowKakao.maps.CustomOverlay({
    position,
    yAnchor: 1.15,
    clickable: true,
    content: pinButton,
  });

  pinOverlay.setMap(map);

  windowKakao.maps.event.addListener(circle, "click", onClick);

  return { circle, pinOverlay };
}
