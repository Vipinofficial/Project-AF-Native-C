export interface LocalizedString {
  en: string;
  hi: string;
}

export interface Listing {
  id: number;
  cat: 'fabric' | 'garment' | 'service' | 'all';
  price: number;
  base: string;
  acc: string;
  sponsored: boolean;
  rating: string;
  reviews: number;
  pincode: string;
  measurable: boolean;
  name: LocalizedString;
  shop: LocalizedString;
  desc: LocalizedString;
}

export interface Review {
  who: string;
  stars: string;
  text: string;
}

export interface Order {
  id: string;
  cust: LocalizedString;
  item: LocalizedString;
  qty: number;
  amt: number;
  meas: boolean;
  status: number; // 0: Placed, 1: Accepted, 2: In progress, 3: Ready, 4: Delivered
}

export interface Message {
  align: 'flex-start' | 'flex-end';
  bg: string;
  fg: string;
  text: string;
}

export interface CartItem {
  id: number;
  name: string;
  shop: string;
  price: number;
  unit: string;
  qty: number;
  hasMeas: boolean;
  hasDesign: boolean;
  swatch: string;
  total: number;
}
