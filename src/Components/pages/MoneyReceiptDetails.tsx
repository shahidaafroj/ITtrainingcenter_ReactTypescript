import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Tag, Typography } from 'antd';
import { useMoneyReceipt } from '../../hooks/moneyReceipt';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MoneyReceiptDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { fetchMoneyReceipt } = useMoneyReceipt();
    const [receipt, setReceipt] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const loadReceipt = async () => {
            try {
            if (!id) {
                // Handle the case where id is undefined
                return <div>Invalid receipt ID</div>;
            }

            const data = await fetchMoneyReceipt(parseInt(id));
                setReceipt(data);
            } catch (error) {
                console.error('Failed to load receipt details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadReceipt();
        }
    }, [id, fetchMoneyReceipt]);

    if (loading) {
        return <Card loading={loading} />;
    }

    if (!receipt) {
        return <Card>Receipt not found</Card>;
    }

    const paymentModeDetails = () => {
        switch (receipt.paymentMode) {
            case 'Cheque':
                return (
                    <>
                        <Descriptions.Item label="Cheque No">{receipt.chequeNo}</Descriptions.Item>
                        <Descriptions.Item label="Bank Name">{receipt.bankName}</Descriptions.Item>
                    </>
                );
            case 'MFS':
                return (
                    <>
                        <Descriptions.Item label="MFS Name">{receipt.mfsName}</Descriptions.Item>
                        <Descriptions.Item label="Transaction No">{receipt.transactionNo}</Descriptions.Item>
                    </>
                );
            case 'Card':
                return (
                    <>
                        <Descriptions.Item label="Card No">{receipt.debitOrCreditCardNo}</Descriptions.Item>
                        <Descriptions.Item label="Bank Name">{receipt.bankName}</Descriptions.Item>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Card 
            title={`Money Receipt Details - ${receipt.moneyReceiptNo}`}
            loading={loading}
        >
            <Title level={4} style={{ marginBottom: 24 }}>Basic Information</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Receipt Date">
                    {dayjs(receipt.receiptDate).format('DD MMM YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                    <Tag color="blue">{receipt.category}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Visitor">
                    {receipt.visitor?.visitorName} ({receipt.visitor?.contactNo})
                </Descriptions.Item>
                {receipt.category === 'Course' && (
                    <Descriptions.Item label="Admission No">
                        {receipt.admission?.admissionNo}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Payment Mode">
                    <Tag color={receipt.paymentMode === 'Cash' ? 'green' : 'orange'}>
                        {receipt.paymentMode}
                    </Tag>
                </Descriptions.Item>
                {paymentModeDetails()}
            </Descriptions>

            <Divider />

            <Title level={4} style={{ marginBottom: 24 }}>Payment Information</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Payable Amount">
                    <Text strong>{receipt.payableAmount.toFixed(2)} BDT</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Paid Amount">
                    <Text strong type="success">{receipt.paidAmount.toFixed(2)} BDT</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Due Amount">
                    <Text strong type={receipt.dueAmount > 0 ? 'danger' : 'success'}>
                        {receipt.dueAmount.toFixed(2)} BDT
                    </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                    <Tag color={receipt.isFullPayment ? 'green' : 'orange'}>
                        {receipt.isFullPayment ? 'FULL PAYMENT' : 'PARTIAL PAYMENT'}
                    </Tag>
                </Descriptions.Item>
                {receipt.isInvoiceCreated && (
                    <Descriptions.Item label="Invoice Created">
                        <Tag color="green">YES</Tag>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Divider />

            <Title level={4} style={{ marginBottom: 24 }}>Additional Information</Title>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Created By">{receipt.createdBy}</Descriptions.Item>
                <Descriptions.Item label="Remarks" span={2}>
                    {receipt.remarks || 'N/A'}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default MoneyReceiptDetails;