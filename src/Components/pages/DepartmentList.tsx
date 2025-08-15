
import React, {useState, useMemo} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Container, Modal, Box, Typography, Grid} from "@material-ui/core";
import {Button} from '../controls'
import {useNavigate, useSearchParams} from "react-router-dom";
import TextField from '@material-ui/core/TextField';

// import {DepartmentHook} from '../../hooks';
import {DepartmentService} from '../../utilities/services/departmentService'
import {IDepartment, IResponse} from '../../interfaces'

import {DepartmentHook, useDepartmentHook} from '../../hooks';


interface Column {
    id: 'departmentName' | 'remarks' | 'isActive' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'departmentName', label: 'Department Name', minWidth: 100},
    {id: 'remarks', label: 'Remarks', minWidth: 150},
    {id: 'isActive', label: 'IsActive?', minWidth: 100, align: 'center'},
    {id: 'actions', label: 'Action', minWidth: 200, align: 'center'},
];

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    actionButton: {
        margin: theme.spacing(0.5),
    },


     tableHeader: {
    fontWeight: 'bold',
    backgroundColor: 'hsla(189, 97.60%, 52.00%, 0.91)',
     color: 'white'
  },



    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        minWidth: 400,
        maxWidth: 600,
        outline: 'none',
    },
    modalTitle: {
        marginBottom: theme.spacing(3),
    },
    modalContent: {
        marginBottom: theme.spacing(2),
    },
    modalButtons: {
        marginTop: theme.spacing(3),
    },
    statusActive: {
        color: theme.palette.success.main,
        fontWeight: 'bold',
    },
    statusInactive: {
        color: theme.palette.error.main,
        fontWeight: 'bold',
    },
searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
    margin: '0 auto', // Center the container itself
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    width: 'fit-content', // Adjust width to content
    maxWidth: '90%', // Prevent touching screen edges on mobile
},
searchField: {
    flexGrow: 1,
    maxWidth: 584, // Google's exact search field width (when expanded)
    minWidth: 300, // Minimum width before it looks too cramped
    '& .MuiOutlinedInput-root': {
        height: 44,
        borderRadius: 24,
        backgroundColor: theme.palette.common.white,
        boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)',
        '&:hover': {
            boxShadow: '0 2px 8px 1px rgba(64,60,67,.24)',
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.common.white,
            boxShadow: '0 2px 8px 1px rgba(64,60,67,.24)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiOutlinedInput-input': {
        padding: '0 16px',
        fontSize: '16px',
        lineHeight: '44px',
    },
},
    
formField: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'block',
    },
    formButtons: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing(2),
    }
}));

export const DepartmentList = () => {
    // const {data: departments, setData: setDepartments} = DepartmentHook(true);
    const { data: departments, loading, error, refresh } = useDepartmentHook(true);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('filter') || '');
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<IDepartment | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

    const navigate = useNavigate();

    const initialState: IDepartment = {
        departmentId: 0,
        departmentName: "",
        remarks: "",
        isActive: false
    };

    const [formValues, setFormValues] = useState<IDepartment>(initialState);
    const [formErrors, setFormErrors] = useState<Partial<IDepartment>>({});

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openAddDepartmentModal = () => {
        setFormMode('add');
        setFormValues(initialState);
        setFormErrors({});
        setOpenFormModal(true);
    }

    const openEditDepartmentModal = (record: IDepartment) => {
        setFormMode('edit');
        setFormValues(record);
        setFormErrors({});
        setOpenFormModal(true);
    }

    const showDepartmentDetails = (record: IDepartment) => {
        setSelectedDepartment(record);
        setOpenDetailsModal(true);
    }

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedDepartment(null);
    }

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setFormValues(initialState);
        setFormErrors({});
    }

     const deleteDepartment = async (record: IDepartment) => {
        try {
            console.log("1. Starting delete operation");
            const deleteResponse = await DepartmentService.delete(record.departmentId);
            console.log("2. Delete response:", deleteResponse);
            
            // সরাসরি status চেক করার পরিবর্তে isSuccess চেক করুন
            if (deleteResponse.isSuccess) {
                console.log("3. Before refresh");
                await refresh();
                console.log("4. After refresh");
                
                // অপশনাল: সাকসেস মেসেজ দেখান
                alert(deleteResponse.message || "Department deleted successfully");
            } else {
                console.error("Delete failed:", deleteResponse.message);
                alert(deleteResponse.message || "Failed to delete department");
            }
        } catch (error: any) {
            console.error("5. Delete error:", error);
            alert("An error occurred while deleting the department");
        }
    }

    const validateForm = () => {
        let tempErrors: Partial<IDepartment> = {};
        let isValid = true;

        if (!formValues.departmentName) {
            tempErrors.departmentName = "This field is required.";
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(formValues.departmentName)) {
            tempErrors.departmentName = "Department Name should contain only alphabets.";
            isValid = false;
        }

        setFormErrors(tempErrors);
        return isValid;
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value
        });
    }


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            alert("Please fix the form errors before submitting");
            return;
        }

        try {
            console.log("Form submission started for:", formMode);
            let result: IResponse;

            if (formMode === 'add') {
                result = await DepartmentService.add(formValues);
            } else {
                console.log("Updating department ID:", formValues.departmentId);
                result = await DepartmentService.update(formValues);
            }

            console.log("API Response:", result);

            if (result.isSuccess) {
                console.log("Operation successful, refreshing data...");
                await refresh();
                console.log("Data refresh completed");
                
                handleCloseFormModal();
                
                // Show appropriate success message
                const successMessage = result.message || 
                    (formMode === 'add' 
                        ? "Department added successfully" 
                        : "Department updated successfully");
                
                alert(successMessage);
            } else {
                console.error("Operation failed:", result.message);
                alert(result.message || "Operation failed. Please try again.");
            }
        } catch (error) {
            console.error("Unexpected error during form submission:", error);
            alert("An unexpected error occurred. Please check console for details.");
        }
    }

    
    const filteredData = useMemo(() => {
        return departments.filter(x => !search || x.departmentName.includes(search))
    }, [departments, search])

    return (
        <Container>
            <div className={classes.searchContainer}>
                <h1 style={{ marginRight: 'auto' }}>Departments</h1>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Department" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={openAddDepartmentModal}
                />
            </div>

            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
                                           className={classes.tableHeader} // Add this line
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: IDepartment) => {
                                return (
                                    <TableRow hover key={record.departmentId}>
                                        <TableCell>{record.departmentName}</TableCell>
                                        <TableCell>{record.remarks}</TableCell>
                                        <TableCell align="center">
                                            <span className={record.isActive ? classes.statusActive : classes.statusInactive}>
                                                {record.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                text="Details"
                                                color="default"
                                                size="small"
                                                variant="contained"
                                                onClick={() => showDepartmentDetails(record)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Edit"
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => openEditDepartmentModal(record)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this item?')) {
                                                        deleteDepartment(record);
                                                    }
                                                }}
                                                className={classes.actionButton}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={departments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Department Details Modal */}
            <Modal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        Department Details
                    </Typography>
                    
                    {selectedDepartment && (
                        <Box>
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Department Name:</Typography>
                                <Typography variant="body1">{selectedDepartment.departmentName}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Remarks:</Typography>
                                <Typography variant="body1">{selectedDepartment.remarks || 'N/A'}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Status:</Typography>
                                <Typography variant="body1" className={selectedDepartment.isActive ? classes.statusActive : classes.statusInactive}>
                                    {selectedDepartment.isActive ? 'Active' : 'Inactive'}
                                </Typography>
                            </div>
                            
                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <Button
                                    variant="outlined"
                                    color="default"
                                    onClick={handleCloseDetailsModal}
                                    size="small"
                                    text="Close"
                                />
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Modal>

            {/* Department Form Modal */}
            <Modal
                open={openFormModal}
                onClose={handleCloseFormModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        {formMode === 'add' ? 'Add Department' : 'Edit Department'}
                    </Typography>
                    
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            id="departmentName"
                            name="departmentName"
                            label="Department Name"
                            value={formValues.departmentName}
                            onChange={handleFormChange}
                            error={!!formErrors.departmentName}
                            helperText={formErrors.departmentName}
                            className={classes.formField}
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            id="remarks"
                            name="remarks"
                            label="Remarks"
                            value={formValues.remarks}
                            onChange={handleFormChange}
                            className={classes.formField}
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                        
                        <Box className={classes.formField}>
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formValues.isActive}
                                onChange={handleFormChange}
                            />
                            <label htmlFor="isActive" style={{ marginLeft: 8 }}>
                                Active Status
                            </label>
                        </Box>
                        
                        <Box className={classes.formButtons}>
                            <Button
                                type="submit"
                                text="Submit"
                                color="primary"
                                size="small"
                                variant="contained"
                            />
                            <Button
                                text="Reset"
                                color="default"
                                size="small"
                                variant="contained"
                                onClick={() => setFormValues(initialState)}
                            />
                            <Button
                                text="Cancel"
                                color="default"
                                size="small"
                                variant="contained"
                                onClick={handleCloseFormModal}
                            />
                        </Box>
                    </form>
                </Paper>
            </Modal>
        </Container>
    );
};