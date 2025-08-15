// components/pages/BatchForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, Box,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Divider, Chip, IconButton, CircularProgress, Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { IBatch } from '../../interfaces/IBatch';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CourseService } from '../../utilities/services/courseService';
import { ClassroomService, InstructorService } from '../../utilities/services';
import { ClassScheduleService } from '../../utilities/services/classScheduleService';
import { BatchService } from '../../utilities/services/batchService';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  paper: { padding: theme.spacing(3), marginTop: theme.spacing(2) },
  formField: { marginBottom: theme.spacing(2) },
  chips: { display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1), marginTop: theme.spacing(1) },
  sectionTitle: { margin: `${theme.spacing(3)}px 0`, fontWeight: 'bold' },
  backButton: { marginBottom: theme.spacing(2) }
}));

export const BatchForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  const [formData, setFormData] = useState<IBatch>({
    batchId: 0,
    batchName: '',
    courseId: 0,
    startDate: new Date().toISOString(),
    batchType: 'Regular',
    instructorId: 0,
    classRoomId: 0,
    isActive: true,
    selectedScheduleIds: [],
    previousInstructorIds: []
  });
  
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [classRooms, setClassRooms] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, instructorsRes, classRoomsRes, schedulesRes] = await Promise.all([
        CourseService.getAll(),
        InstructorService.getAll(),
        ClassroomService.getAll(),
        ClassScheduleService.getAll()
      ]);

      setCourses(coursesRes);
      setInstructors(instructorsRes);
      setClassRooms(classRoomsRes);
      setSchedules(schedulesRes);

      if (id && id !== 'new') {
        const batch = await BatchService.getByIdd(parseInt(id));
        console.log("Loaded batch", batch);
        setFormData({
          batchId: batch.batchId,
          batchName: batch.batchName,
          courseId: batch.courseId,
          startDate: batch.startDate,
          endDate: batch.endDate,
          batchType: batch.batchType,
          instructorId: batch.instructorId,
          classRoomId: batch.classRoomId,
          isActive: batch.isActive,
          remarks: batch.remarks || '',
          selectedScheduleIds: batch.schedules?.map(s => Number(s.classScheduleId)) || [],
          previousInstructorIds: batch.previousInstructorIds || []
        });
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [id]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));

    // Auto-generate batch name when course changes
    if (name === 'courseId' && value) {
      BatchService.generateBatchName(value as number).then(name => {
        setFormData(prev => ({ ...prev, batchName: name }));
      });
    }
  };

  const handleAddSchedule = (scheduleId: number) => {
    if (!formData.selectedScheduleIds.includes(scheduleId)) {
      setFormData(prev => ({
        ...prev,
        selectedScheduleIds: [...prev.selectedScheduleIds, scheduleId]
      }));
    }
  };

  const handleRemoveSchedule = (scheduleId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedScheduleIds: prev.selectedScheduleIds.filter(id => id !== scheduleId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (formData.batchId > 0) {
        await BatchService.update(formData.batchId, formData);
        setSnackbarMessage('Batch updated successfully');
      } else {
        await BatchService.create(formData);
        setSnackbarMessage('Batch created successfully');
      }
      setSnackbarOpen(true);
      setTimeout(() => navigate('/batches'), 1500);
    } catch (error) {
      console.error('Error saving batch:', error);
      setSnackbarMessage('Failed to save batch');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/batches')}
        className={classes.backButton}
        variant="outlined"
      >
        Back to List
      </Button>

      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Batch' : 'Add New Batch'}
      </Typography>

      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Batch Name"
                name="batchName"
                value={formData.batchName}
                onChange={handleInputChange}
                className={classes.formField}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Course *</InputLabel>
                <Select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value={0}>Select Course</MenuItem>
                  {courses.map(course => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate.split('T')[0]}
                onChange={handleInputChange}
                className={classes.formField}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate?.split('T')[0] || ''}
                onChange={handleInputChange}
                className={classes.formField}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Batch Type *</InputLabel>
                <Select
                  name="batchType"
                  value={formData.batchType}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Weekend">Weekend</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>

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

            {/* Instructor Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Instructor *</InputLabel>
                <Select
                  name="instructorId"
                  value={formData.instructorId}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value={0}>Select Instructor</MenuItem>
                  {instructors.map(instructor => (
                    <MenuItem key={instructor.instructorId} value={instructor.instructorId}>
                      {instructor.employeeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Classroom Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Classroom *</InputLabel>
                <Select
                  name="classRoomId"
                  value={formData.classRoomId}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value={0}>Select Classroom</MenuItem>
                  {classRooms.map(room => (
                    <MenuItem key={room.classRoomId} value={room.classRoomId}>
                      {room.roomName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks || ''}
                onChange={handleInputChange}
                className={classes.formField}
                multiline
                rows={3}
              />
            </Grid>

            {/* Class Schedules */}
            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" className={classes.sectionTitle}>
                Class Schedules
              </Typography>
              
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Add Schedule</InputLabel>
                <Select
                  value={0}
                  onChange={(e) => {
                    const scheduleId = e.target.value as number;
                    if (scheduleId > 0) handleAddSchedule(scheduleId);
                  }}
                >
                  <MenuItem value={0}>Select Schedule</MenuItem>
                  {schedules
                    .filter(s => !formData.selectedScheduleIds.includes(s.classScheduleId))
                    .map(schedule => (
                      <MenuItem key={schedule.classScheduleId} value={schedule.classScheduleId}>
  {schedule.selectedDays} - ({schedule.slot?.timeSlotType} - {schedule.slot?.startTimeString} to {schedule.slot?.endTimeString})
</MenuItem>

                    ))}
                </Select>
              </FormControl>

              <Box className={classes.chips}>
                {formData.selectedScheduleIds.map(id => {
                  const schedule = schedules.find(s => s.classScheduleId === id);
                  return schedule ? (
                    <Chip
                      key={id}
label={`${schedule.selectedDays} - (${schedule.slot?.timeSlotType} - ${schedule.slot?.startTimeString} to ${schedule.slot?.endTimeString})`}
                      onDelete={() => handleRemoveSchedule(id)}
                      color="primary"
                      variant="outlined"
                      deleteIcon={<DeleteIcon />}
                    />
                  ) : null;
                })}
              </Box>
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/batches')}
                  style={{ marginRight: 16 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
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
        message={snackbarMessage}
      />
    </Container>
  );
};