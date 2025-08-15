import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControlLabel,
} from "@material-ui/core";
import { VisitorTransferService } from "../../utilities/services/visitorTransferService";
import { IEmployee, IVisitor, IVisitorTransfer } from "../../interfaces/IVisitorTransfer";
import { useNavigate } from "react-router-dom";

export const VisitorTransferForm = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [sourceEmployeeId, setSourceEmployeeId] = useState<number>(0);
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [selectedVisitors, setSelectedVisitors] = useState<number[]>([]);
  const [targetEmployeeId, setTargetEmployeeId] = useState<number>(0);
  const [transferDate, setTransferDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (sourceEmployeeId > 0) loadVisitors(sourceEmployeeId);
  }, [sourceEmployeeId]);

  const loadEmployees = async () => {
    const data = await VisitorTransferService.getEmployees();
    setEmployees(data);
  };

  const loadVisitors = async (id: number) => {
    const data = await VisitorTransferService.getVisitorsByEmployeeId(id);
    setVisitors(data);
  };

  const handleVisitorChange = (visitorId: number) => {
    setSelectedVisitors((prev) =>
      prev.includes(visitorId)
        ? prev.filter((id) => id !== visitorId)
        : [...prev, visitorId]
    );
  };

  // const handleSubmit = async () => {
  //   const payload: IVisitorTransfer = {
  //     visitorIds: selectedVisitors,
  //     employeeId: targetEmployeeId,
  //     transferDate,
  //     notes,
  //     userName,
  //   };
  //   await VisitorTransferService.assignVisitors(payload);
  //   alert("Visitors transferred successfully");
  //   // Optionally reset state here
  // };


const handleSubmit = async () => {
  try {
    const payload: IVisitorTransfer = {
      visitorIds: selectedVisitors,
      employeeId: targetEmployeeId,
      transferDate,
      notes,
      userName,
    };
    
    await VisitorTransferService.assignVisitors(payload);
    alert("Visitors transferred successfully");
     navigate("/visitor-transfers");
    
    // Reset form state
    setSourceEmployeeId(0);
    setSelectedVisitors([]);
    setTargetEmployeeId(0);
    setTransferDate("");
    setNotes("");
    setUserName("");
    
  } catch (err) {
    // Type-safe error handling without custom interface
    const error = err as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };
    
    const errorMessage = error.response?.data?.message 
                      || error.message 
                      || "Failed to transfer visitors";
    
    alert(`Transfer failed: ${errorMessage}`);
  }
};



  return (
    <Container>
      <Typography variant="h5">Visitor Transfer</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Source Employee</InputLabel>
        <Select
          value={sourceEmployeeId}
          onChange={(e) => setSourceEmployeeId(e.target.value as number)}
        >
          <MenuItem value={0}>Select</MenuItem>
          {employees.map((emp) => (
            <MenuItem key={emp.employeeId} value={emp.employeeId}>
              {emp.employeeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {visitors.length > 0 && (
        <Box>
          <Typography>Select Visitors</Typography>
          {visitors.map((visitor) => (
            <FormControlLabel
              key={visitor.visitorId}
              control={
                <Checkbox
                  checked={selectedVisitors.includes(visitor.visitorId)}
                  onChange={() => handleVisitorChange(visitor.visitorId)}
                />
              }
              label={visitor.visitorName}
            />
          ))}
        </Box>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Target Employee</InputLabel>
        <Select
          value={targetEmployeeId}
          onChange={(e) => setTargetEmployeeId(e.target.value as number)}
        >
          <MenuItem value={0}>Select</MenuItem>
          {employees
            .filter((e) => e.isAvailable)
            .map((emp) => (
              <MenuItem key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        label="Transfer Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={transferDate}
        onChange={(e) => setTransferDate(e.target.value)}
      />

      <TextField
        label="Notes"
        fullWidth
        multiline
        rows={3}
        margin="normal"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <TextField
        label="User Name"
        fullWidth
        margin="normal"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Transfer Visitors
      </Button>
    </Container>
  );
};