
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
import {Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Typography, DialogContentText} from "@material-ui/core";
import {Button} from '../controls'
import {useSearchParams} from "react-router-dom";

import {DesignationHook, useDesignationHook} from '../../hooks';
import {DesignationService} from '../../utilities/services/designationService'
import {IDesignation, IResponse} from '../../interfaces'
interface Column {
    id: 'designationName' | 'jobRoles' | 'isActive' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'designationName', label: 'Designation Name', minWidth: 100},
    {id: 'jobRoles', label: 'Job Roles', minWidth: 150},
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
        marginBottom: theme.spacing(3),
    },
    dialogTitle: {
        paddingBottom: theme.spacing(2),
    },
}));

export const DesignationList = () => {
const { data: designations, loading, error, refresh } = useDesignationHook(true);
      const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('filter') || '');
    const [selectedDesignation, setSelectedDesignation] = useState<IDesignation | null>(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<IDesignation>({
        designationId: 0,
        designationName: '',
        jobRoles: '',
        isActive: false
    });
    const [errors, setErrors] = useState({
        designationName: '',
        jobRoles: ''
    });

    const validate = () => {
        let valid = true;
        const newErrors = {
            designationName: '',
            jobRoles: ''
        };

        if (!formData.designationName.trim()) {
            newErrors.designationName = 'Designation name is required';
            valid = false;
        }

        if (!formData.jobRoles.trim()) {
            newErrors.jobRoles = 'Job roles are required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const showAddDesignation = () => {
        setFormData({
            designationId: 0,
            designationName: '',
            jobRoles: '',
            isActive: false
        });
        setIsEditMode(false);
        setOpenFormDialog(true);
    };

    const showEditDesignation = (record: IDesignation) => {
        setFormData({
            designationId: record.designationId,
            designationName: record.designationName,
            jobRoles: record.jobRoles,
            isActive: record.isActive
        });
        setIsEditMode(true);
        setOpenFormDialog(true);
    };

    const showDesignationDetails = (record: IDesignation) => {
        setSelectedDesignation(record);
        setOpenDetailsDialog(true);
    };

    const closeDetailsDialog = () => {
        setOpenDetailsDialog(false);
        setSelectedDesignation(null);
    };

    const closeFormDialog = () => {
        setOpenFormDialog(false);
        setFormData({
            designationId: 0,
            designationName: '',
            jobRoles: '',
            isActive: false
        });
        setErrors({
            designationName: '',
            jobRoles: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // const handleSubmit = async () => {
    //     if (!validate()) return;

    //     try {
    //         let response;
    //         if (isEditMode) {
    //             response = await DesignationService.update(formData);
    //         } else {
    //             response = await DesignationService.add(formData);
    //         }

    //         if (response.isSuccess) {
    //             const designationList = await DesignationService.getAll();
    //             setDesignations(designationList);
    //             closeFormDialog();
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };


     const handleSubmit = async () => {
        if (!validate()) return;

        try {
            console.log("Form submission started");
            let response: IResponse;
            
            if (isEditMode) {
                console.log("Updating designation ID:", formData.designationId);
                response = await DesignationService.update(formData);
            } else {
                console.log("Adding new designation");
                response = await DesignationService.add(formData);
            }

            console.log("API Response:", response);

            if (response.isSuccess) {
                console.log("Operation successful, refreshing data...");
                await refresh();
                console.log("Data refresh completed");
                
                closeFormDialog();
                
                // Show success message
                const successMessage = response.message || 
                    (isEditMode 
                        ? "Designation updated successfully" 
                        : "Designation added successfully");
                
                alert(successMessage);
            } else {
                console.error("Operation failed:", response.message);
                alert(response.message || "Operation failed. Please try again.");
            }
        } catch (error) {
            console.error("Unexpected error during form submission:", error);
            alert("An unexpected error occurred. Please check console for details.");
        }
    };


    // const deleteDesignation = async (record: IDesignation) => {
    //     try {
    //         const deleteResponse = await DesignationService.delete(record.designationId);
    //         if (deleteResponse.isSuccess) {
    //             const designationList = await DesignationService.getAll();
    //             setDesignations(designationList);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

      const deleteDesignation = async (record: IDesignation) => {
        try {
            console.log("Starting delete operation for designation ID:", record.designationId);
            const deleteResponse = await DesignationService.delete(record.designationId);
            console.log("Delete response:", deleteResponse);
            
            if (deleteResponse.isSuccess) {
                console.log("Before refresh");
                await refresh();
                console.log("After refresh");
                
                alert(deleteResponse.message || "Designation deleted successfully");
            } else {
                console.error("Delete failed:", deleteResponse.message);
                alert(deleteResponse.message || "Failed to delete designation");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the designation");
        }
    };


    const filteredData = useMemo(() => {
        return designations.filter(x => !search || x.designationName.includes(search));
    }, [designations, search]);

    return (
        <Container>
            <div className={classes.searchContainer}>
                <Typography variant="h4" style={{ marginRight: 'auto' }}>Designations</Typography>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Designation" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={showAddDesignation}
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
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                                <TableRow hover key={record.designationId}>
                                    <TableCell>{record.designationName}</TableCell>
                                    <TableCell>{record.jobRoles}</TableCell>
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
                                            onClick={() => showDesignationDetails(record)}
                                            className={classes.actionButton}
                                        />
                                        <Button
                                            text="Edit"
                                            color="primary"
                                            size="small"
                                            variant="contained"
                                            onClick={() => showEditDesignation(record)}
                                            className={classes.actionButton}
                                        />
                                        <Button
                                            text="Delete"
                                            color="secondary"
                                            size="small"
                                            variant="contained"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you wish to delete this item?')) {
                                                    deleteDesignation(record);
                                                }
                                            }}
                                            className={classes.actionButton}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={designations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Details Dialog */}
            <Dialog open={openDetailsDialog} onClose={closeDetailsDialog} maxWidth="sm" fullWidth>
                <DialogTitle className={classes.dialogTitle}>Designation Details</DialogTitle>
                <DialogContent>
                    {selectedDesignation && (
                        <>
                            <DialogContentText>
                                <strong>Designation Name:</strong> {selectedDesignation.designationName}
                            </DialogContentText>
                            <DialogContentText>
                                <strong>Job Roles:</strong> {selectedDesignation.jobRoles}
                            </DialogContentText>
                            <DialogContentText>
                                <strong>Active Status:</strong> 
                                <span className={selectedDesignation.isActive ? classes.statusActive : classes.statusInactive}>
                                    {selectedDesignation.isActive ? ' Active' : ' Inactive'}
                                </span>
                            </DialogContentText>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeDetailsDialog} 
                        text="Close" 
                        variant="outlined" 
                        color="default" 
                        size="small"
                    />
                </DialogActions>
            </Dialog>

            {/* Add/Edit Form Dialog */}
            <Dialog open={openFormDialog} onClose={closeFormDialog} maxWidth="sm" fullWidth>
                <DialogTitle className={classes.dialogTitle}>
                    {isEditMode ? 'Edit Designation' : 'Add New Designation'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        name="designationName"
                        label="Designation Name"
                        value={formData.designationName}
                        onChange={handleInputChange}
                        error={!!errors.designationName}
                        helperText={errors.designationName}
                        fullWidth
                        className={classes.formField}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="jobRoles"
                        label="Job Roles"
                        value={formData.jobRoles}
                        onChange={handleInputChange}
                        error={!!errors.jobRoles}
                        helperText={errors.jobRoles}
                        fullWidth
                        multiline
                        rows={4}
                        className={classes.formField}
                        margin="normal"
                        variant="outlined"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                color="primary"
                            />
                        }
                        label="Active Status"
                        className={classes.formField}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeFormDialog} 
                        text="Cancel" 
                        variant="outlined" 
                        color="default" 
                        size="small"
                    />
                    <Button 
                        onClick={handleSubmit} 
                        text={isEditMode ? 'Update' : 'Save'} 
                        variant="contained" 
                        color="primary" 
                        size="small"
                    />
                </DialogActions>
            </Dialog>
        </Container>
    );
};

// import React, {useState, useMemo} from "react";
// import {makeStyles} from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import {Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@material-ui/core";
// import {Button} from '../controls'
// import {useNavigate, useSearchParams} from "react-router-dom";
// import TextField from '@material-ui/core/TextField';

// import {DesignationHook} from '../../hooks';
// import {DesignationService} from '../../utilities/services/designationService'
// import {IDesignation} from '../../interfaces'

// interface Column {
//     id: 'designationName' | 'jobRoles' | 'isActive' | 'actions';
//     label: string;
//     minWidth?: number;
//     align?: 'center' | 'right';
//     format?: (value: number) => string;
// }

// const columns: Column[] = [
//     {id: 'designationName', label: 'Designation Name', minWidth: 100},
//     {id: 'jobRoles', label: 'Job Roles', minWidth: 150},
//     {id: 'isActive', label: 'IsActive?', minWidth: 100, align: 'center'},
//     {id: 'actions', label: 'Action', minWidth: 200, align: 'center'},
// ];

// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//     },
//     container: {
//         maxHeight: 440,
//     },
//     actionButton: {
//         margin: theme.spacing(0.5),
//     },
//     statusActive: {
//         color: theme.palette.success.main,
//         fontWeight: 'bold',
//     },
//     statusInactive: {
//         color: theme.palette.error.main,
//         fontWeight: 'bold',
//     },
//     searchContainer: {
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: theme.spacing(3),
//         gap: theme.spacing(2),
//     },
//     searchField: {
//         flexGrow: 1,
//         '& .MuiOutlinedInput-root': {
//             height: 40,
//         },
//     },
// }));

// export const DesignationList = () => {
//     const {data: designations, setData: setDesignations} = DesignationHook(true);
//     const classes = useStyles();
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);
//     const [searchParams] = useSearchParams();
//     const [search, setSearch] = useState(searchParams.get('filter') || '');
//     const [selectedDesignation, setSelectedDesignation] = useState<IDesignation | null>(null);
//     const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

//     const navigate = useNavigate();

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     const navigateToAddDesignation = () => {
//         navigate("/add-designation");
//     }

//     const navigateToEditDesignation = (record: IDesignation) => {
//         navigate(`/update-designation/${record.designationId}`);
//     }

//     const showDesignationDetails = (record: IDesignation) => {
//         setSelectedDesignation(record);
//         setOpenDetailsDialog(true);
//     }

//     const closeDetailsDialog = () => {
//         setOpenDetailsDialog(false);
//         setSelectedDesignation(null);
//     }

//     const deleteDesignation = async (record: IDesignation) => {
//         try {
//             const deleteResponse = await DesignationService.delete(record.designationId);
//             if (deleteResponse.isSuccess) {
//                 const designationList = await DesignationService.getAll();
//                 setDesignations(designationList)
//             }
//         } catch (error: any) {
//             console.log(error)
//         }
//     }

//     const filteredData = useMemo(() => {
//         return designations.filter(x => !search || x.designationName.includes(search))
//     }, [designations, search])

//     return (
//         <Container>
//             <div className={classes.searchContainer}>
//                 <h1 style={{ marginRight: 'auto' }}>Designations</h1>
//                 <TextField 
//                     id="search" 
//                     label="Search" 
//                     variant="outlined" 
//                     value={search} 
//                     onChange={(e) => setSearch(e.target.value)} 
//                     className={classes.searchField}
//                 />
//                 <Button 
//                     text="Add Designation" 
//                     color="primary" 
//                     size="small" 
//                     variant="contained" 
//                     onClick={navigateToAddDesignation}
//                 />
//             </div>

//             <Paper className={classes.root}>
//                 <TableContainer className={classes.container}>
//                     <Table stickyHeader aria-label="sticky table">
//                         <TableHead>
//                             <TableRow>
//                                 {columns.map((column) => (
//                                     <TableCell
//                                         key={column.id}
//                                         align={column.align}
//                                         style={{minWidth: column.minWidth}}
//                                     >
//                                         {column.label}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: IDesignation) => {
//                                 return (
//                                     <TableRow hover key={record.designationId}>
//                                         <TableCell>{record.designationName}</TableCell>
//                                         <TableCell>{record.jobRoles}</TableCell>
//                                         <TableCell align="center">
//                                             <span className={record.isActive ? classes.statusActive : classes.statusInactive}>
//                                                 {record.isActive ? 'Active' : 'Inactive'}
//                                             </span>
//                                         </TableCell>
//                                         <TableCell align="center">
//                                             <Button
//                                                 text="Details"
//                                                 color="default"
//                                                 size="small"
//                                                 variant="contained"
//                                                 onClick={() => showDesignationDetails(record)}
//                                                 className={classes.actionButton}
//                                             />
//                                             <Button
//                                                 text="Edit"
//                                                 color="primary"
//                                                 size="small"
//                                                 variant="contained"
//                                                 onClick={() => navigateToEditDesignation(record)}
//                                                 className={classes.actionButton}
//                                             />
//                                             <Button
//                                                 text="Delete"
//                                                 color="secondary"
//                                                 size="small"
//                                                 variant="contained"
//                                                 onClick={() => {
//                                                     if (window.confirm('Are you sure you wish to delete this item?')) deleteDesignation(record)
//                                                 }}
//                                                 className={classes.actionButton}
//                                             />
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[10, 25, 100]}
//                     component="div"
//                     count={designations.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Paper>

//             {/* Details Dialog */}
//             <Dialog open={openDetailsDialog} onClose={closeDetailsDialog} maxWidth="sm" fullWidth>
//                 <DialogTitle>Designation Details</DialogTitle>
//                 <DialogContent>
//                     {selectedDesignation && (
//                         <>
//                             <DialogContentText>
//                                 <strong>Designation Name:</strong> {selectedDesignation.designationName}
//                             </DialogContentText>
//                             <DialogContentText>
//                                 <strong>Job Roles:</strong> {selectedDesignation.jobRoles}
//                             </DialogContentText>
//                             <DialogContentText>
//                                 <strong>Active Status:</strong> 
//                                 <span className={selectedDesignation.isActive ? classes.statusActive : classes.statusInactive}>
//                                     {selectedDesignation.isActive ? ' Active' : ' Inactive'}
//                                 </span>
//                             </DialogContentText>
//                         </>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button 
//                         onClick={closeDetailsDialog} 
//                         text="Close" 
//                         variant="outlined" 
//                         color="default" 
//                         size="small"
//                     />
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// }