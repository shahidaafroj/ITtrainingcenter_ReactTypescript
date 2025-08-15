import React from 'react';
import { Table } from 'antd';

interface MoneyReceipt {
  moneyReceiptNo: string;
  paidAmount: number;
  admissionNo: string | null;
  visitorName: string | null;
}

interface InvoiceDetailsProps {
  invoiceNo: string;
  creatingDate: string;
  invoiceCategory: string;
  moneyReceipts: MoneyReceipt[];
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  invoiceNo,
  creatingDate,
  invoiceCategory,
  moneyReceipts,
}) => {
  const columns = [
    {
      title: 'Money Receipt No',
      dataIndex: 'moneyReceiptNo',
      key: 'moneyReceiptNo',
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => `৳${amount.toFixed(2)}`,
    },
    {
      title: 'Admission No',
      dataIndex: 'admissionNo',
      key: 'admissionNo',
    },
    {
      title: 'Visitor Name',
      dataIndex: 'visitorName',
      key: 'visitorName',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Invoice No:</strong> {invoiceNo}</p>
        <p><strong>Date:</strong> {new Date(creatingDate).toLocaleDateString()}</p>
        <p><strong>Category:</strong> {invoiceCategory}</p>
      </div>

      <h3>Related Money Receipts</h3>
      <Table
        columns={columns}
        dataSource={moneyReceipts}
        rowKey="moneyReceiptNo"
        pagination={false}
      />
    </div>
  );
};

export default InvoiceDetails;