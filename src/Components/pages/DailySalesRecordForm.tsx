import React, { useState, useEffect } from 'react';
import { useDailySalesRecord, useEmployeeHook, useVisitorHook } from '../../hooks';
import { IDailySalesRecord, IVisitor, IEmployee } from '../../interfaces';
import { 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Select, 
  Spin, 
  message, 
  Row, 
  Col, 
  Divider,
  Modal,
  Typography,
  Card 
} from 'antd';
import moment from 'moment';
import { DefaultOptionType } from 'antd/es/select';
import { makeStyles } from '@material-ui/core';
import { DailySalesRecordService } from '../../utilities/services';

const { Option } = Select;
const { TextArea } = Input;

const useStyles = makeStyles((theme) => ({
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        minWidth: 400,
        maxWidth: 800,
        outline: 'none',
    },
    modalTitle: {
        marginBottom: theme.spacing(3),
        color: 'hsla(189, 97.60%, 52.00%, 0.91)',
        fontWeight: 'bold'
    },
    formField: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    formButtons: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing(2),
    },
}));

interface DailySalesRecordFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  recordId?: number;
}

const DailySalesRecordForm: React.FC<DailySalesRecordFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  recordId
}) => {
    const classes = useStyles();
    const [form] = Form.useForm();
    const { data: employees, loading: employeesLoading } = useEmployeeHook();
    const { data: visitors, loading: visitorsLoading } = useVisitorHook();
    const { createRecord, updateRecord, getRecord, loading: recordLoading } = useDailySalesRecord();
const [selectedVisitors, setSelectedVisitors] = useState<number[]>([]); // Stores visitor IDs
const [selectedWalkInVisitors, setSelectedWalkInVisitors] = useState<number[]>([]); // Stores walk-in visitor IDs
const [visitorOptions, setVisitorOptions] = useState<IVisitor[]>([]); // All available visitors
// 
    const [loading, setLoading] = useState(false);
    const [totalCollection, setTotalCollection] = useState<number>(0);
    const [collectionLoading, setCollectionLoading] = useState<boolean>(false);

    // Fetch total collection when employee or date changes
    useEffect(() => {
        if (!visible) return;

        const employeeId = form.getFieldValue('employeeId');
        const date = form.getFieldValue('date');
        
        if (employeeId && date && moment.isMoment(date)) {
            fetchTotalCollection(employeeId, date);
        } else {
            setTotalCollection(0);
        }
    }, [visible, form.getFieldValue('employeeId'), form.getFieldValue('date')]);

    const fetchTotalCollection = async (employeeId: number, date: moment.Moment) => {
        if (!employeeId || !date || !moment.isMoment(date)) {
            setTotalCollection(0);
            return;
        }
        
        setCollectionLoading(true);
        try {
            const year = date.year();
            const month = date.month() + 1;
            const total = await DailySalesRecordService.getTotalCollection(employeeId, year, month);
            setTotalCollection(total);
        } catch (error) {
            console.error('Error fetching total:', error);
            message.error('Failed to fetch total collection');
            setTotalCollection(0);
        } finally {
            setCollectionLoading(false);
        }
    };

    // Initialize form
    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (recordId) {
                fetchRecordData(recordId);
            } else {
                form.setFieldsValue({
                    date: moment(),
                    coldCallsMade: 0,
                    meetingsScheduled: 0,
                    meetingsConducted: 0,
                    walkInsAttended: 0,
                    evaluationsAttended: 0,
                    corporateVisitsScheduled: 0,
                    corporateVisitsConducted: 0,
                    newRegistrations: 0,
                    enrollments: 0,
                    newCollections: 0,
                    dueCollections: 0
                });
            }
        }
    }, [visible, recordId]);

    // const fetchRecordData = async (id: number) => {
    //     setLoading(true);
    //     try {
    //         const record = await getRecord(id);
    //         if (record) {
    //             form.setFieldsValue({
    //                 ...record,
    //                 date: moment(record.date),
    //             });
    //             // Refresh total collection after setting form values
    //             const employeeId = record.employeeId;
    //             const date = moment(record.date);
    //             fetchTotalCollection(employeeId, date);
    //         }
    //     } catch (error) {
    //         message.error('Failed to fetch record data');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const fetchRecordData = async (id: number) => {
    setLoading(true);
    try {
        const record = await getRecord(id);
        if (record) {
            form.setFieldsValue({
                ...record,
                date: moment(record.date),
            });

            // Set selected visitors
            if (record.visitorNo) {
                const visitorNumbers = record.visitorNo.split(',').filter(Boolean);
                const selectedIds = visitors
                    .filter(v => visitorNumbers.includes(v.visitorNo?.toString() ?? ''))
                    .map(v => v.visitorId);
                setSelectedVisitors(selectedIds);
            }

            // Set selected walk-in visitors
            if (record.walkInVisitorNo) {
                const walkInNumbers = record.walkInVisitorNo.split(',').filter(Boolean);
                const selectedWalkInIds = visitors
                    .filter(v => walkInNumbers.includes(v.visitorNo?.toString() ?? ''))
                    .map(v => v.visitorId);
                setSelectedWalkInVisitors(selectedWalkInIds);
            }

            fetchTotalCollection(record.employeeId, moment(record.date));
        }
    } catch (error) {
        message.error('Failed to fetch record data');
    } finally {
        setLoading(false);
    }
};

    // const onFinish = async (values: any) => {
    //     const recordData: IDailySalesRecord = {
    //         ...values,
    //         date: values.date.format('YYYY-MM-DD'),
    //         visitorNo: selectedVisitors.map(v => v.visitorNo).join(','),
    //         walkInVisitorNo: selectedWalkInVisitors.map(v => v.visitorNo).join(','),
    //         selectedVisitors: [...selectedVisitors, ...selectedWalkInVisitors]
    //     };

    //     try {
    //         if (recordId) {
    //             const result = await updateRecord(recordId, recordData);
    //             if (result.success) {
    //                 message.success('Record updated successfully');
    //                 onSuccess();
    //             }
    //         } else {
    //             const result = await createRecord(recordData);
    //             if (result.success) {
    //                 message.success('Record created successfully');
    //                 onSuccess();
    //             }
    //         }
    //     } catch (error) {
    //         message.error('An error occurred while saving the record');
    //     }
    // };

    const onFinish = async (values: any) => {
    const getVisitorNumbers = (ids: number[]) => {
        return visitors
            .filter(v => ids.includes(v.visitorId))
            .map(v => v.visitorNo)
            .filter(Boolean)
            .join(',');
    };

    const recordData: IDailySalesRecord = {
        ...values,
        dailySalesRecordId: recordId,
        date: values.date.format('YYYY-MM-DD'),
        visitorNo: getVisitorNumbers(selectedVisitors),
        walkInVisitorNo: getVisitorNumbers(selectedWalkInVisitors),
    };

    try {
        let result;
        if (recordId) {
            result = await updateRecord(recordId, recordData);
        } else {
            result = await createRecord(recordData);
        }

        if (result?.success) {
            message.success(recordId ? 'Record updated successfully' : 'Record created successfully');
            onSuccess();
        } else {
            message.error( 'Operation failed');
        }
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        message.error(error.response?.data?.message || 'Error saving record');
    }
};

    // const handleVisitorSelect = (visitorIds: number[]) => {
    //     const selected = visitors.filter((v: IVisitor) => visitorIds.includes(v.visitorId));
    //     setSelectedVisitors(selected);
    // };

    // const handleWalkInVisitorSelect = (visitorIds: number[]) => {
    //     const selected = visitors.filter((v: IVisitor) => visitorIds.includes(v.visitorId));
    //     setSelectedWalkInVisitors(selected);
    // };


    const handleVisitorSelect = (selectedVisitorIds: number[]) => {
    setSelectedVisitors(selectedVisitorIds);
};

const handleWalkInVisitorSelect = (selectedWalkInVisitorIds: number[]) => {
    setSelectedWalkInVisitors(selectedWalkInVisitorIds);
};
    const filterOption = (input: string, option?: DefaultOptionType) => {
        if (!option || !option.children) {
            return false;
        }
        return String(option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    return (
        <Modal
            title={recordId ? "Edit Daily Sales Record" : "Create Daily Sales Record"}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={1000}
            destroyOnClose
            className={classes.modalPaper}
        >
            <Spin spinning={loading || employeesLoading || visitorsLoading || recordLoading}>
                <Typography className={classes.modalTitle}>
                    {recordId ? "Edit Daily Sales Record" : "Create Daily Sales Record"}
                </Typography>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={(changedValues, allValues) => {
                        // Refresh total when employee or date changes
                        if (changedValues.employeeId || changedValues.date) {
                            const { employeeId, date } = allValues;
                            if (employeeId && date) {
                                fetchTotalCollection(employeeId, date);
                            }
                        }
                    }}
                >
                    <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="employeeId"
                                    label="Employee"
                                    rules={[{ required: true, message: 'Please select an employee' }]}
                                >
                                    <Select placeholder="Select employee" loading={employeesLoading}>
                                        {employees?.map((employee: IEmployee) => (
                                            <Option key={employee.employeeId} value={employee.employeeId}>
                                                {employee.employeeName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="date"
                                    label="Date"
                                    rules={[{ required: true, message: 'Please select a date' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Cold Calling</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="coldCallsMade" label="Cold Calls Made">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="meetingsScheduled" label="Meetings Scheduled">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="meetingsConducted" label="Meetings Conducted">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="visitorNo" label="Visitors (comma separated IDs)" hidden>
                            <Input />
                        </Form.Item>

                        {/* <Form.Item label="Select Visitors">
                            <Select
                                mode="multiple"
                                placeholder="Select visitors"
                                optionFilterProp="children"
                                onChange={handleVisitorSelect}
                                loading={visitorsLoading}
                                showSearch
                                filterOption={filterOption}
                            >
                                {visitors?.map((visitor: IVisitor) => (
                                    <Option key={visitor.visitorId} value={visitor.visitorId}>
                                        {visitor.visitorName} ({visitor.visitorNo})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        <Form.Item label="Select Visitors">
                                <Select
                                    mode="multiple"
                                    placeholder="Select visitors"
                                    value={selectedVisitors}
                                    onChange={handleVisitorSelect}
                                    loading={visitorsLoading}
                                    optionFilterProp="label"
                                    showSearch
                                >
                                    {visitors?.map((visitor) => (
                                        <Option 
                                            key={visitor.visitorId} 
                                            value={visitor.visitorId}
                                            label={`${visitor.visitorName} (${visitor.visitorNo})`}
                                        >
                                            {visitor.visitorName} ({visitor.visitorNo})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        <Divider orientation="left">Walk-ins</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="walkInsAttended" label="Walk-ins Attended">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="evaluationsAttended" label="Evaluations Attended">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="walkInVisitorNo" label="Walk-in Visitors (comma separated IDs)" hidden>
                            <Input />
                        </Form.Item>

                        {/* <Form.Item label="Select Walk-in Visitors">
                            <Select
                                mode="multiple"
                                placeholder="Select walk-in visitors"
                                optionFilterProp="children"
                                onChange={handleWalkInVisitorSelect}
                                loading={visitorsLoading}
                                showSearch
                                filterOption={filterOption}
                            >
                                {visitors?.map((visitor: IVisitor) => (
                                    <Option key={visitor.visitorId} value={visitor.visitorId}>
                                        {visitor.visitorName} ({visitor.visitorNo})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        <Form.Item label="Select Walk-in Visitors">
                            <Select
                                mode="multiple"
                                placeholder="Select walk-in visitors"
                                value={selectedWalkInVisitors}
                                onChange={handleWalkInVisitorSelect}
                                loading={visitorsLoading}
                                optionFilterProp="label"
                                showSearch
                            >
                                {visitors?.map((visitor) => (
                                    <Option 
                                        key={visitor.visitorId} 
                                        value={visitor.visitorId}
                                        label={`${visitor.visitorName} (${visitor.visitorNo})`}
                                    >
                                        {visitor.visitorName} ({visitor.visitorNo})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Divider orientation="left">Corporate Visits</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="corporateVisitsScheduled" label="Corporate Visits Scheduled">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="corporateVisitsConducted" label="Corporate Visits Conducted">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Admissions</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="newRegistrations" label="New Registrations">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="enrollments" label="Enrollments">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Financial Updates</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="newCollections" label="New Collections">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dueCollections" label="Due Collections">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="remarks" label="Remarks">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Divider orientation="left">Financial Summary</Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card 
                                    size="small" 
                                    title="Monthly Total Collection" 
                                    style={{ marginBottom: 16 }}
                                    loading={collectionLoading}
                                >
                                    <Typography.Title level={4} style={{ margin: 0 }}>
                                        {totalCollection.toLocaleString('en-BD', {
                                            style: 'currency',
                                            currency: 'BDT',
                                            minimumFractionDigits: 0
                                        })}
                                    </Typography.Title>
                                    <Typography.Text type="secondary">
                                        (New + Due Collections)
                                    </Typography.Text>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <div className={classes.formButtons}>
                        <Button type="primary" htmlType="submit" loading={recordLoading}>
                            {recordId ? 'Update' : 'Submit'}
                        </Button>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Spin>
        </Modal>
    );
};

export default DailySalesRecordForm;