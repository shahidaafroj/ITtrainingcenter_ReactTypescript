export interface IMoneyReceipt {
    moneyReceiptId?: number;
    moneyReceiptNo?: string;
    receiptDate: Date | string;
    category: string;  // Course, NonCourse, Registration Fee
    admissionId?: number | null;
    invoiceId?: number | null;
    visitorId?: number | null;
    paymentMode: string;    // Cash, Cheque, MFS, Card
    chequeNo?: string;
    bankName?: string;
    mfsName?: string;
    transactionNo?: string;
    debitOrCreditCardNo?: string;
    isFullPayment: boolean;
    isInvoiceCreated: boolean;
    payableAmount: number;
    paidAmount: number;
    dueAmount: number;
    createdBy?: string;
    remarks?: string;
}

export interface MoneyReceiptFormData {
    receiptDate: string;
    category: string;
    admissionId?: number | null;
    visitorId?: number | null;
    paymentMode: string;
    chequeNo?: string;
    bankName?: string;
    mfsName?: string;
    transactionNo?: string;
    debitOrCreditCardNo?: string;
    payableAmount: number;
    paidAmount: number;
    dueAmount: number;
    isInvoiceCreated: boolean;
    remarks?: string;
}

export interface AdmissionPaymentInfo {
    totalAmount: number;
    coursePaid: number;
    registrationFeePaid: number;
    payableAmount: number;
}

export interface IVisitor {
    visitorId: number;
    visitorName: string;
    contactNo: string;
    // other visitor fields...
}

export interface IAdmission {
    admissionId: number;
    admissionNo: string;
    visitorId: number;
    // other admission fields...
}

