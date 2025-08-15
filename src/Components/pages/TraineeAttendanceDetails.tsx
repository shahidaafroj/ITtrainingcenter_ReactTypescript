import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  FormControl
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { ITraineeAttendance, ITraineeAttendanceDetail } from '../../interfaces/ITraineeAttendance';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import { TraineeAttendanceService } from '../../utilities/services/traineeAttendanceService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  presentChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
  absentChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export const TraineeAttendanceDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<ITraineeAttendance | null>(null);
  const [relatedAttendances, setRelatedAttendances] = useState<ITraineeAttendance[]>([]);
  const [attendanceDetails, setAttendanceDetails] = useState<ITraineeAttendanceDetail[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Attendance ID is required');
        }

        const numericId = parseInt(id);
        const attendanceData = await TraineeAttendanceService.getAttendanceById(numericId);
           console.log('Instructor data:', {
        rootInstructor: attendanceData.instructor,
        batchInstructor: attendanceData.batch?.instructor,
       
      });
        
        console.log('Fetched Attendance:', attendanceData);

        setAttendance(attendanceData);
        
        // Use the details from the main attendance record
        if (attendanceData.traineeAttendanceDetails) {
          setAttendanceDetails(attendanceData.traineeAttendanceDetails);
        }
      } catch (error) {
        console.error('Error fetching attendance details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    if (attendance) {
      navigate(`/attendances/edit/${attendance.traineeAttendanceId}`);
    }
  };

  // Helper functions to safely access nested data
  const getInstructorName = (attendance: ITraineeAttendance) => {
  // First try batch.instructor path (most reliable based on your data)
  if (attendance.batch?.instructor?.employee) {
    return attendance.batch.instructor.employee.employeeName;
  }
  
  // Then try root instructor path (may be null in your case)
  if (attendance.instructor?.employee) {
    return attendance.instructor.employee.employeeName;
  }
  
  // Fallback to direct property if available
  if (attendance.instructorName) {
    return attendance.instructorName;
  }
  
  return 'N/A';
};

const getTraineeDisplayName = (detail: ITraineeAttendanceDetail) => {
  const name = detail.trainee?.Registration?.traineeName || 
               detail.traineeName || 
               `Trainee ${detail.traineeId}`;
  
  const idNo = detail.trainee?.traineeIDNo || 
               detail.traineeId.toString().padStart(6, '0');
  
  return `${name}-(${idNo})`;
};

  const getAdmissionNo = (detail: ITraineeAttendanceDetail) => {
    return detail.admission?.admissionNo || 
           detail.admissionNo || 
           detail.admissionId?.toString() || '-';
  };

  const getInvoiceNo = (detail: ITraineeAttendanceDetail) => {
    return detail.invoice?.invoiceNo || 
           detail.invoiceNo || 
           detail.invoiceId?.toString() || '-';
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  if (!attendance) {
    return (
      <Container className={classes.root}>
        <Typography variant="h6">Attendance record not found</Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/attendances')}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.header}>
          <Typography variant="h4">Attendance Details</Typography>
          <div>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/attendances')}
              style={{ marginRight: 16 }}
            >
              Back to List
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </Box>

        {/* Session Information Section */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Session Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={classes.formField}>
              <TextField
                label="Date"
                value={new Date(attendance.attendanceDate).toLocaleDateString()}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={classes.formField}>
              <TextField
                label="Batch Name"
                value={attendance.batch?.batchName || 'N/A'}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={classes.formField}>
             <TextField
              label="Instructor Name"
              value={getInstructorName(attendance)}
              InputProps={{ readOnly: true }}
            />
            </FormControl>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />

        {/* Attendance Details Table */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Attendance Records
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Trainee Name</TableCell>
                <TableCell className={classes.tableHeader}>Admission No</TableCell>
                <TableCell className={classes.tableHeader}>Invoice No</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
                <TableCell className={classes.tableHeader}>Marked Time</TableCell>
                <TableCell className={classes.tableHeader}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceDetails.length > 0 ? (
                attendanceDetails.map((detail) => (
                  <TableRow key={detail.traineeAttendanceDetailId}>
                  <TableCell>{getTraineeDisplayName(detail)}</TableCell>
                     <TableCell>{getAdmissionNo(detail)}</TableCell>
                    <TableCell>{getInvoiceNo(detail)}</TableCell>
                    <TableCell>
                      <Chip
                        label={detail.attendanceStatus ? 'Present' : 'Absent'}
                        className={detail.attendanceStatus ? classes.presentChip : classes.absentChip}
                        icon={detail.attendanceStatus ? <CheckCircleIcon /> : <CancelIcon />}
                      />
                    </TableCell>
                    <TableCell>{detail.markedTime || '-'}</TableCell>
                    <TableCell>{detail.remarks || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No attendance records found for this session
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};