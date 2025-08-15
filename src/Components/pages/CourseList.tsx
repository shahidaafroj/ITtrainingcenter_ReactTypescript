// CourseList.tsx
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, Chip, Box, IconButton, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { CourseService } from '../../utilities/services';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ICourseListItem } from '../../interfaces/ICourse';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  tableHeader: { fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: 'white' },
  chip: { marginRight: theme.spacing(1) },
  actionButton: { marginRight: theme.spacing(1) },
}));

export const CourseList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const result = await CourseService.getAlls();
      setCourses(result.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/courses/edit/${id}`);
  };

    const handleViewDetails = (id: number) => {
    navigate(`/courses/details/${id}`);
  };



  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await CourseService.delete(id);
      await loadCourses();
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Course List</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/courses/new')}>Add New Course</Button>
      </Box>

      <Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>Name</TableCell>
                  <TableCell className={classes.tableHeader}>Code</TableCell>
                  <TableCell className={classes.tableHeader}>Fee</TableCell>
                  <TableCell className={classes.tableHeader}>Hours</TableCell>
                  <TableCell className={classes.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.courseId} hover>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.shortCode}</TableCell>
                    <TableCell>{course.courseFee}</TableCell>
                    <TableCell>{course.totalHours}</TableCell>
                    
                    <TableCell>
                       <IconButton 
    onClick={() => navigate(`/courses/details/${course.courseId}`)} 
    className={classes.actionButton} 
    color="primary"
  >
    <VisibilityIcon />
  </IconButton>
                      <IconButton onClick={() => handleEdit(course.courseId)} className={classes.actionButton} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(course.courseId)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};