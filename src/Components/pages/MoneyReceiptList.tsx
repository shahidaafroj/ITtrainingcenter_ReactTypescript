import React, { useEffect } from 'react';
import { useMoneyReceipt } from '../../hooks/moneyReceipt';
import { Table, Button, Spin, message, Space } from 'antd';
import { Link } from 'react-router-dom';
import { IMoneyReceipt } from '../../interfaces/IMoneyReceipt';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MoneyReceiptList: React.FC = () => {
    const { moneyReceipts, loading, error, fetchMoneyReceipts, removeMoneyReceipt } = useMoneyReceipt();

    useEffect(() => {
        fetchMoneyReceipts();
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const columns = [
        {
            title: 'Receipt No',
            dataIndex: 'moneyReceiptNo',
            key: 'moneyReceiptNo',
        },
        {
            title: 'Date',
            dataIndex: 'receiptDate',
            key: 'receiptDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
        },
        {
            title: 'Paid Amount',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            render: (amount: number) => amount.toFixed(2),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: IMoneyReceipt) => (
                <Space size="middle">
                    <Link to={`/money-receipts/details/${record.moneyReceiptId}`}>
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />} 
                            size="small"
                        >
                            Details
                        </Button>
                    </Link>
                    <Link to={`/money-receipts/edit/${record.moneyReceiptId}`}>
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                        >
                            Edit
                        </Button>
                    </Link>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => removeMoneyReceipt(record.moneyReceiptId!)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Money Receipts</h2>
                <Link to="/money-receipts/create">
                    <Button type="primary">Add New Receipt</Button>
                </Link>
            </div>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table 
                    dataSource={moneyReceipts} 
                    columns={columns} 
                    rowKey="moneyReceiptId"
                    bordered
                />
            )}
        </div>
    );
};

export default MoneyReceiptList;