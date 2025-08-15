import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  DialogContentText
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { VisitorTransferService } from "../../utilities/services/visitorTransferService";
import { IEmployee } from "../../interfaces/IVisitorTransfer";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

export const VisitorTransferList = () => {
  const navigate = useNavigate();

  // State declarations
  const [transfers, setTransfers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);
  const [employeeVisitors, setEmployeeVisitors] = useState<any[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<number | null>(null);

  // Load all transfers and employees on mount
  useEffect(() => {
    loadTransfers();
    loadEmployees();
  }, []);

  // Fetch transfers from API
  const loadTransfers = async () => {
    try {
      setLoading(true);
      const data = await VisitorTransferService.getAllTransfers();
      setTransfers(data);
    } catch (error) {
      console.error("Failed to load visitor transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees from API
  const loadEmployees = async () => {
    try {
      const data = await VisitorTransferService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  // When employee is selected, load assigned visitors from junction table
  const handleEnterDetails = async () => {
    if (selectedEmployeeId > 0) {
      try {
        const visitors = await VisitorTransferService.getAssignedVisitorsByEmployeeId(selectedEmployeeId);
        setEmployeeVisitors(visitors);
      } catch (error) {
        console.error("Error fetching visitors:", error);
        setEmployeeVisitors([]);
      }
      setOpenPopup(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setEmployeeVisitors([]);
  };

  // Delete transfer functions
  const handleDeleteClick = (id: number) => {
    setTransferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transferToDelete) {
      try {
        await VisitorTransferService.deleteTransfer(transferToDelete);
        loadTransfers(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting visitor transfer:", error);
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

  return (
    <Box p={3}>
      {/* Header and Add button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Visitor Transfers</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-visitor-transfer")}
        >
          Add Transfer
        </Button>
      </Box>

      {/* Employee select and Enter Details button */}
      <Box display="flex" alignItems="center" style={{ marginBottom: 16 }}>
        <FormControl style={{ minWidth: 250, marginRight: 16 }}>
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value as number)}
          >
            <MenuItem value={0}>-- Select --</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleEnterDetails}
          disabled={selectedEmployeeId === 0}
        >
          View Assigned Visitors
        </Button>
      </Box>

      {/* Visitor Transfers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visitor Name</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Transfer Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">No visitor transfers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              transfers.map((item) => (
                <TableRow key={item.visitorTransferId}>
                  <TableCell>{item.visitorName}</TableCell>
                  <TableCell>{item.employeeName}</TableCell>
                  <TableCell>{item.transferDate?.substring(0, 10)}</TableCell>
                  <TableCell align="right">
                  
                    <Tooltip title="Delete">
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteClick(item.visitorTransferId)}
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

      {/* Visitor Assigned Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>Visitors Assigned to Selected Employee</DialogTitle>
        <DialogContent>
          {employeeVisitors.length > 0 ? (
            <ul>
              {employeeVisitors.map((v) => (
                <li key={v.visitorId}>
                  <strong>{v.visitorName}</strong> (ID: {v.visitorNo})
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No visitors found for this employee.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
            Are you sure you want to delete this visitor transfer? This action cannot be undone.
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
    </Box>
  );
};