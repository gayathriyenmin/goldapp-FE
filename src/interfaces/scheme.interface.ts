export enum SchemeType {
  GOLD_RATE_MONTHLY = 'gold_rate_monthly',
  ONE_TIME_LOCK = 'gold_lock',
  MONTHLY_BONUS_11_PLUS_1 = '11_plus_1_bonus'
}

export interface Scheme {
  id: string | number;
  name: string;
  schemeCode?: string;
  schemeType: SchemeType;
  description?: string;
  termsAndConditions?: string;
  
  minAmount?: number;
  maxAmount?: number;
  monthlyAmount?: number;
  oneTimeAmount?: number;
  
  durationMonths?: number;
  lockPeriodMonths?: number;
  totalInstallments?: number;
  payableInstallments?: number;
  bonusInstallments?: number;
  
  goldRateSource?: string;
  allowPartialPayment?: boolean;
  autoGoldAllocation?: boolean;
  goldAllocationEnabled?: boolean;
  
  graceDays?: number;
  lateFeeEnabled?: boolean;
  lateFeeAmount?: number;
  
  bonusEnabled?: boolean;
  bonusType?: string;
  bonusValue?: number;
  bonusTiers?: string;
  autoBonusAddEnabled?: boolean;
  
  maturityClaimEnabled?: boolean;
  earlyClaimAllowed?: boolean;
  earlyClaimCharges?: number;
  
  installmentTrackingEnabled?: boolean;
  
  isActive: boolean;
  statusReason?: string;
  createdAt: string;
}
