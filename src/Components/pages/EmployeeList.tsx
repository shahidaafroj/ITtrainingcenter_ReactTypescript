import React, { useState, useMemo } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Container, Box, Typography } from "@material-ui/core";
import { Button } from '../controls';
import { useNavigate } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { EmployeeService } from '../../utilities/services';
import { IEmployee } from '../../interfaces';
import { useEmployeeHook } from '../../hooks';
import Avatar from '@material-ui/core/Avatar';

interface Column {
    id: 'employeeName' | 'department' | 'designation' | 'contactNo' | 'email' | 'status' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right';
    format?: (value: any) => string;
}

const columns: Column[] = [
    { id: 'employeeName', label: 'Employee Name', minWidth: 150 },
    { id: 'department', label: 'Department', minWidth: 100, format: (value: any) => value?.departmentName || 'N/A' },
    { id: 'designation', label: 'Designation', minWidth: 100, format: (value: any) => value?.designationName || 'N/A' },
    { id: 'contactNo', label: 'Contact No', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'actions', label: 'Action', minWidth: 200, align: 'center' },
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
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(2),
    },
    employeeInfo: {
        display: 'flex',
        alignItems: 'center',
    },
}));

export const EmployeeList = () => {
    const { data: employees, loading, error, refresh } = useEmployeeHook(true);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const navigateToAddEmployee = () => {
        navigate("/employees/add");
    }

    const navigateToEditEmployee = (employeeId: number) => {
        navigate(`/employees/edit/${employeeId}`);
    }

    const showEmployeeDetails = (employeeId: number) => {
        navigate(`/employees/details/${employeeId}`);
    }

    const deleteEmployee = async (record: IEmployee) => {
        try {
            const deleteResponse = await EmployeeService.delete(record.employeeId);
            
            if (deleteResponse.isSuccess) {
                await refresh();
                alert(deleteResponse.message || "Employee deleted successfully");
            } else {
                alert(deleteResponse.message || "Failed to delete employee");
            }
        } catch (error: any) {
            alert("An error occurred while deleting the employee");
        }
    }

    const filteredData = useMemo(() => {
        return employees.filter(x => 
            !search || 
            x.employeeName.toLowerCase().includes(search.toLowerCase()) ||
            x.employeeIDNo.toLowerCase().includes(search.toLowerCase()) ||
            x.contactNo.toLowerCase().includes(search.toLowerCase())
        );
    }, [employees, search]);

    return (
        <Container>
            <div className={classes.searchContainer}>
                <h1 style={{ marginRight: 'auto' }}>Employees</h1>
                <TextField 
                    id="search" 
                    label="Search" 
                    variant="outlined" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className={classes.searchField}
                />
                <Button 
                    text="Add Employee" 
                    color="primary" 
                    size="small" 
                    variant="contained" 
                    onClick={navigateToAddEmployee}
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
                                        style={{ minWidth: column.minWidth }}
                                        className={classes.tableHeader}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record: IEmployee) => {
                                return (
                                    <TableRow hover key={record.employeeId}>
                                        <TableCell>
                                            <div className={classes.employeeInfo}>
                                              <Avatar
                                                src={
                                                    record.imagePath
                                                    ? `http://localhost:5281/api/${record.imagePath?.split('/').pop()}`
                                                    : ''
                                                }
                                                className={classes.avatar}
                                                />
                                                {record.employeeName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.department?.departmentName || 'N/A'}</TableCell>
                                        <TableCell>{record.designation?.designationName || 'N/A'}</TableCell>
                                        <TableCell>{record.contactNo}</TableCell>
                                        <TableCell>{record.emailAddress}</TableCell>
                                        <TableCell align="center">
                                            <span className={record.isAvailable ? classes.statusActive : classes.statusInactive}>
                                                {record.isAvailable ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                text="Details"
                                                color="default"
                                                size="small"
                                                variant="contained"
                                                onClick={() => showEmployeeDetails(record.employeeId)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Edit"
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => navigateToEditEmployee(record.employeeId)}
                                                className={classes.actionButton}
                                            />
                                            <Button
                                                text="Delete"
                                                color="secondary"
                                                size="small"
                                                variant="contained"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you wish to delete this employee?')) {
                                                        deleteEmployee(record);
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
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
};