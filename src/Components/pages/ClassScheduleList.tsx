import React, { useEffect, useState } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from "@material-ui/icons";
import { IClassSchedule } from "../../interfaces/IClassSchedule";
import { ClassScheduleService } from "../../utilities/services/classScheduleService";

export const ClassScheduleList = () => {
  const [schedules, setSchedules] = useState<IClassSchedule[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const data = await ClassScheduleService.getAll();
    setSchedules(data);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    await ClassScheduleService.delete(id);
    loadSchedules();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Class Schedules</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/class-schedules/new")}
        style={{ marginBottom: 16 }}
      >
        Add Schedule
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Schedule ID</TableCell>
              <TableCell>Selected Days</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((s) => (
              <TableRow key={s.classScheduleId}>
                <TableCell>{s.classScheduleId}</TableCell>
                <TableCell>{s.selectedDays}</TableCell>
                <TableCell>{`${s.slot?.timeSlotType} (${s.slot?.startTimeString} - ${s.slot?.endTimeString})`}</TableCell>
                <TableCell>{new Date(s.scheduleDate).toLocaleDateString()}</TableCell>
                <TableCell>{s.isActive ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/class-schedules/details/${s.classScheduleId}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/class-schedules/edit/${s.classScheduleId}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(s.classScheduleId!)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No schedules found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
