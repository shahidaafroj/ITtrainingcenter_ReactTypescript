import React, {useEffect} from "react";
import {TextBox, Button, CheckBox} from '../controls'
import {IDesignation} from '../../interfaces'
import {useForm} from '../../hooks'
import {Grid, makeStyles} from "@material-ui/core";
import {DesignationService} from '../../utilities/services';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const initialState: IDesignation = {
    designationId: 0,
    designationName: "",
    jobRoles: "",
    isActive: false
};

const useStyles = makeStyles({
    field: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
    }
})

export const DesignationForm = () => {

    const classes = useStyles();
    const navigate = useNavigate();
    const {id} = useParams();

    const validate = (fieldValues = values) => {
        let temp: any = {...errors}
        if ('designationName' in fieldValues) {
            if (fieldValues.designationName) {
                if (!(/^[a-zA-Z]+$/).test(fieldValues.designationName)) {
                    temp.designationName = "Designation Name should contain only alphabets.";
                } else {
                    temp.designationName = "";
                }
            } else {
                temp.designationName = "This field is required.";
            }
        }

        setErrors({
            ...temp
        })

        if (fieldValues === values) {
            if (temp.designationName === "") {
                return true;
            }
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
                updateDesignation(values)
            } else {
                addDesignation(values)
            }
        } else {
            console.log("Form Validation Error")
        }
    }

    const addDesignation = async (values: IDesignation) => {
        try {
            const result = await DesignationService.add(values);
            if (result.isSuccess === true) {
                navigate("/designations");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const updateDesignation = async (values: IDesignation) => {
        try {
            const result = await DesignationService.update(values);
            if (result.isSuccess === true) {
                navigate("/designations");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const resetFormDetails = () => {
        resetForm()
    }

    const navigateToDesignationList = () => {
        navigate("/designations");
    }

    useEffect(() => {
        if (id != null && id !== undefined && parseInt(id) !== 0) {
            const fetchSelectedDesignation = async () => {
                try {
                    const designation = await DesignationService.getById(parseInt(id));
                    setValues({
                        ...designation
                    })
                } catch (error: any) {
                }
            }
            fetchSelectedDesignation();
        }
    }, [])

    return (
        <>
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                {id !== null && id !== undefined && parseInt(id) !== 0 ? <h1>Edit Designation</h1> :
                    <h1>Add Designation</h1>}
                <form onSubmit={handleSubmit}>
                    <TextBox id="designationName" name="designationName" type="text" label="Designation Name"
                            value={values.designationName} onChange={onChange} error={errors.designationName}/>
                    <TextBox id="jobRoles" name="jobRoles" type="text" label="Job Roles"
            value={values.jobRoles} onChange={onChange} multiline rows={4} error={""}/>
                    <CheckBox name="isActive" id="isActive" label="Active Status" value={values.isActive}
                             onChange={onChange} className={classes.field}/>
                    <Button type="Submit" text="submit" color="primary" size="small" variant="contained"/>
                    <Button text="Reset" color="default" size="small" variant="contained" onClick={resetForm}/>
                    <Button text="Cancel" color="default" size="small" variant="contained"
                            onClick={navigateToDesignationList}/>
                </form>
            </Grid>
        </>
    )
}