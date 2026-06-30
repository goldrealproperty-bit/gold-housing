export type Property = {
  id: number;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  loan: string | null;
  image: string | null;
  images: string[] | null;
  rooms: string | null;
  baths: string | null;
  parking: string | null;
  elevator: string | null;
  description: string | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_intro: string | null;
  manager_image: string | null;
  features: string[] | null;
  room_type: string | null;
};

export type PropertyFormState = {
  title: string;
  location: string;
  address: string;
  price: string;
  deposit: string;
  loan: string;
  image: string;
  images: string[];
  rooms: string;
  baths: string;
  parking: string;
  elevator: string;
  desc: string;
  room_type: string;
  manager_name: string;
  manager_phone: string;
  manager_intro: string;
  manager_image: string;
  features: string[];
};

export type Consultation = {
  id: number;
  phone: string;
  area: string | null;
  budget: string | null;
  message: string | null;
  property_id: number | null;
  property_title: string | null;
  status: string | null;
  created_at: string | null;
};