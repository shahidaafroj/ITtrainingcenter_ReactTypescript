import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IDailySalesRecord } from '../../interfaces/IDailySalesRecord';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Divider
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { DailySalesRecordService } from '../../utilities/services';

export const DailySalesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<IDailySalesRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const data = await DailySalesRecordService.getById(parseInt(id));
          setRecord(data);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Container><Typography>Loading...</Typography></Container>;
  if (!record) return <Container><Typography>No record found</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/daily-sales-records')}
          variant="outlined"
        >
          Back
        </Button>
      </Box>

      <Paper style={{ padding: 24, marginTop: 24 }}>
        <Typography variant="h5" gutterBottom>
          Daily Sales Record Details
        </Typography>

        <Grid container spacing={3}>
          {/* === Basic Info === */}
          <Grid item xs={12} sm={6}>
            <Typography><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Employee:</strong> {record.employee?.employeeName || record.employeeName || 'N/A'}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider style={{ margin: '16px 0' }} />
          </Grid>

          {/* === Cold Calls & Leads === */}
          <Grid item xs={12} sm={4}>
            <Typography><strong>Cold Calls Made:</strong> {record.coldCallsMade}</Typography>
          </Grid>
         
          {/* === Meetings, Walk-ins, Evaluations === */}
          <Grid item xs={12} sm={4}>
            <Typography><strong>Meetings Scheduled:</strong> {record.meetingsScheduled}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography><strong>Meetings Conducted:</strong> {record.meetingsConducted}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography><strong>Walk-ins Attended:</strong> {record.walkInsAttended}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography><strong>Evaluations Attended:</strong> {record.evaluationsAttended}</Typography>
          </Grid>

          {/* === Visitors === */}
          <Grid item xs={12} sm={6}>
            <Typography><strong>Visitor No:</strong> {record.visitorNo || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Walk-in Visitor No:</strong> {record.walkInVisitorNo || 'N/A'}</Typography>
          </Grid>

          {/* === Corporate Visits === */}
          <Grid item xs={12} sm={6}>
            <Typography><strong>Corporate Visits Scheduled:</strong> {record.corporateVisitsScheduled}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Corporate Visits Conducted:</strong> {record.corporateVisitsConducted}</Typography>
          </Grid>

          {/* === Admissions & Collections === */}
          <Grid item xs={12} sm={4}>
            <Typography><strong>New Registrations:</strong> {record.newRegistrations}</Typography>
          </Grid>
         
          <Grid item xs={12} sm={4}>
            <Typography><strong>Enrollments:</strong> {record.enrollments}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
            <strong>New Collections:</strong> ৳{(record.newCollections ?? 0).toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography>
            <strong>Due Collections:</strong> ৳{(record.dueCollections ?? 0).toFixed(2)}
            </Typography>
          </Grid>

          {/* === Remarks === */}
          {record.remarks && (
            <Grid item xs={12}>
              <Typography><strong>Remarks:</strong> {record.remarks}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
