export enum PromotionType {
  BANNER = 'BANNER',
  OFFER = 'OFFER',
}

export interface Promotion {
  id: number;
  type: PromotionType;
  title: string;
  titleTa?: string;
  image: string;
  description: string;
  descriptionTa?: string;
  isActive: boolean;
  statusReason?: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}
