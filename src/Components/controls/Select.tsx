import React from 'react';
import { 
    FormControl, 
    InputLabel, 
    Select as MuiSelect, 
    MenuItem, 
    FormHelperText,
    makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
}));

interface SelectProps {
    id: string;
    name: string;
    label: string;
    value: any;
    onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
    options: { value: any; label: string }[];
    error?: string;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = (props) => {
    const classes = useStyles();
    const { 
        id, 
        name, 
        label, 
        value, 
        onChange, 
        options, 
        error, 
        className, 
        fullWidth, 
        disabled 
    } = props;

    return (
        <FormControl 
            variant="outlined" 
            className={`${classes.formControl} ${className}`}
            fullWidth={fullWidth}
            error={!!error}
            disabled={disabled}
        >
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <MuiSelect
                labelId={`${id}-label`}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                label={label}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};