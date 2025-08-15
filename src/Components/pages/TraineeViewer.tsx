import React, { useState, useEffect } from 'react';
import { Modal, Spin, message, Select, Button, Table, Descriptions } from 'antd';
import axios from 'axios';
import api from '../../api/axios';

interface Trainee {
  traineeId: number;
  traineeName: string;
  traineeIDNo: string;
  registrationNo: string;
  admissionNo: string;
  invoices: {
    invoiceNo: string;
    invoiceDate: string;
    amountPaid: number;
  }[];
}

const TraineeDetailsViewer = () => {
  const [trainees, setTrainees] = useState<{ traineeId: number, traineeName: string, traineeIDNo: string }[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<number | null>(null);
  const [traineeDetails, setTraineeDetails] = useState<Trainee | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch all trainees for dropdown
  // Fetch all trainees for dropdown
useEffect(() => {
  const fetchTrainees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Trainee/GetTrainees');
      setTrainees(response.data.map((t: any) => ({
        traineeId: t.traineeId,
        traineeIDNo: t.traineeIDNo,
        traineeName: t.traineeName || 'Unknown' // Changed from t.registration?.traineeName
      })));
    } catch (error) {
      message.error('Failed to load trainees');
    } finally {
      setLoading(false);
    }
  };
  fetchTrainees();
}, []);

  // Fetch details when trainee is selected
  const fetchTraineeDetails = async () => {
    if (!selectedTraineeId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/Trainee/GetTraineeDetails/${selectedTraineeId}`);
      setTraineeDetails(response.data);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to load trainee details');
    } finally {
      setLoading(false);
    }
  };

  const invoiceColumns = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (amount: number) => `৳${amount.toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Trainee Details Viewer</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Select
          style={{ width: '300px' }}
          placeholder="Select a Trainee"
          onChange={(value: number) => setSelectedTraineeId(value)}
          loading={loading}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            String(option?.children).toLowerCase().includes(input.toLowerCase())
          }
        >
          {trainees.map(trainee => (
            <Select.Option key={trainee.traineeId} value={trainee.traineeId}>
              {trainee.traineeName} (ID: {trainee.traineeIDNo})
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={fetchTraineeDetails}
          disabled={!selectedTraineeId || loading}
        >
          {loading ? <Spin size="small" /> : 'Show Details'}
        </Button>
      </div>

      <Modal
        title="Trainee Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {traineeDetails ? (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">{traineeDetails.traineeName}</Descriptions.Item>
              <Descriptions.Item label="Trainee ID No">{traineeDetails.traineeIDNo}</Descriptions.Item>
              <Descriptions.Item label="Registration No">{traineeDetails.registrationNo}</Descriptions.Item>
              <Descriptions.Item label="Admission No">{traineeDetails.admissionNo}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: '20px' }}>Related Invoices</h3>
            <Table
              columns={invoiceColumns}
              dataSource={traineeDetails.invoices}
              rowKey="invoiceNo"
              pagination={false}
              style={{ marginTop: '10px' }}
            />
          </div>
        ) : (
          <Spin spinning={loading} />
        )}
      </Modal>
    </div>
  );
};

export default TraineeDetailsViewer;