import React, {useEffect} from "react";
import {TextBox, Button, CheckBox} from '../controls'
import {IDepartment} from '../../interfaces'
import {useForm} from '../../hooks'
import {Grid, makeStyles} from "@material-ui/core";
import {DepartmentService} from '../../utilities/services';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const initialState: IDepartment = {
    departmentId: 0,
    departmentName: "",
    remarks: "",
    isActive: false
};

const useStyles = makeStyles({
    field: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
    }
})

export const DepartmentForm = () => {

    const classes = useStyles();
    const navigate = useNavigate();
    const {id} = useParams();

    const validate = (fieldValues = values) => {
        let temp: any = {...errors}
        if ('departmentName' in fieldValues) {
            if (fieldValues.departmentName) {
                if (!(/^[a-zA-Z]+$/).test(fieldValues.departmentName)) {
                    temp.departmentName = "Department Name should contain only alphabets.";
                } else {
                    temp.departmentName = "";
                }
            } else {
                temp.departmentName = "This field is required.";
            }
        }

        setErrors({
            ...temp
        })

        if (fieldValues === values) {
            if (temp.departmentName === "") {
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
                updateDepartment(values)
            } else {
                addDepartment(values)
            }
        } else {
            console.log("Form Validation Error")
        }
    }

    const addDepartment = async (values: IDepartment) => {
        try {
            const result = await DepartmentService.add(values);
            if (result.isSuccess === true) {
                navigate("/departments");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const updateDepartment = async (values: IDepartment) => {
        try {
            const result = await DepartmentService.update(values);
            if (result.isSuccess === true) {
                navigate("/departments");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const resetFormDetails = () => {
        resetForm()
    }

    const navigateToDepartmentList = () => {
        navigate("/departments");
    }

    useEffect(() => {
        if (id != null && id !== undefined && parseInt(id) !== 0) {
            const fetchSelectedDepartment = async () => {
                try {
                    const department = await DepartmentService.getById(parseInt(id));
                    setValues({
                        ...department
                    })
                } catch (error: any) {
                }
            }
            fetchSelectedDepartment();
        }
    }, [])

    return (
        <>
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                {id !== null && id !== undefined && parseInt(id) !== 0 ? <h1>Edit Department</h1> :
                    <h1>Add Department</h1>}
                <form onSubmit={handleSubmit}>
                    <TextBox id="departmentName" name="departmentName" type="text" label="Department Name"
                            value={values.departmentName} onChange={onChange} error={errors.departmentName}/>
                    <TextBox id="remarks" name="remarks" type="text" label="Remarks"
            value={values.remarks} onChange={onChange} error={""}/>
                    <CheckBox name="isActive" id="isActive" label="Active Status" value={values.isActive}
                             onChange={onChange} className={classes.field}/>
                    <Button type="Submit" text="submit" color="primary" size="small" variant="contained"/>
                    <Button text="Reset" color="default" size="small" variant="contained" onClick={resetForm}/>
                    <Button text="Cancel" color="default" size="small" variant="contained"
                            onClick={navigateToDepartmentList}/>
                </form>
            </Grid>
        </>
    )
}