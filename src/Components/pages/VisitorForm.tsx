import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import {  IVisitorr } from '../../interfaces/IVisitor';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { VisitorService } from '../../utilities/services/visitorService';
import { EmployeeService } from '../../utilities/services/employeeService';
import { IEmployee } from '../../interfaces/IVisitorTransfer';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const VisitorForm = () => {
  const classes = useStyles();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IVisitorr>({
    visitorId: 0,
    visitorName: '',
    contactNo: '',
    email: '',
    visitDateTime: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    address: '',
    educationLevel: '',
    visitorType: '',
    employeeComments: '',
    employeeId: null,
    expectedCourse: '',
    visitorSource: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      console.log('Starting employee fetch...'); // Debug log
      
      const data = await VisitorService.getAllEmp();
      console.log('Fetched employees data:', data); // Detailed debug log
      
      if (data && Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.warn('Invalid employee data received:', data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', {
        error,
      });
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };
  
  fetchEmployees();
}, []);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchVisitor(parseInt(id));
    }
  }, [id]);

  const fetchVisitor = async (id: number) => {
    try {
      setLoading(true);
      const visitor = await VisitorService.getById(id);
      setFormData(visitor);
    } catch (error) {
      console.error('Error fetching visitor:', error);
      showSnackbar('Failed to load visitor data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (formData.visitorId > 0) {
        await VisitorService.update(formData.visitorId, formData);
        showSnackbar('Visitor updated successfully', 'success');
      } else {
        await VisitorService.create(formData);
        showSnackbar('Visitor created successfully', 'success');
      }
      
      setTimeout(() => navigate('/visitors'), 1500);
    } catch (error) {
      console.error('Error saving visitor:', error);
      showSnackbar('Failed to save visitor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  const { name, value } = event.target;
  if (name) {
    setFormData(prev => ({ 
      ...prev, 
      [name]: String(value) 
    }));
  }
};

const handleSelectChangee = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  const name = event.target.name as keyof IVisitorr;
  const value = event.target.value;
 
  setFormData(prev => ({
    ...prev,
    [name]: value === '' ? null : Number(value)
  }));
};

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/visitors')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {id ? 'Edit Visitor' : 'Add New Visitor'}
        </Typography>
      </Box>

      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visitor Name"
                name="visitorName"
                value={formData.visitorName}
                onChange={handleInputChange}
                required
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact No"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visit Date & Time"
                name="visitDateTime"
                type="datetime-local"
                value={formData.visitDateTime}
                onChange={handleInputChange}
                required
                className={classes.formField}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Visitor Details */}
            <Grid item xs={12}>
              <Divider className={classes.sectionTitle} />
              <Typography variant="h6" className={classes.sectionTitle}>
                Visitor Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={classes.formField}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Education Level"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                required
                className={classes.formField}
              />

              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Visitor Type</InputLabel>
                <Select
                    name="visitorType"
                    value={formData.visitorType}
                    onChange={handleSelectChange}
                    label="Visitor Type"
                    required
                >
                    <MenuItem value="">
                    <em>Select Visitor Type</em>
                    </MenuItem>
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Organization">Organization</MenuItem>
                </Select>
                </FormControl>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Divider className={classes.sectionTitle} />
              <Typography variant="h6" className={classes.sectionTitle}>
                Additional Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visit Purpose"
                name="visitPurpose"
                value={formData.visitPurpose || ''}
                onChange={handleInputChange}
                className={classes.formField}
              />
              <TextField
                fullWidth
                label="Expected Course"
                name="expectedCourse"
                value={formData.expectedCourse}
                onChange={handleInputChange}
                required
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Visitor Source</InputLabel>
                <Select
                    name="visitorSource"
                    value={formData.visitorSource}
                    onChange={handleSelectChange}
                    label="Visitor Source"
                    required
                >
                    <MenuItem value="">
                    <em>Select Visitor Source</em>
                    </MenuItem>
                    <MenuItem value="Referral">Referral</MenuItem>
                    <MenuItem value="Walk-in">Walk-in</MenuItem>
                    <MenuItem value="Social Media">Social Media</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                </Select>
                </FormControl>
              <TextField
                fullWidth
                label="Reference"
                name="reference"
                value={formData.reference || ''}
                onChange={handleInputChange}
                className={classes.formField}
              />
            </Grid>

            {/* Employee Information */}
            <Grid item xs={12}>
              <Divider className={classes.sectionTitle} />
              <Typography variant="h6" className={classes.sectionTitle}>
                Employee Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Comments"
                name="employeeComments"
                value={formData.employeeComments}
                onChange={handleInputChange}
                required
                className={classes.formField}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleInputChange}
                className={classes.formField}
              />
<FormControl fullWidth className={classes.formField}>
  <InputLabel>Employee</InputLabel>
  <Select
    name="employeeId"
    value={formData.employeeId || ''}
    onChange={handleSelectChangee}
    label="Employee"
    required
    disabled={loadingEmployees}
  >
    {loadingEmployees ? (
      <MenuItem disabled value="">
        <CircularProgress size={24} />
      </MenuItem>
    ) : [
      <MenuItem key="empty" value="">
        <em>Select Employee</em>
      </MenuItem>,
      ...employees.map((employee) => (
        <MenuItem 
          key={employee.employeeId} 
          value={employee.employeeId}
        >
          {employee.employeeName} ({employee.employeeId})
        </MenuItem>
      ))
    ]}
  </Select>
</FormControl>

            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/visitors')}
                  style={{ marginRight: 16 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box
          style={{
            backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography>{snackbarMessage}</Typography>
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
            style={{ marginLeft: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Container>
  );
};

export default VisitorForm;