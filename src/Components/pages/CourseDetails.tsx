// CourseDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Grid, Box, Chip, CircularProgress, Divider, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseService } from '../../utilities/services';
import { ICourseDetails } from '../../interfaces/ICourse';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  paper: { padding: theme.spacing(3), marginTop: theme.spacing(2) },
  chip: { marginRight: theme.spacing(1), marginBottom: theme.spacing(1) },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontWeight: 600
  },
    backButton: {
    marginBottom: theme.spacing(2) // Add some spacing below the button
  }
}));

export const CourseDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCourse(parseInt(id));
  }, [id]);

  const loadCourse = async (courseId: number) => {
  try {
    setLoading(true);
    const courseData = await CourseService.getByIdd(courseId);
    setCourse(courseData.data);
  } catch (error) {
    console.error('Error loading course details', error);
    // You might want to set some error state here
  } finally {
    setLoading(false);
  }
};


    const handleBackToList = () => {
    navigate('/courses'); // Adjust the path if your course list has a different route
  };


  if (loading) {
    return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
  }

  if (!course) {
    return <Typography align="center">Course not found</Typography>;
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Course Details</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(`/courses/edit/${course.courseId}`)}>Edit</Button>
     
      </Box>

      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Name:</Typography>
            <Typography>{course.courseName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Short Code:</Typography>
            <Typography>{course.shortCode}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Total Hours:</Typography>
            <Typography>{course.totalHours}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Course Fee:</Typography>
            <Typography>{course.courseFee}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Remarks:</Typography>
            <Typography>{course.remarks || 'N/A'}</Typography>
          </Grid>

          {/* Instructors */}
          <Grid item xs={12}>
            <Divider className={classes.sectionTitle} />
            <Typography variant="h6">Instructors</Typography>
            <Box mt={1}>
              {course.instructors.length > 0 ? (
                course.instructors.map((i, idx) => (
                  <Chip
                    key={idx}
                    label={i.employeeName}
                    color="primary"
                    variant="outlined"
                    className={classes.chip}
                  />
                ))
              ) : (
                <Typography>No instructors assigned.</Typography>
              )}
            </Box>
          </Grid>

          {/* Classrooms */}
          <Grid item xs={12}>
            <Divider className={classes.sectionTitle} />
            <Typography variant="h6">Classrooms</Typography>
            <Box mt={1}>
              {course.classRooms.length > 0 ? (
                course.classRooms.map((c, idx) => (
                  <Chip
                    key={idx}
                    label={c.roomName}
                    color="secondary"
                    variant="outlined"
                    className={classes.chip}
                  />
                ))
              ) : (
                <Typography>No classrooms assigned.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
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
