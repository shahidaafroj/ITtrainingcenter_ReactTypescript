import React, {useState, useMemo, useEffect} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Container, Modal, Box, Typography, Grid, FormControl, FormGroup, FormControlLabel, Checkbox} from "@material-ui/core";
import {Button} from '../controls'
import {useNavigate, useSearchParams} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {CourseComboService, CourseService} from '../../utilities/services';
import {ICourseCombo, IResponse, ICourse} from '../../interfaces';
import { useCourseComboHook } from '../../hooks';

interface Column {
    id: 'comboName' | 'selectedCourse' | 'isActive' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'comboName', label: 'Combo Name', minWidth: 100},
    {id: 'selectedCourse', label: 'Selected Courses', minWidth: 200},
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
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: theme.spacing(3),
        gap: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1.5, 2),
        borderRadius: 12,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`,
        width: 'fit-content',
        maxWidth: '90%',
    },
    searchField: {
        flexGrow: 1,
        maxWidth: 584,
        minWidth: 300,
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
    courseSelection: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
    },
    errorText: {
        color: theme.palette.error.main,
        fontSize: '0.75rem',
        marginTop: theme.spacing(1),
    }
}));

export const CourseComboList = () => {
    const { data: courseCombos, loading, error, refresh } = useCourseComboHook(true);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('filter') || '');
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedCourseCombo, setSelectedCourseCombo] = useState<ICourseCombo | null>(null);
    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const navigate = useNavigate();

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

    const [formValues, setFormValues] = useState<ICourseCombo>(initialState);
    const [formErrors, setFormErrors] = useState<Partial<ICourseCombo>>({});

    // Fetch courses when component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const result = await CourseService.getAll();
                setCourses(result);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openAddCourseComboModal = () => {
        setFormMode('add');
        setFormValues(initialState);
        setFormErrors({});
        setOpenFormModal(true);
    }

    const openEditCourseComboModal = (record: ICourseCombo) => {
        setFormMode('edit');
        setFormValues(record);
        setFormErrors({});
        setOpenFormModal(true);
    }

    const showCourseComboDetails = (record: ICourseCombo) => {
        setSelectedCourseCombo(record);
        setOpenDetailsModal(true);
    }

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedCourseCombo(null);
    }

    const handleCloseFormModal = () => {
        setOpenFormModal(false);
        setFormValues(initialState);
        setFormErrors({});
    }

    const deleteCourseCombo = async (record: ICourseCombo) => {
        try {
            const deleteResponse = await CourseComboService.delete(record.courseComboId);
            
            if (deleteResponse.isSuccess) {
                await refresh();
                alert(deleteResponse.message || "Course combo deleted successfully");
            } else {
                console.error("Delete failed:", deleteResponse.message);
                alert(deleteResponse.message || "Failed to delete course combo");
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the course combo");
        }
    }

    const validateForm = async () => {
        let tempErrors: Partial<ICourseCombo> = {};
        let isValid = true;

        if (!formValues.comboName) {
            tempErrors.comboName = "This field is required.";
            isValid = false;
        } else if (!/^[a-zA-Z0-9 ]+$/.test(formValues.comboName)) {
            tempErrors.comboName = "Combo Name should contain only alphanumeric characters and spaces.";
            isValid = false;
        } else {
            const isUnique = await CourseComboService.checkNameUnique(
                formValues.comboName, 
                formMode === 'edit' ? formValues.courseComboId : 0
            );
            if (!isUnique) {
                tempErrors.comboName = "A combo with this name already exists.";
                isValid = false;
            }
        }

        if (formValues.selectedCourseIds.length < 2) {
            tempErrors.selectedCourseIdsError = "At least 2 courses must be selected";
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

    const handleCourseSelectionChange = (courseId: number) => {
        const newSelectedIds = [...formValues.selectedCourseIds];
        const index = newSelectedIds.indexOf(courseId);

        if (index === -1) {
            newSelectedIds.push(courseId);
        } else {
            newSelectedIds.splice(index, 1);
        }

        setFormValues({
            ...formValues,
            selectedCourseIds: newSelectedIds
        });
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!await validateForm()) {
            return;
        }

        try {
            let result: IResponse;

            // Update selectedCourse string from selected IDs
            const selectedCourseNames = courses
                .filter(c => formValues.selectedCourseIds.includes(c.courseId))
                .map(c => c.courseName)
                .join(', ');

            const formData = {
                ...formValues,
                selectedCourse: selectedCourseNames
            };

            if (formMode === 'add') {
                result = await CourseComboService.add(formData);
            } else {
                result = await CourseComboService.update(formData);
            }

            if (result.isSuccess) {
                await refresh();
                handleCloseFormModal();
                alert(result.message || (formMode === 'add' 
                    ? "Course combo added successfully" 
                    : "Course combo updated successfully"));
            } else {
                alert(result.message || "Operation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please check console for details.");
        }
    }

    const filteredData = useMemo(() => {
        return courseCombos.filter(x => !search || x.comboName.toLowerCase().includes(search.toLowerCase()))
    }, [courseCombos, search])

    return (
        <Container>
            <div className={classes.searchContainer}>
                <h1 style={{ marginRight: 'auto' }}>Course Combos</h1>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Course Combo" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={openAddCourseComboModal}
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
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: ICourseCombo) => {
                                return (
                                    <TableRow hover key={record.courseComboId}>
                                        <TableCell>{record.comboName}</TableCell>
                                        <TableCell>{record.selectedCourse}</TableCell>
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
                                                onClick={() => showCourseComboDetails(record)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Edit"
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => openEditCourseComboModal(record)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this item?')) {
                                                        deleteCourseCombo(record);
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
                    count={courseCombos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Course Combo Details Modal */}
            <Modal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        Course Combo Details
                    </Typography>
                    
                    {selectedCourseCombo && (
                        <Box>
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Combo Name:</Typography>
                                <Typography variant="body1">{selectedCourseCombo.comboName}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Selected Courses:</Typography>
                                <Typography variant="body1">{selectedCourseCombo.selectedCourse || 'N/A'}</Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Status:</Typography>
                                <Typography variant="body1" className={selectedCourseCombo.isActive ? classes.statusActive : classes.statusInactive}>
                                    {selectedCourseCombo.isActive ? 'Active' : 'Inactive'}
                                </Typography>
                            </div>
                            
                            <div className={classes.modalContent}>
                                <Typography variant="subtitle2" color="textSecondary">Remarks:</Typography>
                                <Typography variant="body1">{selectedCourseCombo.remarks || 'N/A'}</Typography>
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

            {/* Course Combo Form Modal */}
            <Modal
                open={openFormModal}
                onClose={handleCloseFormModal}
                className={classes.modal}
            >
                <Paper className={classes.modalPaper}>
                    <Typography variant="h5" className={classes.modalTitle}>
                        {formMode === 'add' ? 'Add Course Combo' : 'Edit Course Combo'}
                    </Typography>
                    
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            fullWidth
                            id="comboName"
                            name="comboName"
                            label="Combo Name"
                            value={formValues.comboName}
                            onChange={handleFormChange}
                            error={!!formErrors.comboName}
                            helperText={formErrors.comboName}
                            className={classes.formField}
                            variant="outlined"
                        />
                        
                        {/* Course Selection Checkboxes */}
                        <div className={classes.courseSelection}>
                            <Typography variant="subtitle1">Select Courses</Typography>
                            {formErrors.selectedCourseIdsError && (
                                <Typography className={classes.errorText}>
                                    {formErrors.selectedCourseIdsError}
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" gutterBottom>
                                Currently selected: {formValues.selectedCourseIds.length}
                            </Typography>
                            
                            {loadingCourses ? (
                                <Typography>Loading courses...</Typography>
                            ) : (
                                <FormControl component="fieldset" fullWidth>
                                    <FormGroup>
                                        {courses.map((course) => (
                                            <FormControlLabel
                                                key={course.courseId}
                                                control={
                                                    <Checkbox
                                                        checked={formValues.selectedCourseIds.includes(course.courseId)}
                                                        onChange={() => handleCourseSelectionChange(course.courseId)}
                                                        name={course.courseName}
                                                    />
                                                }
                                                label={course.courseName}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            )}
                        </div>
                        
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