// components/recommendation/RecommendationList.tsx
import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { RecommendationService } from '../../utilities/services/recommendationService';
import { IRecommendation } from '../../interfaces/IRecommendation';

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
  actionButton: {
    marginRight: theme.spacing(1),
    minWidth: 'auto',
  },
  statusChip: {
    margin: theme.spacing(0.5),
    fontWeight: 'bold',
  },
  statusPending: {
    backgroundColor: '#ff9800',
    color: theme.palette.common.white,
  },
  statusApproved: {
    backgroundColor: '#4caf50',
    color: theme.palette.common.white,
  },
  statusRejected: {
    backgroundColor: '#f44336',
    color: theme.palette.common.white,
  },
}));

export const RecommendationList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await RecommendationService.getAll();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/recommendations/create');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/recommendations/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/recommendations/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      try {
        await RecommendationService.remove(id);
        fetchRecommendations();
      } catch (error) {
        console.error('Error deleting recommendation:', error);
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

  const getStatusChip = (status: string) => {
    let chipClass = classes.statusPending;
    if (status === 'Approved') chipClass = classes.statusApproved;
    if (status === 'Rejected') chipClass = classes.statusRejected;
    
    return (
      <Chip 
        label={status} 
        className={`${classes.statusChip} ${chipClass}`} 
        size="small" 
      />
    );
  };

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" className={classes.title}>
          Recommendations
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Recommendation
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Trainee</TableCell>
                <TableCell className={classes.tableHeader}>Batch</TableCell>
                <TableCell className={classes.tableHeader}>Instructor</TableCell>
                <TableCell className={classes.tableHeader}>Status</TableCell>
                <TableCell className={classes.tableHeader} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : recommendations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No recommendations found
                  </TableCell>
                </TableRow>
              ) : (
                recommendations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((recommendation) => (
                    <TableRow key={recommendation.recommendationId} hover>
                      <TableCell>{recommendation.traineeName}-{recommendation.traineeIDNo}</TableCell>
                      <TableCell>{recommendation.batchName}</TableCell>
                      <TableCell>{recommendation.instructorName}</TableCell>
                      <TableCell>
                        {getStatusChip(recommendation.recommendationStatus)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleViewDetails(recommendation.recommendationId!)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => handleEdit(recommendation.recommendationId!)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(recommendation.recommendationId!)}
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
          count={recommendations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};