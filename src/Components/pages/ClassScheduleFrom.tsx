import React, { useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { IDay,ISlot, IClassSchedule } from "../../interfaces/IClassSchedule";
import { ClassScheduleService } from "../../utilities/services/classScheduleService";
import { DayService } from "../../utilities/services/dayService";

export const ClassScheduleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [days, setDays] = useState<IDay[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [formData, setFormData] = useState<IClassSchedule>({
    selectedDayIds: [],
    slotId: 0,
    scheduleDate: new Date().toISOString().split("T")[0],
    isActive: true,
  });





  useEffect(() => {
    loadDaysAndSlots();
    if (id) fetchSchedule(parseInt(id));
  }, [id]);

  const loadDaysAndSlots = async () => {
  try {
    const [daysData, slotsData] = await Promise.all([
      ClassScheduleService.getDays(), // returns IDay[]
      ClassScheduleService.getSlots() // returns ISlot[]
    ]);

    setDays(daysData); // ✅ already array
    setSlots(slotsData); // ✅ already array
  } catch (err) {
    console.error("Failed to load days or slots", err);
    setDays([]);
    setSlots([]);
  }
};



  const fetchSchedule = async (id: number) => {
    const data = await ClassScheduleService.getById(id);
    setFormData({
      classScheduleId: data.classScheduleId,
      selectedDayIds: data.selectedDayIds,
      slotId: data.slotId,
      scheduleDate: data.scheduleDate.split("T")[0],
      isActive: data.isActive
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await ClassScheduleService.update(parseInt(id), formData);
    } else {
      await ClassScheduleService.create(formData);
    }
    navigate("/class-schedules");
  };

  const handleDayToggle = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDayIds: prev.selectedDayIds.includes(dayId)
        ? prev.selectedDayIds.filter(d => d !== dayId)
        : [...prev.selectedDayIds, dayId]
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">{id ? "Edit Schedule" : "Create Schedule"}</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <label><b>Select Days:</b></label>
          <div>
            {days.map(day => (
              <FormControlLabel
                key={day.dayId}
                control={
                  <Checkbox
                    checked={formData.selectedDayIds.includes(day.dayId)}
                    onChange={() => handleDayToggle(day.dayId)}
                    color="primary"
                  />
                }
                label={day.dayName}
              />
            ))}
          </div>
        </Grid>

        <Grid item xs={12}>
                      <label><b>Select Slot:</b></label>

          <Select
            fullWidth
            value={formData.slotId}
            onChange={(e) => setFormData({ ...formData, slotId: e.target.value as number })}
            displayEmpty
          >
            <MenuItem value="" disabled>Select a slot</MenuItem>
            {slots.map(slot => (
              <MenuItem key={slot.slotID} value={slot.slotID}>
                {slot.timeSlotType} - ({slot.startTimeString} to {slot.endTimeString})
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12}>
          <TextField
            type="date"
            fullWidth
            value={formData.scheduleDate}
            onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Save</Button>
          <Button onClick={() => navigate("/class-schedules")} style={{ marginLeft: 8 }}>Cancel</Button>
        </Grid>
      </Grid>
    </form>
  );
};
