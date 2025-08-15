import React, {useEffect} from "react";
import {TextBox, Button, CheckBox} from '../controls'
import {IOffer} from '../../interfaces'
import {useForm} from '../../hooks'
import {Grid, makeStyles, MenuItem, FormControl, InputLabel, Select as MuiSelect, FormHelperText} from "@material-ui/core";
import {OfferService} from '../../utilities/services';
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {DatePicker} from '@material-ui/pickers';

const initialState: IOffer = {
    offerId: 0,
    offerName: "",
    description: "",
    offerType: "Seasonal",
    seasonOrOccasion: "",
    validFrom: new Date(),
    validTo: new Date(),
    discountPercentage: 0,
    paymentCondition: "",
    isActive: true
};

const useStyles = makeStyles({
    field: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
    },
    dateField: {
        marginTop: 30,
        marginBottom: 20,
        display: 'block',
        width: '100%',
    },
    selectField: {
        marginTop: 30,
        marginBottom: 20,
    }
})

export const OfferForm = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const {id} = useParams();

    const validate = (fieldValues = values) => {
        let temp: any = {...errors}
        
        if ('offerName' in fieldValues) {
            if (!fieldValues.offerName) {
                temp.offerName = "This field is required.";
            } else {
                temp.offerName = "";
            }
        }

        if ('offerType' in fieldValues) {
            if (!fieldValues.offerType) {
                temp.offerType = "This field is required.";
            } else {
                temp.offerType = "";
            }
        }

        if ('discountPercentage' in fieldValues) {
            if (fieldValues.discountPercentage <= 0 || fieldValues.discountPercentage > 100) {
                temp.discountPercentage = "Discount must be between 1 and 100.";
            } else {
                temp.discountPercentage = "";
            }
        }

        if ('validFrom' in fieldValues && 'validTo' in fieldValues) {
            if (new Date(fieldValues.validFrom) > new Date(fieldValues.validTo)) {
                temp.validTo = "Valid To date must be after Valid From date.";
            } else {
                temp.validTo = "";
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

    const handleDateChange = (name: string, date: Date | null) => {
        if (date) {
            setValues({
                ...values,
                [name]: date
            });
        }
    }

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        onChange(e as React.ChangeEvent<HTMLInputElement>);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validate()) {
            if (id != null && id !== undefined && parseInt(id) !== 0) {
                updateOffer(values)
            } else {
                addOffer(values)
            }
        } else {
            console.log("Form Validation Error")
        }
    }

    const addOffer = async (values: IOffer) => {
        try {
            const result = await OfferService.add(values);
            if (result.isSuccess === true) {
                navigate("/offers");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const updateOffer = async (values: IOffer) => {
        try {
            const result = await OfferService.update(values);
            if (result.isSuccess === true) {
                navigate("/offers");
            }
        } catch (error: any) {
            console.log(error);
        }
    }

    const resetFormDetails = () => {
        resetForm()
    }

    const navigateToOfferList = () => {
        navigate("/offers");
    }

    useEffect(() => {
        if (id != null && id !== undefined && parseInt(id) !== 0) {
            const fetchSelectedOffer = async () => {
                try {
                    const offer = await OfferService.getById(parseInt(id));
                    setValues({
                        ...offer,
                        validFrom: new Date(offer.validFrom),
                        validTo: new Date(offer.validTo)
                    })
                } catch (error: any) {
                    console.log(error);
                }
            }
            fetchSelectedOffer();
        }
    }, [id])

    return (
        <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
            {id !== null && id !== undefined && parseInt(id) !== 0 ? <h1>Edit Offer</h1> : <h1>Add Offer</h1>}
            <form onSubmit={handleSubmit} style={{width: '80%', maxWidth: '600px'}}>
                <TextBox 
                    id="offerName" 
                    name="offerName" 
                    type="text" 
                    label="Offer Name"
                    value={values.offerName} 
                    onChange={onChange} 
                    error={errors.offerName}
                    className={classes.field}
                />
                
                <TextBox 
                    id="description" 
                    name="description" 
                    type="text" 
                    label="Description"
                    value={values.description} 
                    onChange={onChange} 
                    error=""
                    multiline
                    rows={4}
                    className={classes.field}
                />
                
                <FormControl variant="outlined" className={classes.field} fullWidth error={!!errors.offerType}>
                    <InputLabel id="offerType-label">Offer Type</InputLabel>
                    <MuiSelect
                        labelId="offerType-label"
                        id="offerType"
                        name="offerType"
                        value={values.offerType}
                        onChange={handleSelectChange}
                        label="Offer Type"
                    >
                        <MenuItem value="Seasonal">Seasonal</MenuItem>
                        <MenuItem value="Occasional">Occasional</MenuItem>
                        <MenuItem value="PaymentBased">Payment Based</MenuItem>
                    </MuiSelect>
                    {errors.offerType && <FormHelperText>{errors.offerType}</FormHelperText>}
                </FormControl>
                
                {(values.offerType === 'Seasonal' || values.offerType === 'Occasional') && (
                    <TextBox 
                        id="seasonOrOccasion" 
                        name="seasonOrOccasion" 
                        type="text" 
                        label={values.offerType === 'Seasonal' ? 'Season' : 'Occasion'}
                        value={values.seasonOrOccasion} 
                        onChange={onChange} 
                        error=""
                        className={classes.field}
                    />
                )}
                
                <TextBox 
                    id="discountPercentage" 
                    name="discountPercentage" 
                    type="number" 
                    label="Discount Percentage"
                    value={values.discountPercentage} 
                    onChange={onChange} 
                    error={errors.discountPercentage}
                    inputProps={{min: 1, max: 100}}
                    className={classes.field}
                />
                
                <TextBox 
                    id="paymentCondition" 
                    name="paymentCondition" 
                    type="text" 
                    label="Payment Condition"
                    value={values.paymentCondition} 
                    onChange={onChange} 
                    error=""
                    className={classes.field}
                />
                
                <Grid container spacing={2} className={classes.field}>
                    <Grid item xs={6}>
                        <DatePicker
                            label="Valid From"
                            value={values.validFrom}
                            onChange={(date) => handleDateChange('validFrom', date)}
                            format="MM/dd/yyyy"
                            className={classes.dateField}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            label="Valid To"
                            value={values.validTo}
                            onChange={(date) => handleDateChange('validTo', date)}
                            format="MM/dd/yyyy"
                            className={classes.dateField}
                            error={!!errors.validTo}
                            helperText={errors.validTo}
                        />
                    </Grid>
                </Grid>
                
                <CheckBox 
                    name="isActive" 
                    id="isActive" 
                    label="Active Status" 
                    value={values.isActive}
                    onChange={onChange} 
                    className={classes.field}
                />
                
                <Grid container spacing={2} justify="flex-end">
                    <Grid item>
                        <Button 
                            type="Submit" 
                            text="submit" 
                            color="primary" 
                            size="small" 
                            variant="contained"
                        />
                    </Grid>
                    <Grid item>
                        <Button 
                            text="Reset" 
                            color="default" 
                            size="small" 
                            variant="contained" 
                            onClick={resetFormDetails}
                        />
                    </Grid>
                    <Grid item>
                        <Button 
                            text="Cancel" 
                            color="default" 
                            size="small" 
                            variant="contained"
                            onClick={navigateToOfferList}
                        />
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}