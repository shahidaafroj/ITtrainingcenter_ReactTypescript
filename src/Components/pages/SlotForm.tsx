

// src/component/pages/SlotForm.tsx
import React, { useEffect } from "react";
import { TextBox, Button, CheckBox } from '../controls'
import { ISlot } from '../../interfaces'
import { useForm } from '../../hooks'
import { Grid, makeStyles } from "@material-ui/core";
import { SlotService } from '../../utilities/services';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const initialState: ISlot = {
    slotId: 0,
    timeSlotType: "",
    startTime: "",
    endTime: "",
    isActive: false
};

const useStyles = makeStyles({
    field: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
    },
    formContainer: {
        minWidth: 350,
        maxWidth: 500,
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 5,
        backgroundColor: '#fff'
    }
})

export const SlotForm = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();

    const validate = (fieldValues = values) => {
        let temp: any = { ...errors }
        
        if ('timeSlotType' in fieldValues) {
            temp.timeSlotType = fieldValues.timeSlotType ? "" : "This field is required.";
        }
        
        if ('startTime' in fieldValues) {
            temp.startTime = fieldValues.startTime ? "" : "Start time is required.";
        }
        
        if ('endTime' in fieldValues) {
            temp.endTime = fieldValues.endTime ? "" : "End time is required.";
        }

        // Additional validation for end time > start time
        if (fieldValues.startTime && fieldValues.endTime) {
            const start = new Date(`2000-01-01T${fieldValues.startTime}:00`);
            const end = new Date(`2000-01-01T${fieldValues.endTime}:00`);
            if (end <= start) {
                temp.endTime = "End time must be after start time";
            }
        }

        setErrors({
            ...temp
        })

        if (fieldValues === values) {
            return Object.values(temp).every(x => x === "");
        }
    }

    const { onChange, values, errors, setErrors, resetForm, setValues } = useForm(
        initialState,
        true,
        validate,
        initialState
    );

    // const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     // Ensure time is in HH:mm format
    //     const timeValue = value.length === 5 ? value : `${value}:00`;
    //     setValues({
    //         ...values,
    //         [name]: timeValue
    //     });
    // };
      // Modify your handleTimeChange function in SlotForm.tsx
const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure time is in HH:mm format
    let timeValue = value;
    if (value.length === 4) { // When user enters "HHmm"
        timeValue = `${value.substring(0, 2)}:${value.substring(2)}`;
    } else if (value.length === 2 && !value.includes(':')) {
        timeValue = `${value}:00`;
    }
    setValues({
        ...values,
        [name]: timeValue
    });
};
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validate()) {
            if (id && parseInt(id) !== 0) {
                updateSlot(values);
            } else {
                addSlot(values);
            }
        } else {
            console.log("Form Validation Error");
        }
    }

    const addSlot = async (values: ISlot) => {
        try {
            const result = await SlotService.add(values);
            if (result.isSuccess) {
                navigate("/slots");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const updateSlot = async (values: ISlot) => {
        try {
            const result = await SlotService.update(values);
            if (result.isSuccess) {
                navigate("/slots");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const resetFormDetails = () => {
        resetForm();
    }

    const navigateToSlotList = () => {
        navigate("/slots");
    }

    useEffect(() => {
        if (id && parseInt(id) !== 0) {
            const fetchSelectedSlot = async () => {
                try {
                    const slot = await SlotService.getById(parseInt(id));
                    setValues({
                        ...slot,
                        startTime: slot.startTime?.substring(0, 5) || "", // Ensure HH:mm format
                        endTime: slot.endTime?.substring(0, 5) || ""       // Ensure HH:mm format
                    });
                } catch (error: any) {
                    console.error("Error fetching slot:", error);
                }
            };
            fetchSelectedSlot();
        }
    }, [id]);

    return (
        <Grid container justify="center" alignItems="center" style={{ minHeight: "100vh" }}>
            <Grid item className={classes.formContainer}>
                <h2 style={{ textAlign: 'center' }}>
                    {id && parseInt(id) !== 0 ? "Edit Slot" : "Add Slot"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <TextBox
                        id="timeSlotType"
                        name="timeSlotType"
                        type="text"
                        label="Time Slot Type"
                        value={values.timeSlotType}
                        onChange={onChange}
                        error={errors.timeSlotType}
                        fullWidth
                        className={classes.field}
                    />
                    <TextBox
                        id="startTime"
                        name="startTime"
                        type="time"
                        label="Start Time"
                        value={values.startTime?.substring(0, 5)} // Display as HH:mm
                        onChange={handleTimeChange}
                        error={errors.startTime}
                        fullWidth
                        className={classes.field}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <TextBox
                        id="endTime"
                        name="endTime"
                        type="time"
                        label="End Time"
                        value={values.endTime?.substring(0, 5)} // Display as HH:mm
                        onChange={handleTimeChange}
                        error={errors.endTime}
                        fullWidth
                        className={classes.field}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <CheckBox
                        name="isActive"
                        id="isActive"
                        label="Active Status"
                        checked={values.isActive}
                        onChange={onChange}
                        className={classes.field} value={false}                    />
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button
                                text="Cancel"
                                color="default"
                                variant="contained"
                                onClick={navigateToSlotList} size={undefined}                            />
                        </Grid>
                        <Grid item>
                            <Button
                                text="Reset"
                                color="secondary"
                                variant="contained"
                                onClick={resetFormDetails} size={undefined}                            />
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                text="Submit"
                                color="primary"
                                variant="contained" size={undefined}                            />
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};