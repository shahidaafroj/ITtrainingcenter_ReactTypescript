export interface IOffer {
    offerId: number;
    offerName: string;
    description: string;
    offerType: string;      // Seasonal, Occasional, PaymentBased
    seasonOrOccasion: string;
    validFrom: Date;
    validTo: Date;
    discountPercentage: number;
    paymentCondition: string;
    isActive: boolean;
}

