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
  Tooltip,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  SwapHoriz as TransferIcon,
  CalendarToday as DateIcon 
} from '@material-ui/icons';
import moment from 'moment';
import { BatchTransferService } from '../../utilities/services/batchTransferService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: theme.palette.primary.dark,
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
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  transferCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.success.dark,
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export const BatchTransferList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const data = await BatchTransferService.getAll();
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching batch transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => navigate('/batch-transfers/new');
  const handleViewDetails = (id: number) => navigate(`/batch-transfers/details/${id}`);
  const handleEdit = (id: number) => navigate(`/batch-transfers/edit/${id}`);
  
  const handleDeleteClick = (id: number) => {
    setTransferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transferToDelete) {
      try {
        await BatchTransferService.delete(transferToDelete);
        fetchTransfers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting batch transfer:', error);
      } finally {
        setDeleteDialogOpen(false);
        setTransferToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransferToDelete(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container className={classes.root} maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" className={classes.title}>
          <TransferIcon fontSize="large" style={{ verticalAlign: 'middle', marginRight: 12 }} />
          Batch Transfers
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNew}
          startIcon={<AddIcon />}
        >
          New Transfer
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Trainee</TableCell>
                <TableCell className={classes.tableHeader}>Current Batch</TableCell>
                <TableCell className={classes.tableHeader}>Transfer Date</TableCell>
                <TableCell className={classes.tableHeader}>Created Date</TableCell>
                <TableCell className={classes.tableHeader} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : transfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      No batch transfers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transfers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transfer) => (
                    <TableRow key={transfer.batchTransferId} hover>
                      <TableCell>
                        <Box display="flex" flexDirection="column">
                          <Typography variant="subtitle1" style={{ fontWeight: 500, color: 'inherit' }}>
                            {transfer.trainee?.registration?.traineeName || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {transfer.trainee?.traineeIDNo || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transfer.batch?.batchName || 'N/A'} 
                          style={{
                            backgroundColor: 'transparent',
                            color: '#000000',
                            border: '1px solid #e0e0e0',
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.transferCell}>
                          <TransferIcon fontSize="small" />
                          {transfer.transferDate ? (
                            <Typography>
                              {moment(transfer.transferDate.toString()).format('DD MMM YYYY')}
                            </Typography>
                          ) : (
                            <Typography color="textSecondary">Pending</Typography>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={classes.dateCell}>
                          <DateIcon fontSize="small" color="action" />
                          <Typography>
                            {transfer.createdDate ? moment(transfer.createdDate.toString()).format('DD MMM YYYY') : 'N/A'}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="right" className={classes.actionsCell}>
                     
                        <Tooltip title="Delete">
                          <IconButton
                            color="secondary"
                            onClick={() => handleDeleteClick(transfer.batchTransferId)}
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
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={transfers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this batch transfer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};