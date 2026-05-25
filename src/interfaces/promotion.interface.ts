export enum PromotionType {
  BANNER = 'BANNER',
  OFFER = 'OFFER',
}

export interface Promotion {
  id: number;
  type: PromotionType;
  title: string;
  image: string;
  description: string;
  isActive: boolean;
  statusReason?: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}
