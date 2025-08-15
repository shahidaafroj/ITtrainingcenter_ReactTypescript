import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box, 
  FormControlLabel, 
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Divider,
    IconButton,
  CircularProgress,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { InstructorService, EmployeeService, CourseService } from '../../utilities/services';
import { ICourse, IEmployee } from '../../interfaces';
import { IInstructor } from '../../interfaces/IInstructor';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
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
}));



const CustomAlert = ({ severity, message, onClose }: { 
  severity: 'success' | 'error', 
  message: string, 
  onClose: () => void 
}) => {
  const alertStyle = {
    success: {
      backgroundColor: '#4caf50',
      color: 'white'
    },
    error: {
      backgroundColor: '#f44336',
      color: 'white'
    }
  };

  return (
    <Paper 
      elevation={6} 
      style={{
        padding: '12px 16px',
        borderRadius: '4px',
        ...alertStyle[severity],
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '300px'
      }}
    >
      <Typography variant="body1">{message}</Typography>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};


export const InstructorForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  // State management
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<IInstructor>({
    instructorId: 0,
    employeeId: 0,
    employeeName: '',
    isActive: true,
    remarks: '',
    selectedCourseIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchCourses(), fetchEmployees()]);
        
        if (id && id !== 'new') {
          await fetchInstructor(parseInt(id));
        }
      } catch (err) {
        setError('Failed to load data');
        showSnackbar('Failed to load data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchInstructor = async (id: number) => {
    try {
      const data = await InstructorService.getById(id);
      setFormData({
        ...data,
        selectedCourseIds: data.selectedCourseIds || [],
        employeeName: data.employeeName || ''
      });
    } catch (error) {
      console.error('Error fetching instructor:', error);
      throw error;
    }
  };

  const fetchCourses = async () => {
    try {
      setIsFetchingCourses(true);
      const data = await CourseService.getAll(); // Using CourseService instead of InstructorService
      console.log('Courses data:', data); // Debug log
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
      throw error;
    } finally {
      setIsFetchingCourses(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const selectedEmployeeId = e.target.value as number;
    const selectedEmployee = employees.find(e => e.employeeId === selectedEmployeeId);
    
    setFormData({
      ...formData,
      employeeId: selectedEmployeeId,
      employeeName: selectedEmployee?.employeeName || '',
    });
  };

  const handleAddCourse = () => {
    if (selectedCourseId && !formData.selectedCourseIds.includes(selectedCourseId)) {
      setFormData({
        ...formData,
        selectedCourseIds: [...formData.selectedCourseIds, selectedCourseId],
      });
      setSelectedCourseId(0);
    }
  };

  const handleRemoveCourse = (courseId: number) => {
    setFormData({
      ...formData,
      selectedCourseIds: formData.selectedCourseIds.filter(id => id !== courseId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (formData.instructorId > 0) {
        await InstructorService.update(formData.instructorId, formData);
        showSnackbar('Instructor updated successfully', 'success');
      } else {
        await InstructorService.create(formData);
        showSnackbar('Instructor created successfully', 'success');
      }
      
      setTimeout(() => navigate('/instructors'), 1500);
    } catch (error) {
      console.error('Error saving instructor:', error);
      showSnackbar('Failed to save instructor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Instructor' : 'Add New Instructor'}
      </Typography>
      
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Employee Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={formData.employeeId}
                  onChange={handleEmployeeChange}
                  label="Employee"
                  required
                >
                  <MenuItem value={0}>Select an employee</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.employeeId} value={employee.employeeId}>
                      {employee.employeeName} 
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Active Status */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Active"
                className={classes.formField}
              />
            </Grid>
            
            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                className={classes.formField}
                multiline
                rows={3}
              />
            </Grid>
            
            {/* Course Assignment */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" className={classes.sectionTitle}>
                Assign Courses
              </Typography>
              
              {isFetchingCourses ? (
                <div className={classes.loading}>
                  <CircularProgress />
                </div>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8} md={4}>
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
                    
                    <Grid item xs={4} md={2}>
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
                      <Box className={classes.chips}>
                        {formData.selectedCourseIds.map((courseId) => {
                          const course = courses.find(c => c.courseId === courseId);
                          return (
                            <Chip
                              key={courseId}
                              label={course?.courseName || `Course ${courseId}`}
                              onDelete={() => handleRemoveCourse(courseId)}
                              color="primary"
                              variant="outlined"
                            />
                          );
                        })}
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => navigate('/instructors')}
                  style={{ marginRight: 16 }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <CustomAlert 
    severity={snackbarSeverity} 
    message={snackbarMessage} 
    onClose={handleSnackbarClose} 
  />
</Snackbar>
    </Container>
  );
};