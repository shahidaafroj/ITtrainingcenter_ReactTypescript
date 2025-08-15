import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select, Table, message, Typography, Row, Col, Space } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { DailySalesRecordService } from '../../utilities/services';
import { useEmployeeHook } from '../../hooks';
import { IEmployee, IDailySalesRecord } from '../../interfaces';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EmployeeSalesReport: React.FC = () => {
  const { data: employees } = useEmployeeHook();
  const [employeeId, setEmployeeId] = useState<number>();
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>();
  const [records, setRecords] = useState<IDailySalesRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Find selected employee name
  const selectedEmployee = employees?.find(emp => emp.employeeId === employeeId);
  const employeeName = selectedEmployee ? selectedEmployee.employeeName : '';

  const handleShowReport = async () => {
    if (!employeeId || !dates) {
      message.warning('Please select employee and date range');
      return;
    }

    setLoading(true);
    try {
      const res = await DailySalesRecordService.getByEmployeeAndDateRange(
        employeeId,
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      );
      setRecords(res);
    } catch (err) {
      message.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'New Collection (৳)',
      dataIndex: 'newCollections',
    },
    {
      title: 'Due Collection (৳)',
      dataIndex: 'dueCollections',
    },
  ];

  const totalNew = records.reduce((sum, r) => sum + (r.newCollections || 0), 0);
  const totalDue = records.reduce((sum, r) => sum + (r.dueCollections || 0), 0);
  const grandTotal = totalNew + totalDue;

  const handleDownloadExcel = () => {
    const data = records.map(r => ({
      Date: moment(r.date).format('YYYY-MM-DD'),
      'New Collection': r.newCollections,
      'Due Collection': r.dueCollections,
    }));

    const ws = XLSX.utils.aoa_to_sheet([['Employee Name:', employeeName], []]); // Employee name + blank row
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A4', skipHeader: false });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'Employee_Sales_Report.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Employee Sales Report', 14, 14);

    doc.setFontSize(12);
    doc.text(`Employee: ${employeeName}`, 14, 22);

    const tableData = records.map(r => [
      moment(r.date).format('YYYY-MM-DD'),
      r.newCollections.toFixed(2),
      r.dueCollections.toFixed(2),
    ]);

    (doc as any).autoTable({
      startY: 28,
      head: [['Date', 'New Collection', 'Due Collection']],
      body: tableData,
      foot: [['Total', totalNew.toFixed(2), totalDue.toFixed(2)]],
    });

    doc.save('Employee_Sales_Report.pdf');
  };

  return (
    <div>
      <Typography.Title level={3}>Employee Sales Report</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            placeholder="Select Employee"
            style={{ width: '100%' }}
            onChange={(value) => setEmployeeId(value)}
            value={employeeId}
          >
            {employees?.map(emp => (
              <Option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={(val) => setDates(val as [moment.Moment, moment.Moment])}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleShowReport}
          >
            Show Report
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={records}
        rowKey="dailySalesRecordId"
        loading={loading}
        pagination={false}
        footer={() => (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text strong>Total New Collection: ৳{totalNew.toFixed(2)}</Typography.Text>
            <Typography.Text strong>Total Due Collection: ৳{totalDue.toFixed(2)}</Typography.Text>
            <Typography.Text strong style={{ fontSize: 16 }}>
              Grand Total: ৳{grandTotal.toFixed(2)}
            </Typography.Text>
          </Space>
        )}
      />

      <Space style={{ marginTop: 16 }}>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
          Download PDF
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </Space>
    </div>
  );
};

export default EmployeeSalesReport;
