import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  Typography,
  TablePagination,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { InstructorService } from '../../utilities/services';
import { IInstructor } from '../../interfaces/IInstructor';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  statusActive: {
    color: theme.palette.success.main,
    fontWeight: 'bold',
  },
  statusInactive: {
    color: theme.palette.error.main,
    fontWeight: 'bold',
  },
  actionButton: {
    marginRight: theme.spacing(1),
    minWidth: 'auto',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
}));

export const InstructorList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data = await InstructorService.getAll();
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/instructors/new');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/instructors/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/instructors/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await InstructorService.delete(id);
        fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" className={classes.title}>
          Instructors
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNew}
        >
          Add New Instructor
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>ID</TableCell>
                <TableCell className={classes.tableHeader}>Employee</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
                <TableCell className={classes.tableHeader} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : instructors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No instructors found
                  </TableCell>
                </TableRow>
              ) : (
                instructors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((instructor) => (
                    <TableRow key={instructor.instructorId} hover>
                      <TableCell>{instructor.instructorId}</TableCell>
                      <TableCell>{instructor.employeeName}</TableCell>
                    
                      <TableCell>
                        <span className={instructor.isActive ? classes.statusActive : classes.statusInactive}>
                          {instructor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleViewDetails(instructor.instructorId)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleEdit(instructor.instructorId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(instructor.instructorId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={instructors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};