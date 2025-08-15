import React, { useState, useEffect } from 'react';
import { useMoneyReceipt } from '../../hooks/moneyReceipt';
import { Form, Input, Button, DatePicker, Select, message, Card, Row, Col, Checkbox } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IAdmission, IVisitor, MoneyReceiptFormData } from '../../interfaces/IMoneyReceipt';
import dayjs from 'dayjs';
import { getAdmissionsByVisitor, getVisitorPaymentSummary, getVisitors } from '../../utilities/services/moneyReceiptService';

const { Option } = Select;
const { TextArea } = Input;

const MoneyReceiptForm: React.FC = () => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [paymentMode, setPaymentMode] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [isInvoiceCreated, setIsInvoiceCreated] = useState<boolean>(false);
    const [isFullPayment, setIsFullPayment] = useState<boolean>(false);
    const [visitors, setVisitors] = useState<IVisitor[]>([]);
    const [admissions, setAdmissions] = useState<IAdmission[]>([]);
    const [paymentSummary, setPaymentSummary] = useState<{
        totalAmount: number;
        totalPaid: number;
        remainingPayable: number;
    } | null>(null);

    const { 
        loading, 
        fetchMoneyReceipt, 
        addMoneyReceipt, 
        editMoneyReceipt
    } = useMoneyReceipt();

    // Load visitors on component mount
    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const data = await getVisitors();
                setVisitors(data);
            } catch (error) {
                message.error('Failed to load visitors');
            }
        };
        fetchVisitors();
    }, []);

    // Load existing receipt data if editing
    useEffect(() => {
        if (id) {
            fetchMoneyReceipt(parseInt(id)).then((data) => {
                if (data) {
                    form.setFieldsValue({
                        ...data,
                        receiptDate: dayjs(data.receiptDate),
                    });
                    setPaymentMode(data.paymentMode);
                    setCategory(data.category);
                    setIsInvoiceCreated(data.isInvoiceCreated);
                    setIsFullPayment(data.isFullPayment);
                }
            });
        } else {
            form.setFieldsValue({
                receiptDate: dayjs(),
                payableAmount: 0,
                paidAmount: 0,
                dueAmount: 0,
                createdBy: '',
            });
        }
    }, [id, form, fetchMoneyReceipt]);

    const handleVisitorChange = async (visitorId: number) => {
        form.setFieldsValue({ 
            admissionId: null,
            payableAmount: category === 'Registration Fee' ? 0 : paymentSummary?.remainingPayable || 0,
            paidAmount: 0,
            dueAmount: category === 'Registration Fee' ? 0 : paymentSummary?.remainingPayable || 0
        });
        
        if (visitorId) {
            try {
                const admissionsData = await getAdmissionsByVisitor(visitorId);
                setAdmissions(admissionsData);
                
                const summary = await getVisitorPaymentSummary(visitorId);
                setPaymentSummary({
                    totalAmount: summary.totalAfterDiscounts,
                    totalPaid: summary.totalPaid,
                    remainingPayable: summary.remainingPayable
                });

                if (category !== 'Registration Fee') {
                    form.setFieldsValue({
                        totalAmount: summary.totalAfterDiscounts,
                        totalPaid: summary.totalPaid,
                        remainingPayable: summary.remainingPayable,
                        payableAmount: summary.remainingPayable,
                        dueAmount: summary.remainingPayable
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                message.error('Failed to load payment info');
            }
        } else {
            setAdmissions([]);
            setPaymentSummary({
                totalAmount: 0,
                totalPaid: 0,
                remainingPayable: 0
            });
        }
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        form.setFieldsValue({ 
            admissionId: null,
            payableAmount: value === 'Registration Fee' ? 0 : paymentSummary?.remainingPayable || 0,
            paidAmount: 0,
            dueAmount: value === 'Registration Fee' ? 0 : paymentSummary?.remainingPayable || 0
        });
    };

    const handlePaymentModeChange = (value: string) => {
        setPaymentMode(value);
        form.setFieldsValue({
            chequeNo: undefined,
            bankName: undefined,
            mfsName: undefined,
            transactionNo: undefined,
            debitOrCreditCardNo: undefined,
        });
    };

    const handleAdmissionChange = (admissionId: number) => {
        // Additional logic if needed
    };

    const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const paid = parseFloat(e.target.value) || 0;
        let payable = 0;
        
        if (category === 'Registration Fee') {
            payable = form.getFieldValue('payableAmount') || 0;
            form.setFieldsValue({ 
                paidAmount: paid,
                // dueAmount: payable - paid
            });
        } else {
            payable = paymentSummary?.remainingPayable || 0;
            const actualPaid = paid; // Allow any positive amount for new visitors
            form.setFieldsValue({ 
                paidAmount: actualPaid,
                dueAmount: payable - actualPaid
            });
        }
    };

    const onFinish = async (values: any) => {
        if (values.paidAmount <= 0) {
            message.error('Paid amount must be greater than 0');
            return;
        }

        const receiptData: MoneyReceiptFormData = {
            ...values,
            receiptDate: values.receiptDate.format('YYYY-MM-DD'),
            isInvoiceCreated,
            isFullPayment,
        };

        try {
            if (id) {
                await editMoneyReceipt(parseInt(id), receiptData);
                message.success('Money receipt updated successfully');
            } else {
                await addMoneyReceipt(receiptData);
                message.success('Money receipt created successfully');
            }
            navigate('/money-receipts');
        } catch (error) {
            message.error('Failed to save money receipt');
        }
    };


     return (
        <Card title={id ? "Edit Money Receipt" : "Add Money Receipt"}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="receiptDate"
                            label="Receipt Date"
                            rules={[{ required: true, message: 'Please select receipt date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select category' }]}
                        >
                            <Select onChange={handleCategoryChange}>
                                <Option value="Course">Course</Option>
                                <Option value="NonCourse">Non-Course</Option>
                                <Option value="Registration Fee">Registration Fee</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="paymentMode"
                            label="Payment Mode"
                            rules={[{ required: true, message: 'Please select payment mode' }]}
                        >
                            <Select onChange={handlePaymentModeChange}>
                                <Option value="Cash">Cash</Option>
                                <Option value="Cheque">Cheque</Option>
                                <Option value="MFS">MFS</Option>
                                <Option value="Card">Card</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={category === 'Course' ? 12 : 24}>
                        <Form.Item
                            name="visitorId"
                            label="Visitor"
                            rules={[{ required: true, message: 'Please select visitor' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select visitor"
                                optionFilterProp="children"
                                onChange={handleVisitorChange}
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {visitors.map(visitor => (
                                    <Option 
                                        key={visitor.visitorId} 
                                        value={visitor.visitorId}
                                        label={`${visitor.visitorName} (${visitor.contactNo})`}
                                    >
                                        {visitor.visitorName} ({visitor.contactNo})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {category === 'Course' && (
                        <Col span={12}>
                            <Form.Item
                                name="admissionId"
                                label="Admission No"
                                rules={[{ required: true, message: 'Please select admission' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select admission no"
                                    optionFilterProp="children"
                                    disabled={!form.getFieldValue('visitorId')}
                                    onChange={handleAdmissionChange}
                                >
                                    {admissions.map(admission => (
                                        <Option key={admission.admissionId} value={admission.admissionId}>
                                            {admission.admissionNo}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                {(category === 'Course' || category === 'Registration Fee') && (
                    <>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Total Amount">
                                    <Input 
                                        value={form.getFieldValue('totalAmount')?.toFixed(2) || '0.00'} 
                                        disabled 
                                         style={{ color: 'rgba(0, 0, 0, 0.85)' }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Total Paid">
                                    <Input 
                                        value={form.getFieldValue('totalPaid')?.toFixed(2) || '0.00'} 
                                        disabled 
                                         style={{ color: 'rgba(0, 0, 0, 0.85)' }} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Total Due">
                                    <Input 
                                        value={form.getFieldValue('remainingPayable')?.toFixed(2) || '0.00'} 
                                        disabled 
                                         style={{ color: 'rgba(0, 0, 0, 0.85)' }} 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="payableAmount"
                                    label="Payable Amount"
                                    rules={[{ 
                                        required: true, 
                                        message: 'Please enter payable amount',
                                        type: 'number',
                                        min: 0
                                    }]}
                                >
                                    <Input 
                                        type="number"
                                        // disabled={category !== 'Registration Fee'}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            form.setFieldsValue({
                                                payableAmount: value,
                                                dueAmount: value - (form.getFieldValue('paidAmount') || 0)
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="paidAmount"
                                    label="Paid Amount"
                                    rules={[{ 
                                        required: true, 
                                        message: 'Please enter paid amount',
                                        type: 'number',
                                        min: 0.01
                                    }]}
                                >
                                    <Input 
                                        type="number" 
                                        onChange={handlePaidAmountChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="dueAmount"
                                    label="Due After Payment"
                                >
                                    <Input 
                                        value={(
                                            (category === 'Registration Fee' 
                                                ? form.getFieldValue('payableAmount') || 0
                                                : form.getFieldValue('remainingPayable') || 0) - 
                                            (form.getFieldValue('paidAmount') || 0)
                                        ).toFixed(2)} 
                                        disabled 
                                         style={{ color: 'rgba(0, 0, 0, 0.85)' }} 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}
                {/* Payment Details Sections */}
                {paymentMode === 'Cheque' && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="chequeNo"
                                label="Cheque No"
                                rules={[{ required: true, message: 'Please enter cheque no' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bankName"
                                label="Bank Name"
                                rules={[{ required: true, message: 'Please enter bank name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                {paymentMode === 'MFS' && (
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="mfsName"
                                label="MFS Name"
                                rules={[{ required: true, message: 'Please select MFS' }]}
                            >
                                <Select>
                                    <Option value="Bkash">Bkash</Option>
                                    <Option value="Rocket">Rocket</Option>
                                    <Option value="Nagad">Nagad</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                name="transactionNo"
                                label="Transaction No"
                                rules={[{ required: true, message: 'Please enter transaction no' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                {paymentMode === 'Card' && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="debitOrCreditCardNo"
                                label="Card No"
                                rules={[{ required: true, message: 'Please enter card no' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bankName"
                                label="Bank Name"
                                rules={[{ required: true, message: 'Please enter bank name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                {/* Additional Fields */}
                <Form.Item name="remarks" label="Remarks">
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item name="createdBy" label="Created By">
                    <Input />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="isInvoiceCreated" valuePropName="checked">
                            <Checkbox 
                                checked={isInvoiceCreated} 
                                onChange={(e) => setIsInvoiceCreated(e.target.checked)}
                            >
                                Create Invoice
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    {category === 'Course' && (
                        <Col span={12}>
                            <Form.Item name="isFullPayment" valuePropName="checked">
                                <Checkbox 
                                    checked={isFullPayment} 
                                    onChange={(e) => setIsFullPayment(e.target.checked)}
                                >
                                    Is Full Payment
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save
                    </Button>
                    <Link to="/money-receipts" style={{ marginLeft: 16 }}>
                        <Button>Cancel</Button>
                    </Link>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default MoneyReceiptForm;