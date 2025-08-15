import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Box,
  Button,
  CircularProgress,
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
import { ClassroomService } from '../../utilities/services';
import { IClassRoom } from '../../interfaces';
import RoomIcon from '@material-ui/icons/Room';
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
  facilityChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
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
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const ClassroomDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [classroom, setClassroom] = useState<IClassRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        if (!id) {
          throw new Error('No ID provided');
        }
        
        setLoading(true);
        const data = await ClassroomService.getById(parseInt(id));
        setClassroom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load classroom');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) {
    return (
      <Container className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
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

  if (!classroom) {
    return (
      <Container className={classes.root}>
        <Typography>Classroom not found</Typography>
      </Container>
    );
  }

  const facilityData = [
    { label: 'Projector', value: classroom.hasProjector },
    { label: 'Air Conditioning', value: classroom.hasAirConditioning },
    { label: 'Whiteboard', value: classroom.hasWhiteboard },
    { label: 'Sound System', value: classroom.hasSoundSystem },
    { label: 'Internet Access', value: classroom.hasInternetAccess },
  ];

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Classroom Details</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/classrooms/edit/${classroom.classRoomId}`)}
        >
          Edit Classroom
        </Button>
      </Box>

      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Basic Info Section */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar className={classes.avatar}>
                <RoomIcon style={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" align="center">Class Room Name:
                <b>{classroom.roomName}</b>
              </Typography>
              
              
              <Box mt={2} className={classroom.isActive ? classes.statusActive : classes.statusInactive}>
                {classroom.isActive ? (
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
            {/* Basic Information */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Seat Capacity:</Typography>
                <Typography>{classroom.seatCapacity}</Typography>
              </Grid>
              
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2">Location:</Typography>
                <Typography>{classroom.location}</Typography>
              </Grid>
              
              {classroom.additionalFacilities && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Additional Facilities:</Typography>
                  <Typography>{classroom.additionalFacilities}</Typography>
                </Grid>
              )}
              
              {classroom.remarks && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Remarks:</Typography>
                  <Typography>{classroom.remarks}</Typography>
                </Grid>
              )}
            </Grid>
            
            {/* Facilities Section */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Facilities
            </Typography>
            
            <Box display="flex" flexWrap="wrap">
              {facilityData.map((facility) => (
                facility.value && (
                  <Chip
                    key={facility.label}
                    label={facility.label}
                    className={classes.facilityChip}
                  />
                )
              ))}
            </Box>
            
            {/* Assigned Courses Section */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Assigned Courses
            </Typography>
            
            {classroom.classRoomCourse_Junction_Tables?.length || classroom.assignedCourses?.length ? (
              <TableContainer component={Paper} className={classes.table}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(classroom.classRoomCourse_Junction_Tables || classroom.assignedCourses || []).map((junction) => {
                      const courseName = junction.course?.courseName 
                                       || `Course ${junction.courseId}`;
                      
                      return (
                        <TableRow key={`${junction.classRoomId}-${junction.courseId}`}>
                          <TableCell>{courseName}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={junction.isAvailable ? 'Available' : 'Unavailable'}
                              color={junction.isAvailable ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No courses assigned to this classroom
              </Typography>
            )}
          </Grid>
        </Grid>
        
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button 
            variant="outlined" 
            color="default"
            onClick={() => navigate('/classrooms')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};