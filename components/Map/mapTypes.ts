export type Property = {
  id: number;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  image: string | null;
  features: string[] | null;
  room_type: string | null;
};

export type PinInfo = {
  label: string;
  color: string;
  textColor: string;
};
