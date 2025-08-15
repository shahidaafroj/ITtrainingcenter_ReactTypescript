import axios from 'axios';
import { AdmissionPaymentInfo, MoneyReceiptFormData } from '../../interfaces/IMoneyReceipt';
// import { IMoneyReceipt, MoneyReceiptFormData, AdmissionPaymentInfo } from '../../interface/IMoneyReceipt';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5281/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getMoneyReceipts = async () => {
  const response = await api.get('/MoneyReceipt/GetMoneyReceipts');
  return response.data;
};

export const getMoneyReceipt = async (id: number) => {
  const response = await api.get(`/MoneyReceipt/GetMoneyReceipt/${id}`);
  return response.data;
};

export const createMoneyReceipt = async (receiptData: MoneyReceiptFormData) => {
  const response = await api.post('/MoneyReceipt/InsertMoneyReceipt', receiptData);
  return response.data;
};

export const updateMoneyReceipt = async (id: number, receiptData: MoneyReceiptFormData) => {
  const response = await api.put(`/MoneyReceipt/UpdateMoneyReceipt/${id}`, receiptData);
  return response.data;
};

export const deleteMoneyReceipt = async (id: number) => {
  await api.delete(`/MoneyReceipt/DeleteMoneyReceipt/${id}`);
};

export const getInvoicesByAdmission = async (admissionNo: string) => {
    const response = await axios.get(`${API_BASE_URL}/invoices-by-admission/${admissionNo}`);
    return response.data;
};

export const getTotalCourseFeeByAdmission = async (admissionNo: string) => {
    const response = await axios.get(`${API_BASE_URL}/total-course-fee-by-admission/${admissionNo}`);
    return response.data;
};

export const getAdmissionPaymentInfo = async (admissionNo: string) => {
    const response = await axios.get(`${API_BASE_URL}/admission-payment-info/${admissionNo}`);
    return response.data as AdmissionPaymentInfo;
};


export const getVisitors = async () => {
  const response = await api.get('/Visitor/GetVisitors'); // Adjust endpoint as needed
  return response.data;
};

export const getAdmissionsByVisitor = async (visitorId: number) => {
  const response = await api.get(`/Admission/by-visitor/${visitorId}`);
  return response.data;
};

// Add to your moneyReceiptService.ts
export const getVisitorPaymentSummary = async (visitorId: number) => {
  const response = await api.get(`/MoneyReceipt/visitor-payment-summary/${visitorId}`);
  return response.data;
};
