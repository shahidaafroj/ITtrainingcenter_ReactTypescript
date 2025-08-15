import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  CircularProgress,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { ClassroomService, CourseService } from '../../utilities/services';
import { IClassRoom, ICourse, IClassroomCourseJunction } from '../../interfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

export const ClassroomForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [formData, setFormData] = useState<IClassRoom>({
    classRoomId: 0,
    roomName: '',
    seatCapacity: 30,
    location: '',
    hasProjector: false,
    hasAirConditioning: false,
    hasWhiteboard: false,
    hasSoundSystem: false,
    hasInternetAccess: false,
    isActive: true,
    remarks: '',
    additionalFacilities: '',
    classRoomCourse_Junction_Tables: [],
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData] = await Promise.all([
        CourseService.getAll(),
      ]);
      setCourses(coursesData);
      
      if (id && id !== 'new') {
        const classroomData = await ClassroomService.getById(parseInt(id));
        console.log('API Response:', classroomData);
        
        // রেস্পন্স ম্যাপিং করুন
        const formattedData = {
          ...classroomData,
          classRoomCourse_Junction_Tables: classroomData.assignedCourses || []
        };
        
        setFormData(formattedData);
        console.log('Form Data after set:', formattedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbarMessage('Failed to load data');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddCourse = () => {
    if (selectedCourseId && !formData.classRoomCourse_Junction_Tables?.some(j => j.courseId === selectedCourseId)) {
      const course = courses.find(c => c.courseId === selectedCourseId);
      if (course) {
        const newJunction: IClassroomCourseJunction = {
          classRoomCourseId: 0,
          classRoomId: formData.classRoomId,
          courseId: selectedCourseId,
          course: course,
          isAvailable: true
        };
        
        setFormData({
          ...formData,
          classRoomCourse_Junction_Tables: [...(formData.classRoomCourse_Junction_Tables || []), newJunction],
        });
        setSelectedCourseId(0);
      }
    }
  };

  const handleRemoveCourse = (courseId: number) => {
    setFormData({
      ...formData,
      classRoomCourse_Junction_Tables: formData.classRoomCourse_Junction_Tables?.filter(j => j.courseId !== courseId),
    });
  };

  const handleToggleCourseAvailability = (courseId: number) => {
    setFormData({
      ...formData,
      classRoomCourse_Junction_Tables: formData.classRoomCourse_Junction_Tables?.map(j =>
        j.courseId === courseId ? { ...j, isAvailable: !j.isAvailable } : j
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (formData.classRoomId > 0) {
        await ClassroomService.update(formData.classRoomId, formData);
        setSnackbarMessage('Classroom updated successfully');
      } else {
        await ClassroomService.create(formData);
        setSnackbarMessage('Classroom created successfully');
      }
      
      setSnackbarOpen(true);
      setTimeout(() => navigate('/classrooms'), 1500);
    } catch (error) {
      console.error('Error saving classroom:', error);
      setSnackbarMessage('Failed to save classroom');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const facilityChips = [
    { label: 'Projector', value: formData.hasProjector, name: 'hasProjector' },
    { label: 'AC', value: formData.hasAirConditioning, name: 'hasAirConditioning' },
    { label: 'Whiteboard', value: formData.hasWhiteboard, name: 'hasWhiteboard' },
    { label: 'Sound System', value: formData.hasSoundSystem, name: 'hasSoundSystem' },
    { label: 'Internet', value: formData.hasInternetAccess, name: 'hasInternetAccess' },
  ];

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Classroom' : 'Add New Classroom'}
      </Typography>
      
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Room Name"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  className={classes.formField}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Seat Capacity"
                  name="seatCapacity"
                  type="number"
                  value={formData.seatCapacity}
                  onChange={handleInputChange}
                  className={classes.formField}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={classes.formField}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Facilities:</Typography>
                <Box display="flex" flexWrap="wrap" mb={2}>
                  {facilityChips.map((facility) => (
                    <FormControlLabel
                      key={facility.name}
                      control={
                        <Checkbox
                          checked={facility.value}
                          onChange={handleInputChange}
                          name={facility.name}
                          color="primary"
                        />
                      }
                      label={facility.label}
                      className={classes.facilityChip}
                    />
                  ))}
                </Box>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                  className={classes.formField}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Facilities"
                  name="additionalFacilities"
                  value={formData.additionalFacilities}
                  onChange={handleInputChange}
                  className={classes.formField}
                  multiline
                  rows={2}
                />
                
                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className={classes.formField}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Course Assignment Section */}
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Course Assignment
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value as number)}
                    label="Select Course"
                  >
                    <MenuItem value={0}>Select a course</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={4} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddCourse}
                  disabled={!selectedCourseId}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <TableContainer component={Paper} className={classes.table}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
  {(formData.classRoomCourse_Junction_Tables || formData.assignedCourses || []).length > 0 ? (
    (formData.classRoomCourse_Junction_Tables || formData.assignedCourses || []).map((junction) => {
      const courseName = junction.course?.courseName 
                       || courses.find(c => c.courseId === junction.courseId)?.courseName 
                       || `Course ${junction.courseId}`;
                          
                          return (
                            <TableRow key={`${junction.classRoomId}-${junction.courseId}`}>
                              <TableCell>
                                {courseName}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={junction.isAvailable ? 'Available' : 'Unavailable'}
                                  color={junction.isAvailable ? 'primary' : 'default'}
                                  size="small"
                                  onClick={() => handleToggleCourseAvailability(junction.courseId)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleRemoveCourse(junction.courseId)}
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No courses assigned
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Form Actions */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate('/classrooms')}
              style={{ marginRight: 16 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </form>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};