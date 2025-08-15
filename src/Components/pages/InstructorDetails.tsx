import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider,
  Chip,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { InstructorService } from '../../utilities/services';
import { IInstructor, IInstructorCourse } from '../../interfaces/IInstructor';
import PersonIcon from '@material-ui/icons/Person';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  table: {
    marginTop: theme.spacing(2),
  },
  statusActive: {
    color: theme.palette.success.main,
    display: 'flex',
    alignItems: 'center',
  },
  statusInactive: {
    color: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
  },
}));

export const InstructorDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchInstructor = async () => {
    try {
      if (!id) {
        throw new Error('No ID provided');
      }
      
      const instructorId = parseInt(id);
      if (isNaN(instructorId)) {
        throw new Error('Invalid ID format');
      }

      setLoading(true);
      const data = await InstructorService.getById(instructorId);
      setInstructor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instructor');
    } finally {
      setLoading(false);
    }
  };

  fetchInstructor();
}, [id]);

  if (loading) {
    return (
      <Container className={classes.root}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!instructor) {
    return (
      <Container className={classes.root}>
        <Typography>Instructor not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Instructor Details</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/instructors/edit/${instructor.instructorId}`)}
        >
          Edit Instructor
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Basic Info Section */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar className={classes.avatar}>
                <PersonIcon style={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" align="center"> Instructor Name: 
                <b>{instructor.employeeName}</b>
              </Typography>
             
              
              <Box mt={2} className={instructor.isActive ? classes.statusActive : classes.statusInactive}>
                {instructor.isActive ? (
                  <>
                    <CheckCircleIcon style={{ marginRight: 8 }} />
                    <Typography>Active</Typography>
                  </>
                ) : (
                  <>
                    <CancelIcon style={{ marginRight: 8 }} />
                    <Typography>Inactive</Typography>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Personal Details */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Instructor Name:</Typography>
                <Typography>{instructor.employeeName}</Typography>
              </Grid>
             
              
              {instructor.remarks && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Remarks:</Typography>
                  <Typography style={{ whiteSpace: 'pre-line' }}>{instructor.remarks}</Typography>
                </Grid>
              )}
            </Grid>
            
            {/* Assigned Courses */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Assigned Courses
            </Typography>
            
            {instructor.selectedCourseIds && instructor.selectedCourseIds.length > 0 ? (
              <Box>
                <Typography variant="subtitle2">Specializations:</Typography>
                <Box display="flex" flexWrap="wrap" my={1}>
                  {instructor.selectedCourseIds.map(courseId => {
                    const course = instructor.courses?.find(c => c.courseId === courseId);
                    return (
                      <Chip
                        key={courseId}
                        label={course?.courseName || `Course ${courseId}`}
                        className={classes.chip}
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
                
                <TableContainer component={Paper} className={classes.table}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Primary Instructor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {instructor.courses?.map((course: IInstructorCourse) => (
                        <TableRow key={course.instructorCourseId}>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>
                            {course.isPrimaryInstructor ? 'Yes' : 'No'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No courses assigned to this instructor.
              </Typography>
            )}
            
            {/* Batch Planning Assignments */}
            {instructor.assignedBatchPlanningIds && instructor.assignedBatchPlanningIds.length > 0 && (
              <>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Batch Planning Assignments
                </Typography>
                
                <TableContainer component={Paper} className={classes.table}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Batch Planning ID</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Start Month</TableCell>
                      </TableRow>
                    </TableHead>
                  
                  </Table>
                </TableContainer>
              </>
            )}
          </Grid>
        </Grid>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/instructors')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};