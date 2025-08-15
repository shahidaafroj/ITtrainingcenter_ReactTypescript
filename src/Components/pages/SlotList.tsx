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
import { useSlotHook } from '../../hooks';
import {SlotService} from '../../utilities/services/slotService'
import {IResponse, ISlot} from '../../interfaces'

interface Column {
    id: 'timeSlotType' | 'startTime' | 'endTime' | 'isActive' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'timeSlotType', label: 'Time Slot Type', minWidth: 100},
    {id: 'startTime', label: 'Start Time', minWidth: 100},
    {id: 'endTime', label: 'End Time', minWidth: 100},
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

    tableHeader: {
    fontWeight: 'bold',
    backgroundColor: 'hsla(189, 97.60%, 52.00%, 0.91)',
     color: 'white'
  },


    actionButton: {
        margin: theme.spacing(0.5),
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

export const SlotList = () => {
const { data: slots, loading, error, refresh } = useSlotHook(true);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('filter') || '');
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

    const navigate = useNavigate();

    const initialState: ISlot = {
        slotId: 0,
        timeSlotType: "",
        startTime: "",
        endTime: "",
        isActive: false
    };

    const [formValues, setFormValues] = useState<ISlot>(initialState);
    const [formErrors, setFormErrors] = useState<Partial<ISlot>>({});

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openAddSlotModal = () => {
        setFormMode('add');
        setFormValues(initialState);
        setFormErrors({});
        setOpenFormModal(true);
    }

const openEditSlotModal = (record: ISlot) => {
    setFormMode('edit');
    setFormValues({
        ...record,
        startTime: record.startTime, // Ensure time format is correct
        endTime: record.endTime
    });
    setFormErrors({});
    setOpenFormModal(true);
}

const showSlotDetails = (record: ISlot) => {
        setSelectedSlot(record);
        setOpenDetailsModal(true);
    }

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedSlot(null);
    }

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setFormValues(initialState);
        setFormErrors({});
    }

const deleteSlot = async (slotId: number) => {
    try {
        const deleteResponse = await SlotService.delete(slotId);
        console.log("Delete response:", deleteResponse);
        
        if (deleteResponse.isSuccess) {
            await refresh();
            
            alert(deleteResponse.message || "Slot deleted successfully");
        } else {
            console.error("Delete failed:", deleteResponse.message);
            alert(deleteResponse.message || "Failed to delete slot");
        }
    } catch (error: any) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the slot");
    }
}


const validateForm = () => {
        let tempErrors: Partial<ISlot> = {};
        let isValid = true;

        if (!formValues.timeSlotType) {
            tempErrors.timeSlotType = "This field is required.";
            isValid = false;
        }

        if (!formValues.startTime) {
            tempErrors.startTime = "Start time is required.";
            isValid = false;
        }

        if (!formValues.endTime) {
            tempErrors.endTime = "End time is required.";
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
    
    if (!validateForm()) {
        alert("Please fix the form errors before submitting");
        return;
    }

    try {
        let result: IResponse;

        // Prepare payload with proper time format
        const payload = {
            ...formValues,
            startTime: formValues.startTime.includes(":") ? formValues.startTime : `${formValues.startTime}:00`,
            endTime: formValues.endTime.includes(":") ? formValues.endTime : `${formValues.endTime}:00`
        };

        if (formMode === 'add') {
            result = await SlotService.add(payload);
        } else {
            result = await SlotService.update(payload);
        }


        if (result.isSuccess) {
            await refresh();            
            handleCloseFormModal();            
            const successMessage = result.message || 
                (formMode === 'add' 
                    ? "Slot added successfully" 
                    : "Slot updated successfully");
            
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
        return slots.filter(x => !search || x.timeSlotType.includes(search))
    }, [slots, search])

    return (
        <Container>
            <div className={classes.searchContainer}>
                <h1 style={{ marginRight: 'auto' }}>Slots</h1>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Slot" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={openAddSlotModal}
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
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: ISlot) => {
                                return (
                                    <TableRow hover key={record.slotId}>
                                        <TableCell>{record.timeSlotType}</TableCell>
                                        <TableCell>{record.startTime}</TableCell>
                                        <TableCell>{record.endTime}</TableCell>
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
                                                onClick={() => showSlotDetails(record)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Edit"
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => openEditSlotModal(record)}
                                                className={classes.actionButton}
                                            />
                                            {/* <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this item?')) {
                                                        deleteSlot(record);
                                                    }
                                                }}
                                                className={classes.actionButton}
                                            /> */}



                                            <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                               variant="contained"
                                               onClick={() => {
                                               if (window.confirm('Are you sure you wish to delete this item?')) {
                                             deleteSlot(record.slotId); // Pass just the ID, not the whole record
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
                    count={slots.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Slot Details Modal */}
            <Modal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        Slot Details
                    </Typography>
                    
                    {selectedSlot && (
                        <Box>
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Time Slot Type:</Typography>
                                <Typography variant="body1">{selectedSlot.timeSlotType}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Start Time:</Typography>
                                <Typography variant="body1">{selectedSlot.startTime}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">End Time:</Typography>
                                <Typography variant="body1">{selectedSlot.endTime}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Status:</Typography>
                                <Typography variant="body1" className={selectedSlot.isActive ? classes.statusActive : classes.statusInactive}>
                                    {selectedSlot.isActive ? 'Active' : 'Inactive'}
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

            {/* Slot Form Modal */}
            <Modal
                open={openFormModal}
                onClose={handleCloseFormModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        {formMode === 'add' ? 'Add Slot' : 'Edit Slot'}
                    </Typography>
                    
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            id="timeSlotType"
                            name="timeSlotType"
                            label="Time Slot Type"
                            value={formValues.timeSlotType}
                            onChange={handleFormChange}
                            error={!!formErrors.timeSlotType}
                            helperText={formErrors.timeSlotType}
                            className={classes.formField}
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            id="startTime"
                            name="startTime"
                            label="Start Time"
                            type="time"
                            value={formValues.startTime}
                            onChange={handleFormChange}
                            error={!!formErrors.startTime}
                            helperText={formErrors.startTime}
                            className={classes.formField}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            id="endTime"
                            name="endTime"
                            label="End Time"
                            type="time"
                            value={formValues.endTime}
                            onChange={handleFormChange}
                            error={!!formErrors.endTime}
                            helperText={formErrors.endTime}
                            className={classes.formField}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
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

