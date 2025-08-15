import React from 'react';
import { 
    TextField,
    makeStyles
} from '@material-ui/core';
import { DatePicker as MuiDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
}));

interface DatePickerProps {
    id: string;
    name: string;
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    error?: string;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    format?: string;
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
    const classes = useStyles();
    const { 
        id, 
        name, 
        label, 
        value, 
        onChange, 
        error, 
        className, 
        fullWidth, 
        disabled,
        format = 'dd/MM/yyyy'
    } = props;

    return (
        <MuiDatePicker
            id={id}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            format={format}
            className={`${classes.root} ${className}`}
            fullWidth={fullWidth}
            disabled={disabled}
            inputVariant="outlined"
            autoOk
            animateYearScrolling
            TextFieldComponent={(props) => (
                <TextField 
                    {...props} 
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};