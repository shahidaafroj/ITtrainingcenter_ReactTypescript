import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { RegistrationService } from '../../utilities/services';
import { IRegistration } from '../../interfaces/IRegistration';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  searchField: {
    marginBottom: theme.spacing(3),
    width: '300px',
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
}));

const RegistrationList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await RegistrationService.getAll();
        setRegistrations(data);
      } catch (err) {
        setError('Failed to fetch registrations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await RegistrationService.delete(id);
        setRegistrations(registrations.filter(reg => reg.registrationId !== id));
      } catch (err) {
        setError('Failed to delete registration');
        console.error(err);
      }
    }
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.contactNo.includes(searchTerm) ||
    reg.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className={classes.root}>
      <Box className={classes.titleContainer}>
        <Typography variant="h4">Registration List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/registrations/new')}
        >
          Add New Registration
        </Button>
        
      </Box>

      <TextField
        className={classes.searchField}
        label="Search Registrations"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>ID</TableCell>
              <TableCell className={classes.tableHeader}>Trainee Name</TableCell>
              <TableCell className={classes.tableHeader}>Contact No</TableCell>
              <TableCell className={classes.tableHeader}>Email</TableCell>
              <TableCell className={classes.tableHeader}>Registration Date</TableCell>
              <TableCell className={classes.tableHeader}>Reference</TableCell>
              <TableCell className={classes.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No registrations found</TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((registration) => (
                <TableRow key={registration.registrationId}>
                  <TableCell>{registration.registrationId}</TableCell>
                  <TableCell>{registration.traineeName}</TableCell>
                  <TableCell>{registration.contactNo}</TableCell>
                  <TableCell>{registration.emailAddress}</TableCell>
                  <TableCell>
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{registration.reference}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.actionButton}
                      onClick={() => navigate(`/registrations/edit/${registration.registrationId}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(registration.registrationId)}
                    >
                      Delete
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        size="small"
                        onClick={() => navigate(`/registrations/details/${registration.registrationId}`)}
                    >
                        Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RegistrationList;