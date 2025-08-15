// components/pages/BatchDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Grid, Box, Divider,
  Chip, CircularProgress, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { IBatchDetails } from '../../interfaces/IBatch';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import { BatchService } from '../../utilities/services/batchService';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  paper: { padding: theme.spacing(3), marginTop: theme.spacing(2) },
  sectionTitle: { 
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(1)}px`, 
    fontWeight: 'bold' 
  },
  detailRow: { marginBottom: theme.spacing(1) },
  detailLabel: { fontWeight: 'bold', marginRight: theme.spacing(1) },
  chip: { marginRight: theme.spacing(1), marginBottom: theme.spacing(1) },
  backButton: { marginBottom: theme.spacing(2) }
}));

export const BatchDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<IBatchDetails | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadBatch = async () => {
    try {
      if (!id) {
        // Handle the case where id is undefined
        console.error('No batch ID provided');
        return;
      }

      setLoading(true);
      const batchId = parseInt(id);
      
      if (isNaN(batchId)) {
        console.error('Invalid batch ID format');
        return;
      }

      const data = await BatchService.getByIdd(batchId);
      setBatch(data);
    } catch (error) {
      console.error('Failed to load batch details', error);
    } finally {
      setLoading(false);
    }
  };

  loadBatch();
}, [id]);

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  if (!batch) {
    return (
      <Container className={classes.root}>
        <Typography>Batch not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/batches')}
        className={classes.backButton}
        variant="outlined"
      >
        Back to List
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Batch Details</Typography>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          color="primary"
          onClick={() => navigate(`/batches/edit/${batch.batchId}`)}
        >
          Edit
        </Button>
      </Box>

      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Batch Name:</Typography>
              <Typography component="span">{batch.batchName}</Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Course:</Typography>
              <Typography component="span">{batch.courseName}</Typography>
            </Box>

          <Box className={classes.detailRow}>
        <Typography component="span" className={classes.detailLabel}>Instructor:</Typography>
        <Typography component="span">{batch.instructorName || "N/A"}</Typography>
        </Box>

           {batch.previousInstructorNames && batch.previousInstructorNames.length > 0 && (
            <Box className={classes.detailRow}>
                <Typography component="span" className={classes.detailLabel}>Previously Assigned:</Typography>
                <Box display="flex" flexWrap="wrap">
                {batch.previousInstructorNames.map((name, index) => (
                    <Chip key={index} label={name} className={classes.chip} />
                ))}
                </Box>
            </Box>
            )}


            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Classroom:</Typography>
              <Typography component="span">{batch.classRoomName}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Schedule Information
            </Typography>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Start Date:</Typography>
              <Typography component="span">{new Date(batch.startDate).toLocaleDateString()}</Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>End Date:</Typography>
              <Typography component="span">{batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'N/A'}</Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Batch Type:</Typography>
              <Typography component="span">{batch.batchType}</Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography component="span" className={classes.detailLabel}>Status:</Typography>
              <Typography component="span">{batch.isActive ? 'Active' : 'Inactive'}</Typography>
            </Box>
          </Grid>

          {/* Remarks */}
          {batch.remarks && (
            <Grid item xs={12}>
              <Box className={classes.detailRow}>
                <Typography component="span" className={classes.detailLabel}>Remarks:</Typography>
                <Typography component="span">{batch.remarks}</Typography>
              </Box>
            </Grid>
          )}

          {/* Class Schedules */}
          <Grid item xs={12}>
            <Divider />
            <Typography variant="h6" className={classes.sectionTitle}>
              Class Schedules
            </Typography>

            {batch.selectedScheduleIds && batch.selectedScheduleIds.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Days</TableCell>
                      <TableCell>Slot Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batch.schedules?.map(schedule => (
                      <TableRow key={schedule.classScheduleId}>
                        <TableCell>{schedule.selectedDays}</TableCell>
                        <TableCell>{schedule.slot?.startTimeString} - {schedule.slot?.endTimeString}</TableCell>
                        <TableCell>{schedule.isActive ? 'Active' : 'Inactive'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No schedules assigned</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};