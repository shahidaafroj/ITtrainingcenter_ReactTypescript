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
import { ITraineeAttendance } from '../../interfaces/ITraineeAttendance';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { TraineeAttendanceService } from '../../utilities/services/traineeAttendanceService';

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
  presentChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
  absentChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
}));

interface GroupedAttendance {
  attendanceDate: string;
  batchId: number;
  instructorId: number;
  batchName?: string;
  instructorName?: string;
  presentCount: number;
  absentCount: number;
  firstAttendanceId?: number;
}

export const TraineeAttendanceList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState<ITraineeAttendance[]>([]);
  const [groupedAttendances, setGroupedAttendances] = useState<GroupedAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const data = await TraineeAttendanceService.getAllAttendances();
      setAttendances(data);
      groupAttendances(data);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupAttendances = (attendanceData: ITraineeAttendance[]) => {
    const grouped = attendanceData.reduce((acc, attendance) => {
      const key = `${attendance.attendanceDate}_${attendance.batchId}_${attendance.instructorId}`;
      
      if (!acc[key]) {
        acc[key] = {
          attendanceDate: attendance.attendanceDate,
          batchId: attendance.batchId,
          instructorId: attendance.instructorId,
          batchName: attendance.batch?.batchName || 'N/A',
          presentCount: 0,
          absentCount: 0,
          firstAttendanceId: attendance.traineeAttendanceId
        };
      }

      if (attendance.traineeAttendanceDetails?.some(detail => detail.attendanceStatus)) {
        acc[key].presentCount += 1;
      } else {
        acc[key].absentCount += 1;
      }

      return acc;
    }, {} as Record<string, GroupedAttendance>);

    setGroupedAttendances(Object.values(grouped));
  };

  const handleAddNew = () => {
    navigate('/attendances/new');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/attendances/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/attendances/edit/${id}`);
  };

 const handleDelete = async (id: number) => {
  if (window.confirm('Are you sure you want to delete this attendance record?')) {
    try {
      await TraineeAttendanceService.deleteAttendance(id);
      fetchAttendances(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting attendance:', error);
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
          Trainee Attendance Records
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          New Attendance
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Date</TableCell>
                <TableCell className={classes.tableHeader}>Batch</TableCell>
                <TableCell className={classes.tableHeader}>Attendance Summary</TableCell>
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
              ) : groupedAttendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                groupedAttendances
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((group) => (
                    <TableRow key={`${group.attendanceDate}_${group.batchId}_${group.instructorId}`} hover>
                      <TableCell>
                        {new Date(group.attendanceDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{group.batchName}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Chip 
                            label={`${group.presentCount} Present`}
                            size="small"
                            className={classes.presentChip}
                            icon={<CheckCircleIcon style={{ color: 'white' }} />}
                          />
                          <Box ml={1}>
                            <Chip 
                              label={`${group.absentCount} Absent`}
                              size="small"
                              className={classes.absentChip}
                              icon={<CancelIcon style={{ color: 'white' }} />}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(group.firstAttendanceId || 0)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(group.firstAttendanceId || 0)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="secondary"
                           onClick={() => handleDelete(group.firstAttendanceId || 0)}                          >
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
          count={groupedAttendances.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};