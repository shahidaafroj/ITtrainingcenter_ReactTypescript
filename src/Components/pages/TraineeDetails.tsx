import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Table, Spin, Button } from 'antd';
import axios from 'axios';
import api from '../../api/axios';

interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  amountPaid: number;
}

interface TraineeDetails {
  traineeId: number;
  traineeName: string;
  traineeIDNo: string;
  registrationNo: string;
  admissionNo: string;
  invoices: Invoice[];
}

const TraineeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trainee, setTrainee] = useState<TraineeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraineeDetails = async () => {
      try {
        const response = await api.get(`/Trainee/GetTraineeDetails/${id}`);
        setTrainee(response.data);
      } catch (error) {
        console.error('Error fetching trainee details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTraineeDetails();
  }, [id]);

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

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Button 
        type="primary" 
        onClick={() => window.history.back()} 
        style={{ marginBottom: '20px' }}
      >
        Back to List
      </Button>
      
      <Descriptions bordered title="Trainee Details" column={1}>
        <Descriptions.Item label="Trainee ID">{trainee?.traineeId}</Descriptions.Item>
        <Descriptions.Item label="Name">{trainee?.traineeName}</Descriptions.Item>
        <Descriptions.Item label="Trainee ID No">{trainee?.traineeIDNo}</Descriptions.Item>
        <Descriptions.Item label="Registration No">{trainee?.registrationNo}</Descriptions.Item>
        <Descriptions.Item label="Admission No">{trainee?.admissionNo}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: '20px' }}>Related Invoices</h3>
      <Table
        columns={invoiceColumns}
        dataSource={trainee?.invoices || []}
        rowKey="invoiceNo"
        pagination={false}
      />
    </div>
  );
};

export default TraineeDetails;