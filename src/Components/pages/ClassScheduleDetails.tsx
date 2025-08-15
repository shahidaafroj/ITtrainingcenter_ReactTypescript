import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Paper, Grid } from "@material-ui/core";
import { IClassSchedule } from "../../interfaces/IClassSchedule";
import { ClassScheduleService } from "../../utilities/services/classScheduleService";

export const ClassScheduleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<IClassSchedule | null>(null);

  useEffect(() => {
    if (id) {
      ClassScheduleService.getById(parseInt(id)).then(setSchedule);
    }
  }, [id]);

  if (!schedule) return <Typography>Loading...</Typography>;

  return (
    <Paper style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>Class Schedule Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}><strong>Schedule ID:</strong> {schedule.classScheduleId}</Grid>
        <Grid item xs={12}><strong>Selected Days:</strong> {schedule.selectedDays}</Grid>
        <Grid item xs={12}><strong>Slot:</strong> {schedule.slot?.timeSlotType} ({schedule.slot?.startTimeString} - {schedule.slot?.endTimeString})</Grid>
        <Grid item xs={12}><strong>Schedule Date:</strong> {new Date(schedule.scheduleDate).toLocaleDateString()}</Grid>
        <Grid item xs={12}><strong>Active:</strong> {schedule.isActive ? "Yes" : "No"}</Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={() => navigate("/class-schedules")} style={{ marginTop: 16 }}>
        Back to List
      </Button>
    </Paper>
  );
};
