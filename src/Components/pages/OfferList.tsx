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
import {Container, Modal, Box, Typography} from "@material-ui/core";
import {Button} from '../controls'
import {useNavigate, useSearchParams} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {useOfferHook} from '../../hooks';
import {OfferService} from '../../utilities/services'
import {IOffer, IResponse} from '../../interfaces'
import {format} from 'date-fns';

interface Column {
    id: 'offerName' | 'offerType' | 'discountPercentage' | 'validFrom' | 'validTo' | 'isActive' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: any) => string;
}

const columns: Column[] = [
    {id: 'offerName', label: 'Offer Name', minWidth: 100},
    {id: 'offerType', label: 'Offer Type', minWidth: 100},
    {id: 'discountPercentage', label: 'Discount (%)', minWidth: 100, align: 'center', 
     format: (value: number) => `${value}%`},
    {id: 'validFrom', label: 'Valid From', minWidth: 100, 
     format: (value: Date) => format(new Date(value), 'MM/dd/yyyy')},
    {id: 'validTo', label: 'Valid To', minWidth: 100, 
     format: (value: Date) => format(new Date(value), 'MM/dd/yyyy')},
    {id: 'isActive', label: 'Is Active?', minWidth: 100, align: 'center'},
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
    },
    dateContainer: {
        display: 'flex',
        gap: theme.spacing(2),
    }
}));

interface OfferFormErrors {
    offerName?: string;
    offerType?: string;
    discountPercentage?: string;
    validFrom?: string;
    validTo?: string;
    [key: string]: string | undefined;
}

export const OfferList = () => {
const { data: offers, loading, error, refresh } = useOfferHook(true);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('filter') || '');
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

    const navigate = useNavigate();

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

    const [formValues, setFormValues] = useState<IOffer>(initialState);
    const [formErrors, setFormErrors] = useState<OfferFormErrors>({});

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openAddOfferModal = () => {
        setFormMode('add');
        setFormValues(initialState);
        setFormErrors({});
        setOpenFormModal(true);
    }

    const openEditOfferModal = (record: IOffer) => {
        setFormMode('edit');
        setFormValues({
            ...record,
            validFrom: new Date(record.validFrom),
            validTo: new Date(record.validTo)
        });
        setFormErrors({});
        setOpenFormModal(true);
    }

    const showOfferDetails = (record: IOffer) => {
        setSelectedOffer(record);
        setOpenDetailsModal(true);
    }

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedOffer(null);
    }

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setFormValues(initialState);
        setFormErrors({});
    }

const deleteOffer = async (record: IOffer) => {
    try {
        console.log("1. Starting delete operation");
        const deleteResponse = await OfferService.delete(record.offerId);
        console.log("2. Delete response:", deleteResponse);
        
        if (deleteResponse.isSuccess) {
            console.log("3. Before refresh");
            await refresh();
            console.log("4. After refresh");
            
            alert(deleteResponse.message || "Offer deleted successfully");
        } else {
            console.error("Delete failed:", deleteResponse.message);
            alert(deleteResponse.message || "Failed to delete offer");
        }
    } catch (error: any) {
        console.error("5. Delete error:", error);
        alert("An error occurred while deleting the offer");
    }
}

const validateForm = (): boolean => {
        const tempErrors: OfferFormErrors = {};
        let isValid = true;

        if (!formValues.offerName) {
            tempErrors.offerName = "This field is required.";
            isValid = false;
        }

        if (!formValues.offerType) {
            tempErrors.offerType = "This field is required.";
            isValid = false;
        }

        if (formValues.discountPercentage <= 0 || formValues.discountPercentage > 100) {
            tempErrors.discountPercentage = "Discount must be between 1 and 100.";
            isValid = false;
        }

        const validFromDate = new Date(formValues.validFrom);
        const validToDate = new Date(formValues.validTo);
        
        if (validFromDate > validToDate) {
            tempErrors.validTo = "Valid To date must be after Valid From date.";
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

    const handleDateChange = (name: string, value: Date | null) => {
        if (value) {
            setFormValues({
                ...formValues,
                [name]: value
            });
        }
    }

// Update the handleFormSubmit function:
const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        alert("Please fix the form errors before submitting");
        return;
    }

    try {
        console.log("Form submission started for:", formMode);
        let result: IResponse;

        if (formMode === 'add') {
            result = await OfferService.add(formValues);
        } else {
            console.log("Updating offer ID:", formValues.offerId);
            result = await OfferService.update(formValues);
        }

        console.log("API Response:", result);

        if (result.isSuccess) {
            console.log("Operation successful, refreshing data...");
            await refresh();
            console.log("Data refresh completed");
            
            handleCloseFormModal();
            
            const successMessage = result.message || 
                (formMode === 'add' 
                    ? "Offer added successfully" 
                    : "Offer updated successfully");
            
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
        return offers.filter(x => !search || x.offerName.toLowerCase().includes(search.toLowerCase()))
    }, [offers, search])

    return (
        <Container>
            <div className={classes.searchContainer}>
                <h1 style={{ marginRight: 'auto' }}>Offers</h1>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Offer" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={openAddOfferModal}
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
                                          className={classes.tableHeader} 
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((offer: IOffer) => {
                                return (
                                    <TableRow hover key={offer.offerId}>
                                        <TableCell>{offer.offerName}</TableCell>
                                        <TableCell>{offer.offerType}</TableCell>
                                        <TableCell align="center">
                                            {offer.discountPercentage}%
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(offer.validFrom), 'MM/dd/yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(offer.validTo), 'MM/dd/yyyy')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <span className={offer.isActive ? classes.statusActive : classes.statusInactive}>
                                                {offer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                text="Details"
                                                color="default"
                                                size="small"
                                                variant="contained"
                                                onClick={() => showOfferDetails(offer)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Edit"
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => openEditOfferModal(offer)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this offer?')) {
                                                        deleteOffer(offer);
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
                    count={offers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Offer Details Modal */}
            <Modal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        Offer Details
                    </Typography>
                    
                    {selectedOffer && (
                        <Box>
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Offer Name:</Typography>
                                <Typography variant="body1">{selectedOffer.offerName}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Description:</Typography>
                                <Typography variant="body1">{selectedOffer.description || 'N/A'}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Offer Type:</Typography>
                                <Typography variant="body1">{selectedOffer.offerType}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Season/Occasion:</Typography>
                                <Typography variant="body1">{selectedOffer.seasonOrOccasion || 'N/A'}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Valid From:</Typography>
                                <Typography variant="body1">
                                    {format(new Date(selectedOffer.validFrom), 'MM/dd/yyyy')}
                                </Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Valid To:</Typography>
                                <Typography variant="body1">
                                    {format(new Date(selectedOffer.validTo), 'MM/dd/yyyy')}
                                </Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Discount Percentage:</Typography>
                                <Typography variant="body1">{selectedOffer.discountPercentage}%</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Payment Condition:</Typography>
                                <Typography variant="body1">{selectedOffer.paymentCondition || 'N/A'}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Status:</Typography>
                                <Typography variant="body1" className={selectedOffer.isActive ? classes.statusActive : classes.statusInactive}>
                                    {selectedOffer.isActive ? 'Active' : 'Inactive'}
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

            {/* Offer Form Modal */}
            <Modal
                open={openFormModal}
                onClose={handleCloseFormModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        {formMode === 'add' ? 'Add Offer' : 'Edit Offer'}
                    </Typography>
                    
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            id="offerName"
                            name="offerName"
                            label="Offer Name"
                            value={formValues.offerName}
                            onChange={handleFormChange}
                            error={!!formErrors.offerName}
                            helperText={formErrors.offerName || ''}
                            className={classes.formField}
                            variant="outlined"
                        />
                        
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            value={formValues.description}
                            onChange={handleFormChange}
                            className={classes.formField}
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                        
                        <TextField
                            select
                            fullWidth
                            id="offerType"
                            name="offerType"
                            label="Offer Type"
                            value={formValues.offerType}
                            onChange={handleFormChange}
                            error={!!formErrors.offerType}
                            helperText={formErrors.offerType || ''}
                            className={classes.formField}
                            variant="outlined"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="Seasonal">Seasonal</option>
                            <option value="Occasional">Occasional</option>
                            <option value="PaymentBased">Payment Based</option>
                        </TextField>
                        
                        {(formValues.offerType === 'Seasonal' || formValues.offerType === 'Occasional') && (
                            <TextField
                                fullWidth
                                id="seasonOrOccasion"
                                name="seasonOrOccasion"
                                label={formValues.offerType === 'Seasonal' ? 'Season' : 'Occasion'}
                                value={formValues.seasonOrOccasion}
                                onChange={handleFormChange}
                                className={classes.formField}
                                variant="outlined"
                            />
                        )}
                        
                        <TextField
                            fullWidth
                            id="discountPercentage"
                            name="discountPercentage"
                            label="Discount Percentage"
                            type="number"
                            value={formValues.discountPercentage}
                            onChange={handleFormChange}
                            error={!!formErrors.discountPercentage}
                            helperText={formErrors.discountPercentage || ''}
                            className={classes.formField}
                            variant="outlined"
                            inputProps={{
                                min: 1,
                                max: 100,
                                step: 1
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            id="paymentCondition"
                            name="paymentCondition"
                            label="Payment Condition"
                            value={formValues.paymentCondition}
                            onChange={handleFormChange}
                            className={classes.formField}
                            variant="outlined"
                        />
                        
                        <Box className={classes.dateContainer}>
                            <TextField
                                fullWidth
                                id="validFrom"
                                label="Valid From"
                                type="date"
                                value={format(new Date(formValues.validFrom), 'yyyy-MM-dd')}
                                onChange={(e) => handleDateChange('validFrom', new Date(e.target.value))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className={classes.formField}
                            />
                            
                            <TextField
                                fullWidth
                                id="validTo"
                                label="Valid To"
                                type="date"
                                value={format(new Date(formValues.validTo), 'yyyy-MM-dd')}
                                onChange={(e) => handleDateChange('validTo', new Date(e.target.value))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!formErrors.validTo}
                                helperText={formErrors.validTo || ''}
                                className={classes.formField}
                            />
                        </Box>
                        
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