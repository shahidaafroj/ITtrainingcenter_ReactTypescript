import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, Box,
  FormControlLabel, Checkbox, Select, MenuItem, InputLabel,
  FormControl, Chip, Divider, IconButton, Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useParams, useNavigate } from 'react-router-dom';
import { ICoursePostRequest } from '../../interfaces/ICourse';
import { IInstructor } from '../../interfaces/IInstructor';
import { IClassRoom } from '../../interfaces/IClassRoom';
import { InstructorService } from '../../utilities/services/instructorService';
import { ClassroomService } from '../../utilities/services/classRoomService';
import { CourseService } from '../../utilities/services/courseService';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  paper: { padding: theme.spacing(3), marginTop: theme.spacing(2) },
  formField: { marginBottom: theme.spacing(3) },
  chips: { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  backButton: {
    marginBottom: theme.spacing(2) // Add some spacing below the button
  }
}));

export const CourseForm = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ICoursePostRequest>({
    courseName: '',
    shortCode: '',
    totalHours: '',
    courseFee: '',
    remarks: '',
    isactive: true,
    createdDate: new Date().toISOString(),
    instructorCourse_Junction_Tables: [],
    classRoomCourse_Junction_Tables: []
  });

  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [classrooms, setClassrooms] = useState<IClassRoom[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number>(0);
  const [selectedClassRoomId, setSelectedClassRoomId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    InstructorService.getAll().then(setInstructors);
    ClassroomService.getAll().then(setClassrooms);
    if (id) {
      loadCourseForEdit(Number(id));
    }
  }, [id]);

  const loadCourseForEdit = async (courseId: number) => {
    try {
      setIsLoading(true);
      const res = await CourseService.getByIdd(courseId);
      if (res?.isSuccess && res.data) {
        setFormData({
          courseName: res.data.courseName,
          shortCode: res.data.shortCode,
          totalHours: res.data.totalHours,
          courseFee: res.data.courseFee,
          remarks: res.data.remarks,
          isactive: res.data.isActive,
          createdDate: res.data.createdDate,
instructorCourse_Junction_Tables: res.data.instructors?.map((i: any) => ({
    instructorId: i.instructorId,
    isPrimaryInstructor: i.isPrimaryInstructor
  })) || [],
  classRoomCourse_Junction_Tables: res.data.classRooms?.map((c: any) => ({
    classRoomId: c.classRoomId,
    isAvailable: c.isAvailable
  })) || []
        });
      }
    } catch (err) {
      console.error("Failed to load course for edit", err);
    } finally {
      setIsLoading(false);
    }
  };

     const handleBackToList = () => {
    navigate('/courses'); // Adjust the path if your course list has a different route
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddInstructor = () => {
    if (!selectedInstructorId || formData.instructorCourse_Junction_Tables.some(i => i.instructorId === selectedInstructorId)) return;
    setFormData(prev => ({
      ...prev,
      instructorCourse_Junction_Tables: [...prev.instructorCourse_Junction_Tables, {
        instructorId: selectedInstructorId,
        isPrimaryInstructor: true
      }]
    }));
    setSelectedInstructorId(0);
  };

  const handleRemoveInstructor = (instructorId: number) => {
    setFormData(prev => ({
      ...prev,
      instructorCourse_Junction_Tables: prev.instructorCourse_Junction_Tables.filter(i => i.instructorId !== instructorId)
    }));
  };

  const handleAddClassRoom = () => {
    if (!selectedClassRoomId || formData.classRoomCourse_Junction_Tables.some(c => c.classRoomId === selectedClassRoomId)) return;
    setFormData(prev => ({
      ...prev,
      classRoomCourse_Junction_Tables: [...prev.classRoomCourse_Junction_Tables, {
        classRoomId: selectedClassRoomId,
        isAvailable: true
      }]
    }));
    setSelectedClassRoomId(0);
  };

  const handleRemoveClassRoom = (classRoomId: number) => {
    setFormData(prev => ({
      ...prev,
      classRoomCourse_Junction_Tables: prev.classRoomCourse_Junction_Tables.filter(c => c.classRoomId !== classRoomId)
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

 const handleSubmit = async(e: React.FormEvent) => {
  e.preventDefault();
try
{
    setIsLoading(true);

    // Inject courseId before update
    const payload = id ? { ...formData, courseId: Number(id) } : formData;

    const response = id
      ? await CourseService.update(payload) // ✅ only one argument
      : await CourseService.add(payload);

    if (response.isSuccess)
    {
        showSnackbar(`Course ${ id ? 'updated' : 'created'}
        successfully`, 'success');
        navigate('/courses');
    }
    else
    {
        showSnackbar(response.message || 'Failed to save course', 'error');
    }
}
catch (error)
{
    showSnackbar('Failed to save course', 'error');
    console.error(error);
}
finally
{
    setIsLoading(false);
}
};


  return (
    <Container className={classes.root} maxWidth="md">
       <Typography variant="h4" gutterBottom>{id ? 'Edit Course' : 'Add New Course'}</Typography>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Course Name" name="courseName" value={formData.courseName} onChange={handleInputChange} className={classes.formField} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Short Code" name="shortCode" value={formData.shortCode} onChange={handleInputChange} className={classes.formField} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Total Hours" name="totalHours" value={formData.totalHours} onChange={handleInputChange} className={classes.formField} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Course Fee" name="courseFee" value={formData.courseFee} onChange={handleInputChange} className={classes.formField} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Remarks" name="remarks" value={formData.remarks} onChange={handleInputChange} className={classes.formField} multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox name="isactive" checked={formData.isactive} onChange={handleInputChange} />} label="Active" />
            </Grid>

            {/* Instructor Selection */}
            <Grid item xs={12}>
              <Divider className={classes.sectionTitle} />
              <Typography variant="h6">Assign Instructors</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Instructor</InputLabel>
                    <Select value={selectedInstructorId} onChange={(e) => setSelectedInstructorId(Number(e.target.value))}>
                      <MenuItem value={0}>Select</MenuItem>
                      {instructors.map(i => (
                        <MenuItem key={i.instructorId} value={i.instructorId}>{i.employeeName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Button fullWidth variant="outlined" onClick={handleAddInstructor}>Add</Button>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.chips}>
                    {formData.instructorCourse_Junction_Tables.map((i, idx) => (
                      <Chip
                        key={idx}
                        label={instructors.find(ins => ins.instructorId === i.instructorId)?.employeeName || `Instructor ${i.instructorId}`}
                        onDelete={() => handleRemoveInstructor(i.instructorId)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Classroom Selection */}
            <Grid item xs={12}>
              <Divider className={classes.sectionTitle} />
              <Typography variant="h6">Assign Classrooms</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Classroom</InputLabel>
                    <Select value={selectedClassRoomId} onChange={(e) => setSelectedClassRoomId(Number(e.target.value))}>
                      <MenuItem value={0}>Select</MenuItem>
                      {classrooms.map(c => (
                        <MenuItem key={c.classRoomId} value={c.classRoomId}>{c.roomName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <Button fullWidth variant="outlined" onClick={handleAddClassRoom}>Add</Button>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.chips}>
                    {formData.classRoomCourse_Junction_Tables.map((c, idx) => (
                      <Chip
                        key={idx}
                        label={classrooms.find(cls => cls.classRoomId === c.classRoomId)?.roomName || `Room ${c.classRoomId}`}
                        onDelete={() => handleRemoveClassRoom(c.classRoomId)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Course'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={snackbarMessage}
        action={<IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}><CloseIcon fontSize="small" /></IconButton>}
      />
         <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToList}
              className={classes.backButton}
              variant="outlined"
              color="primary"
            >
              Back to List
            </Button>
    </Container>
  );
};
