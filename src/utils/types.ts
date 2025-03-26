// types.ts
export interface Offer {
	id: number;
	title: string;
	description: string;
	image: string;
	coupon: string;
	coupon_expiry: string;
}
export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
