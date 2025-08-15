// src/components/EmployeeDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IEmployee } from '../../interfaces';
import { EmployeeService } from '../../utilities/services';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Box,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
  },
  label: {
    fontWeight: 600,
  },
  section: {
    marginBottom: theme.spacing(3),
  }
}));

const EmployeeDetails = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee | null>(null);

  useEffect(() => {
    if (id) fetchEmployee(parseInt(id));
  }, [id]);

  const fetchEmployee = async (employeeId: number) => {
    const data = await EmployeeService.getById(employeeId);
    setEmployee(data);
  };

  if (!employee) return <Typography>Loading...</Typography>;

  return (
    <Container className={classes.root}>
      <Typography variant="h4">Employee Details</Typography>
      <Paper className={classes.paper}>
        <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
        src={
            employee.imagePath
            ? `http://localhost:5281/api/${employee.imagePath?.split('/').pop()}`
            : ''
        }
        className={classes.avatar}
        />
          <Typography variant="h5">{employee.employeeName}</Typography>
          <Typography variant="body1" color="textSecondary">
            {employee.designation?.designationName} — {employee.department?.departmentName}
          </Typography>
        </Box>
        {employee.documentPath && (
        <Box mt={3}>
            <Typography className={classes.label}>Document:</Typography>
            <a
            href={`http://localhost:5281/api/${employee.documentPath?.split('/').pop()}`}
             target="_blank"
            rel="noopener noreferrer"
            >
            View / Download Document
            </a>
        </Box>
        )}


        <Grid container spacing={3} className={classes.section}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Contact No:</Typography>
            <Typography>{employee.contactNo}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Email:</Typography>
            <Typography>{employee.emailAddress}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>DOB:</Typography>
            <Typography>{new Date(employee.dOB).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Joining Date:</Typography>
            <Typography>{new Date(employee.joiningDate).toLocaleDateString()}</Typography>
          </Grid>

          {employee.endDate && (
            <Grid item xs={12} md={6}>
              <Typography className={classes.label}>End Date:</Typography>
              <Typography>{new Date(employee.endDate).toLocaleDateString()}</Typography>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3} className={classes.section}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Present Address:</Typography>
            <Typography>{employee.presentAddress}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Permanent Address:</Typography>
            <Typography>{employee.permanentAddress}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Father's Name:</Typography>
            <Typography>{employee.fathersName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Mother's Name:</Typography>
            <Typography>{employee.mothersName}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className={classes.label}>Birth/NID No:</Typography>
            <Typography>{employee.birthOrNIDNo}</Typography>
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate('/employees')}>Back</Button>
          <Button variant="contained" color="primary" onClick={() => navigate(`/employees/edit/${employee.employeeId}`)}>
            Edit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeDetails;
