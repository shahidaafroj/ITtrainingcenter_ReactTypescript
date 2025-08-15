import React, { useState, useEffect } from 'react';
import { Modal, Spin, message, Select, Button } from 'antd';
import axios from 'axios';
import InvoiceDetails from './InvoiceDetails';
import api from '../../api/axios';

const { Option } = Select;

interface Invoice {
  invoiceId: number;
  invoiceNo: string;
  creatingDate: string;
}

const InvoiceViewer: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ইনভয়েস ডাটা লোড করার ফাংশন
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Invoice/GetAllInvoices');
      setInvoices(response.data);
    } catch (error) {
      message.error('Failed to load invoices');
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ইনভয়েস ডিটেইলস লোড করার ফাংশন
  const fetchInvoiceDetails = async () => {
    if (!selectedInvoiceId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/Invoice/GetInvoiceDetails/${selectedInvoiceId}`);
      setInvoiceDetails(response.data);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to load invoice details');
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Invoice Details Viewer</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
       <Select
        style={{ width: '300px' }}
        placeholder="Select an Invoice"
        onChange={(value: number) => setSelectedInvoiceId(value)}
        loading={loading}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => {
            if (!option || !option.children) return false;
            return String(option.children).toLowerCase().includes(input.toLowerCase());
        }}
        >
        {invoices.map(invoice => (
            <Option key={invoice.invoiceId} value={invoice.invoiceId}>
            {invoice.invoiceNo} - {new Date(invoice.creatingDate).toLocaleDateString()}
            </Option>
        ))}
        </Select>

        <Button
          type="primary"
          onClick={fetchInvoiceDetails}
          disabled={!selectedInvoiceId || loading}
          loading={loading}
        >
          Show Details
        </Button>
      </div>

      <Modal
        title={`Invoice Details `}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {invoiceDetails ? (
          <InvoiceDetails
            invoiceNo={invoiceDetails.invoiceNo}
            creatingDate={invoiceDetails.creatingDate}
            invoiceCategory={invoiceDetails.invoiceCategory}
            moneyReceipts={invoiceDetails.moneyReceipts || []}
          />
        ) : (
          <Spin spinning={loading} />
        )}
      </Modal>
    </div>
  );
};

export default InvoiceViewer;