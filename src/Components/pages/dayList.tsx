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
  IconButton,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { DayService } from '../../utilities/services';
import { IDay } from "../../interfaces/Iday";
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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
  },
}));

export const DayList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [days, setDays] = useState<IDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    try {
      setLoading(true);
      const data = await DayService.getAll();
      setDays(data);
    } catch (error) {
      console.error('Error fetching days:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/days/new');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/days/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/days/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this day?')) {
      try {
        await DayService.delete(id);
        fetchDays();
      } catch (error) {
        console.error('Error deleting day:', error);
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
          Days
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Day
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>ID</TableCell>
                <TableCell className={classes.tableHeader}>Day Name</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
                <TableCell className={classes.tableHeader} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : days.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No days found
                  </TableCell>
                </TableRow>
              ) : (
                days
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((day) => (
                    <TableRow key={day.dayId} hover>
                      <TableCell>{day.dayId}</TableCell>
                      <TableCell>{day.dayName}</TableCell>
                      <TableCell>
                        <span className={day.isActive ? classes.statusActive : classes.statusInactive}>
                          {day.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleViewDetails(day.dayId)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleEdit(day.dayId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(day.dayId)}
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
          count={days.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};