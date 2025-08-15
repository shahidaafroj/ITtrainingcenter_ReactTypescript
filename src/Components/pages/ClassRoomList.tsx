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
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { IClassRoom } from '../../interfaces';
import { ClassroomService } from '../../utilities/services';

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
  chip: {
    margin: theme.spacing(0.5),
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
}));

export const ClassroomList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<IClassRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const data = await ClassroomService.getAll();
      setClassrooms(data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/classrooms/new');
  };

  const handleEdit = (id: number) => {
    navigate(`/classrooms/edit/${id}`);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/classrooms/details/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await ClassroomService.delete(id);
        fetchClassrooms();
      } catch (error) {
        console.error('Error deleting classroom:', error);
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
          Classrooms
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNew}
        >
          Add New Classroom
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>Room Name</TableCell>
                  <TableCell className={classes.tableHeader}>Location</TableCell>
                  <TableCell className={classes.tableHeader}>Capacity</TableCell>
                  <TableCell className={classes.tableHeader}>Status</TableCell>
                  <TableCell className={classes.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classrooms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((classroom) => (
                    <TableRow key={classroom.classRoomId}>
                      <TableCell>{classroom.roomName}</TableCell>
                      <TableCell>{classroom.location}</TableCell>
                      <TableCell>{classroom.seatCapacity}</TableCell>
                      
                      <TableCell>
                        <span className={classroom.isActive ? classes.statusActive : classes.statusInactive}>
                          {classroom.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className={classes.actionButton}
                          onClick={() => handleViewDetails(classroom.classRoomId)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className={classes.actionButton}
                          onClick={() => handleEdit(classroom.classRoomId)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleDelete(classroom.classRoomId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={classrooms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  );
};