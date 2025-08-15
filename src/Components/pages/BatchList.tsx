// components/pages/BatchList.tsx
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Button, Box, IconButton, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { BatchService } from '../../utilities/services/batchService';
import { IBatchListItem } from '../../interfaces/IBatch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  tableHeader: { 
    fontWeight: 'bold', 
    backgroundColor: theme.palette.primary.main, 
    color: theme.palette.common.white 
  },
  actionButton: { marginRight: theme.spacing(1) },
}));

export const BatchList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<IBatchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await BatchService.getAlll();
      setBatches(data);
    } catch (error) {
      console.error('Failed to load batches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => navigate('/batches/new');
  const handleViewDetails = (id: number) => navigate(`/batches/details/${id}`);
  const handleEdit = (id: number) => navigate(`/batches/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await BatchService.delete(id);
        await loadBatches();
      } catch (error) {
        console.error('Failed to delete batch', error);
      }
    }
  };

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Batch List</Typography>
        <Button variant="contained" color="primary" onClick={handleAddNew}>
          Add New Batch
        </Button>
      </Box>

      <Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>Batch Name</TableCell>
                  <TableCell className={classes.tableHeader}>Course</TableCell>
                  <TableCell className={classes.tableHeader}>Start Date</TableCell>
                  <TableCell className={classes.tableHeader}>Type</TableCell>
                  <TableCell className={classes.tableHeader}>Status</TableCell>
                  <TableCell className={classes.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.batchId} hover>
                    <TableCell>{batch.batchName}</TableCell>
                    <TableCell>{batch.courseName}</TableCell>
                    <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{batch.batchType}</TableCell>
                    <TableCell>{batch.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(batch.batchId)} className={classes.actionButton}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(batch.batchId)} className={classes.actionButton}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(batch.batchId)}>
                        <DeleteIcon color="secondary" />
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