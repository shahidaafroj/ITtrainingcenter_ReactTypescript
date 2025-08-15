// ========src/component/pages/CourseComboForm.tsx==========
import React, {useEffect} from "react";
import {TextBox, Button, CheckBox} from '../controls'
import {ICourseCombo} from '../../interfaces'
import {useForm} from '../../hooks'
import {Grid, makeStyles} from "@material-ui/core";
import {CourseComboService} from '../../utilities/services';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const initialState: ICourseCombo = {
    courseComboId: 0,
    comboName: "",
    selectedCourse: "",
    selectedCourseIds: [],
    isActive: false,
    remarks: "",
    courseId: null,
    courses: undefined
};

const useStyles = makeStyles({
    field: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
    }
})

export const CourseComboForm = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const {id} = useParams();

    const validate = (fieldValues = values) => {
        let temp: any = {...errors}
        if ('comboName' in fieldValues) {
            if (fieldValues.comboName) {
                if (!(/^[a-zA-Z0-9 ]+$/).test(fieldValues.comboName)) {
                    temp.comboName = "Combo Name should contain only alphanumeric characters and spaces.";
                } else {
                    temp.comboName = "";
                }
            } else {
                temp.comboName = "This field is required.";
            }
        }

        if ('selectedCourseIds' in fieldValues) {
            if (fieldValues.selectedCourseIds.length < 2) {
                temp.selectedCourseIds = "At least 2 courses must be selected";
            } else {
                temp.selectedCourseIds = "";
            }
        }

        setErrors({
            ...temp
        })

        if (fieldValues === values) {
            return Object.values(temp).every(x => x === "");
        }
    }

    const {onChange, values, errors, setErrors, resetForm, setValues} = useForm(
        initialState,
        true,
        validate,
        initialState
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validate()) {
            if (id != null && id !== undefined && parseInt(id) !== 0) {
                updateCourseCombo(values)
            } else {
                addCourseCombo(values)
            }
        } else {
            console.log("Form Validation Error")
        }
    }

    const addCourseCombo = async (values: ICourseCombo) => {
        try {
            const result = await CourseComboService.add(values);
            if (result.isSuccess === true) {
                navigate("/course-combos");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const updateCourseCombo = async (values: ICourseCombo) => {
        try {
            const result = await CourseComboService.update(values);
            if (result.isSuccess === true) {
                navigate("/course-combos");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const resetFormDetails = () => {
        resetForm()
    }

    const navigateToCourseComboList = () => {
        navigate("/course-combos");
    }

    useEffect(() => {
        if (id != null && id !== undefined && parseInt(id) !== 0) {
            const fetchSelectedCourseCombo = async () => {
                try {
                    const courseCombo = await CourseComboService.getById(parseInt(id));
                    setValues({
                        ...courseCombo
                    })
                } catch (error: any) {
                    console.log(error);
                }
            }
            fetchSelectedCourseCombo();
        }
    }, [id])

    return (
        <>
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                {id !== null && id !== undefined && parseInt(id) !== 0 ? <h1>Edit Course Combo</h1> :
                    <h1>Add Course Combo</h1>}
                <form onSubmit={handleSubmit}>
                    <TextBox 
                        id="comboName" 
                        name="comboName" 
                        type="text" 
                        label="Combo Name"
                        value={values.comboName} 
                        onChange={onChange} 
                        error={errors.comboName}
                    />
                    <TextBox 
              id="selectedCourse"
              name="selectedCourse"
              type="text"
              label="Selected Courses"
              value={values.selectedCourse}
              onChange={onChange}
              disabled error={""}                    />
                    {/* TODO: Add course selection component here */}
                    <CheckBox 
                        name="isActive" 
                        id="isActive" 
                        label="Active Status" 
                        value={values.isActive}
                        onChange={onChange} 
                        className={classes.field}
                    />
                    <TextBox 
              id="remarks"
              name="remarks"
              type="text"
              label="Remarks"
              value={values.remarks}
              onChange={onChange}
              multiline
              rows={4} error={""}                    />
                    <Button type="Submit" text="submit" color="primary" size="small" variant="contained"/>
                    <Button text="Reset" color="default" size="small" variant="contained" onClick={resetForm}/>
                    <Button text="Cancel" color="default" size="small" variant="contained"
                            onClick={navigateToCourseComboList}/>
                </form>
            </Grid>
        </>
    )
}