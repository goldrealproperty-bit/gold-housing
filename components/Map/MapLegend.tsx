export default function MapLegend() {
  return (
    <div className="rounded-3xl bg-white/10 p-4 text-sm font-bold text-gray-200 backdrop-blur">
      <div className="grid grid-cols-2 gap-x-5 gap-y-2">
        <span>🟢 2룸</span>
        <span>🟡 3룸</span>
        <span>🟣 4룸</span>
        <span>🔴 테라스/복층</span>
        <span>💚 무입가능</span>
      </div>
    </div>
  );
}
