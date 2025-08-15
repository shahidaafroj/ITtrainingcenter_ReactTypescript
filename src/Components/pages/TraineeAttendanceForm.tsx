import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Snackbar,
  IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BatchService } from '../../utilities/services/batchService';
import { InstructorService } from '../../utilities/services/instructorService';
import { TraineeAttendanceService } from '../../utilities/services/traineeAttendanceService';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import { ITraineeAttendance } from '../../interfaces/ITraineeAttendance';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  presentIcon: {
    color: theme.palette.success.main,
  },
  absentIcon: {
    color: theme.palette.error.main,
  },
}));

interface FormData {
  attendanceDate: string;
  batchId: number;
  instructorId: number;
  instructorName?: string;
  details: {
    traineeAttendanceDetailId?: number;
    traineeId: number;
    traineeName: string;
    admissionId: number;
    admissionNo: string;
    invoiceId?: number | null;
    invoiceNo?: string;
    attendanceStatus: boolean;
    remarks?: string;
  }[];
}

export const TraineeAttendanceForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id, batchId } = useParams<{ id?: string, batchId?: string }>();
  
  const [isEditMode] = useState(!!id);  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [batches, setBatches] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    attendanceDate:  new Date().toISOString().split('T')[0],
    batchId: 0,
    instructorId: 0,
    details: []
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [batchData, instructorData] = await Promise.all([
          BatchService.getAll(),
          InstructorService.getAll()
        ]);
        
        setBatches(batchData);
        setInstructors(instructorData);

        if (isEditMode && id) {
          // EDIT MODE - Fetch existing attendance by ID
          const attendanceData = await TraineeAttendanceService.getAttendanceById(Number(id));
          
          if (attendanceData) {
            // Get batch details to show all trainees
            const batchDetails = await TraineeAttendanceService.getBatchDetails(attendanceData.batchId);
            
            const traineeList = batchDetails.trainees.map((t: any) => {
              const existingDetail = attendanceData.traineeAttendanceDetails?.find(
                d => d.traineeId === t.traineeId
              );
              
              return {
                traineeAttendanceDetailId: existingDetail?.traineeAttendanceDetailId,
                traineeId: t.traineeId,
                traineeName: t.traineeName,
                admissionId: t.admissionId,
                admissionNo: t.admissionNo,
                invoiceId: t.invoiceNos?.[0]?.invoiceId || null,
                invoiceNo: t.invoiceNos?.[0]?.invoiceNo || '',
                attendanceStatus: existingDetail?.attendanceStatus ?? false,
                remarks: existingDetail?.remarks || ''
              };
            });

            setFormData({
              attendanceDate: attendanceData.attendanceDate.split('T')[0],
              batchId: attendanceData.batchId,
              instructorId: attendanceData.instructorId,
              instructorName: attendanceData.instructor?.employee?.employeeName || '',
              details: traineeList
            });
          }
        } else if (batchId) {
          // CREATE MODE with pre-selected batch
          const numericBatchId = parseInt(batchId);
          const batchDetails = await TraineeAttendanceService.getBatchDetails(numericBatchId);
          
          const traineeList = batchDetails.trainees.map((t: any) => ({
            traineeId: t.traineeId,
            traineeName: t.traineeName,
            admissionId: t.admissionId,
            admissionNo: t.admissionNo,
            invoiceId: t.invoiceNos?.[0]?.invoiceId || null,
            invoiceNo: t.invoiceNos?.[0]?.invoiceNo || '',
            attendanceStatus: false,
            remarks: ''
          }));
          
          setFormData({
            attendanceDate: new Date().toISOString().split('T')[0],
            batchId: numericBatchId,
            instructorId: batchDetails.instructorId,
            instructorName: batchDetails.instructorName,
            details: traineeList
          });
        }
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, batchId, isEditMode]);

  const handleBatchChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBatchId = e.target.value as number;
    
    try {
      setLoading(true);
      const batchDetails = await TraineeAttendanceService.getBatchDetails(selectedBatchId);
      
      const traineeList = batchDetails.trainees.map((t: any) => ({
        traineeId: t.traineeId,
        traineeName: t.traineeName,
        admissionId: t.admissionId,
        admissionNo: t.admissionNo,
        invoiceId: t.invoiceNos?.[0]?.invoiceId || null,
        invoiceNo: t.invoiceNos?.[0]?.invoiceNo || '',
        attendanceStatus: false,
        remarks: ''
      }));
      
      setFormData({
        attendanceDate: formData.attendanceDate,
        batchId: selectedBatchId,
        instructorId: batchDetails.instructorId,
        instructorName: batchDetails.instructorName,
        details: traineeList
      });
    } catch (error) {
      console.error('Error loading batch details:', error);
      setError('Failed to load batch details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendanceToggle = (index: number) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index].attendanceStatus = !updatedDetails[index].attendanceStatus;
    setFormData(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  const handleRemarksChange = (index: number, value: string) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index].remarks = value;
    setFormData(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      const submissionData: ITraineeAttendance = {
        traineeAttendanceId: isEditMode && id ? Number(id) : undefined,
        attendanceDate: formData.attendanceDate,
        batchId: formData.batchId,
        instructorId: formData.instructorId,
        traineeAttendanceDetails: formData.details.map(detail => ({
          traineeAttendanceDetailId: detail.traineeAttendanceDetailId,
          traineeId: detail.traineeId,
          admissionId: detail.admissionId,
          invoiceId: detail.invoiceId || null,
          attendanceStatus: detail.attendanceStatus,
          remarks: detail.remarks || null,
          markedTime: detail.attendanceStatus ? 
            new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false}) : null
        }))
      };

      if (isEditMode && id) {
        await TraineeAttendanceService.updateAttendance(Number(id),submissionData);
        setSnackbarMessage('Attendance updated successfully!');
      } else {
        await TraineeAttendanceService.createAttendance(submissionData);
        setSnackbarMessage('Attendance created successfully!');
      }
      
      setSnackbarOpen(true);
      setTimeout(() => navigate('/attendances'), 2000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      setError('Failed to save attendance. Please check all fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Attendance' : 'Create New Attendance'}
      </Typography>
      
      {error && (
        <Typography color="error" gutterBottom>{error}</Typography>
      )}

      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Attendance Date"
                type="date"
                name="attendanceDate"
                value={formData.attendanceDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                className={classes.formField}
                required
                disabled={isEditMode} // Disable date editing in edit mode
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={formData.batchId}
                  onChange={handleBatchChange}
                  label="Batch"
                  required
                  disabled={isEditMode} // Disable batch selection in edit mode
                >
                  <MenuItem value={0}>Select a batch</MenuItem>
                  {batches.map(batch => (
                    <MenuItem key={batch.batchId} value={batch.batchId}>
                      {batch.batchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Instructor Name"
                value={formData.instructorName || ''}
                InputProps={{ readOnly: true }}
                className={classes.formField}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="h6" gutterBottom>
                Attendance Details
              </Typography>
              
              {formData.details.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeader}>Trainee</TableCell>
                        <TableCell className={classes.tableHeader}>Admission No</TableCell>
                        <TableCell className={classes.tableHeader}>Invoice No</TableCell>
                        <TableCell className={classes.tableHeader}>Status</TableCell>
                        <TableCell className={classes.tableHeader}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.details.map((detail, index) => (
                        <TableRow key={detail.traineeId}>
                          <TableCell>{detail.traineeName}</TableCell>
                          <TableCell>{detail.admissionNo}</TableCell>
                          <TableCell>{detail.invoiceNo || 'N/A'}</TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={detail.attendanceStatus}
                                  onChange={() => handleAttendanceToggle(index)}
                                  icon={<CancelIcon className={classes.absentIcon} />}
                                  checkedIcon={<CheckCircleIcon className={classes.presentIcon} />}
                                />
                              }
                              label={detail.attendanceStatus ? 'Present' : 'Absent'}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={detail.remarks || ''}
                              onChange={(e) => handleRemarksChange(index, e.target.value)}
                              placeholder="Remarks"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {formData.batchId ? 'No trainees found for the selected batch' : 'Please select a batch first'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="default"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/attendances')}
                  style={{ marginRight: 16 }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={saving || formData.details.length === 0}
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update Attendance' : 'Save Attendance'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};