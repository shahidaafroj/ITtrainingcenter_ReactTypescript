import React, { useEffect, useState } from 'react';
import { useDailySalesRecord } from '../../hooks';
import { format } from 'date-fns';
import { Table, Button, Spin, message, Space, Popconfirm, Input } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DailySalesRecordForm from './DailySalesRecordForm';
import { makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';




const useStyles = makeStyles((theme) => ({
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: theme.spacing(3),
        gap: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1.5, 2),
        borderRadius: 12,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`,
        width: 'fit-content',
        maxWidth: '90%',
    },
    searchField: {
        flexGrow: 1,
        maxWidth: 584,
        minWidth: 300,
        '& .ant-input': {
            height: 44,
            borderRadius: 24,
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)',
            '&:hover': {
                boxShadow: '0 2px 8px 1px rgba(64,60,67,.24)',
            },
            '&:focus': {
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px 1px rgba(64,60,67,.24)',
            },
        },
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: 'hsla(189, 97.60%, 52.00%, 0.91)',
        color: 'white'
    },
}));

const DailySalesRecordList: React.FC = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const { records, loading, error, fetchRecords, deleteRecord } = useDailySalesRecord();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>(undefined);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const filteredRecords = records.filter(record => {
        return (
            record.employee?.employeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
            format(new Date(record.date), 'MMM dd, yyyy').toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
            sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        },
        {
            title: 'Employee',
            dataIndex: ['employee', 'employeeName'],
            key: 'employeeName'
        },
        {
            title: 'Cold Calls',
            dataIndex: 'coldCallsMade',
            key: 'coldCallsMade'
        },
        {
            title: 'Meetings',
            dataIndex: 'meetingsConducted',
            key: 'meetingsConducted'
        },
        {
            title: 'Walk-ins',
            dataIndex: 'walkInsAttended',
            key: 'walkInsAttended'
        },
        {
            title: 'Enrollments',
            dataIndex: 'enrollments',
            key: 'enrollments'
        },
        {
            title: 'Collections',
            dataIndex: 'newCollections',
            key: 'newCollections',
            render: (value: number) => `$${value.toFixed(2)}`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="middle">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => navigate(`/daily-sales-records/${record.dailySalesRecordId}`)}
                    />

                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setSelectedRecordId(record.dailySalesRecordId);
                            setModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(record.dailySalesRecordId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleDelete = async (id: number) => {
        const result = await deleteRecord(id);
        if (result.success) {
            message.success('Record deleted successfully');
            fetchRecords();
        }
    };

    const handleModalSuccess = () => {
        setModalVisible(false);
        fetchRecords();
    };

    return (
        <div>
            <div className={classes.searchContainer}>
                <h2 style={{ marginRight: 'auto' }}>Daily Sales Records</h2>
                <Input
                    placeholder="Search records..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={classes.searchField}
                />
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedRecordId(undefined);
                        setModalVisible(true);
                    }}
                >
                    Add New Record
                </Button>
            </div>
            
            {loading && records.length === 0 ? (
                <Spin size="large" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredRecords}
                    rowKey="dailySalesRecordId"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size || 10);
                        }
                    }}
                    components={{
                        header: {
                            cell: (props: any) => (
                                <th className={classes.tableHeader} {...props} />
                            ),
                        },
                    }}
                />
            )}
            
            <DailySalesRecordForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSuccess={handleModalSuccess}
                recordId={selectedRecordId}
            />
        </div>
    );
};

export default DailySalesRecordList;