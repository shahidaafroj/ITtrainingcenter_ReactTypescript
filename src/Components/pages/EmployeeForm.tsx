import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import { useNavigate, useParams } from 'react-router-dom';
import { IDepartment, IDesignation, IEmployee } from '../../interfaces';
import { EmployeeService, DepartmentService, DesignationService } from '../../utilities/services';

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
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  buttonGroup: {
    marginTop: theme.spacing(3),
    '& > *': {
      marginRight: theme.spacing(1),
    }
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(1)
  },
}));

const EmployeeForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [designations, setDesignations] = useState<IDesignation[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);

  const initialState: IEmployee = {
    employeeId: 0,
    employeeIDNo: "",
    employeeName: "",
    designationId: 0,
    departmentId: 0,
    contactNo: "",
    dOB: new Date(),
    joiningDate: new Date(),
    endDate: new Date(),
    emailAddress: "",
    permanentAddress: "",
    presentAddress: "",
    fathersName: "",
    mothersName: "",
    birthOrNIDNo: 0,
    isAvailable: false,
    isWillingToSell: false,
    imagePath: "",
    documentPath: ""
  };

  const [formData, setFormData] = useState<IEmployee>(initialState);
  const [errors, setErrors] = useState<Partial<IEmployee>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [departmentData, designationData] = await Promise.all([
          DepartmentService.getAll(),
          DesignationService.getAll()
        ]);
        
        setDepartments(departmentData);
        setDesignations(designationData);

        if (id && !isNaN(parseInt(id))) {
          const employeeData = await EmployeeService.getById(parseInt(id));
          setFormData({
            ...employeeData,
            dOB: employeeData.dOB || new Date().toISOString(),
            joiningDate: employeeData.joiningDate || new Date().toISOString(),
            endDate: employeeData.endDate || new Date()
          });
          
          if (employeeData.imagePath) {
            setImagePreview(`${process.env.REACT_APP_API_URL}/${employeeData.imagePath}`);
          }
          if (employeeData.documentPath) {
            setDocumentFileName(employeeData.documentPath.split('/').pop() || "");
          }
        }
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));

    // Clear error when field is changed
    if (errors[name as keyof IEmployee]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [name]: date.toISOString()
      }));
    }
  };

  const handleCheckboxChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.checked
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        documentFile: file
      }));
      setDocumentFileName(file.name);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<IEmployee> = {};
    
    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    // if (!formData.employeeIDNo) newErrors.employeeIDNo = 'Employee ID is required';
    if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    // if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    // if (!formData.designationId) newErrors.designationId = 'Designation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();

      // Format dates to YYYY-MM-DD
    const formatDate = (date?: Date) => {
  if (!date) return undefined;
  return new Date(date).toISOString().split('T')[0]; // yyyy-mm-dd
};


      // Prepare payload with proper types
      const payload = {
        ...formData,
        employeeId: Number(formData.employeeId),
        departmentId: Number(formData.departmentId),
        designationId: Number(formData.designationId),
        birthOrNIDNo: Number(formData.birthOrNIDNo),
        dOB: formatDate(formData.dOB),
        joiningDate: formatDate(formData.joiningDate),
        endDate: formatDate(formData.endDate),
      };

      // Append all non-file fields
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      // Append files if they exist
      if (formData.imageFile) {
        formDataToSend.append('imageFile', formData.imageFile);
      }
      if (formData.documentFile) {
        formDataToSend.append('documentFile', formData.documentFile);
      }

      // Determine if we're creating or updating
      const isEdit = formData.employeeId > 0;
      const response = isEdit
        ? await EmployeeService.update(formData.employeeId, formDataToSend)
        : await EmployeeService.add(formDataToSend);

      // Show success message and redirect
      setError('');
      navigate('/employees', { state: { success: true } });
      
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        `Failed to ${id ? 'update' : 'create'} employee`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setImagePreview(null);
    setDocumentFileName(null);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Employee' : 'Create New Employee'}
      </Typography>
      
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <Typography variant="h6" className={classes.sectionTitle}>
            Basic Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.avatarContainer}>
              <Avatar
            src={
                formData.imagePath
                ? `http://localhost:5281/api/${formData.imagePath?.split('/').pop()}`
                : ''
            }
            className={classes.avatar}
            />
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                >
                  Upload Image
                </Button>
              </label>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Name"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                error={!!errors.employeeName}
                helperText={errors.employeeName}
                className={classes.formField}
              />
            </Grid>
        
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId || ''}
                  onChange={handleChange}
                  error={!!errors.departmentId}
                >
                  {departments.map(department => (
                    <MenuItem key={department.departmentId} value={department.departmentId}>
                      {department.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departmentId && (
                  <Typography color="error" variant="caption">
                    {errors.departmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="designation-label">Designation</InputLabel>
                <Select
                  labelId="designation-label"
                  id="designationId"
                  name="designationId"
                  value={formData.designationId || ''}
                  onChange={handleChange}
                  error={!!errors.designationId}
                >
                  {designations.map(designation => (
                    <MenuItem key={designation.designationId} value={designation.designationId}>
                      {designation.designationName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.designationId && (
                  <Typography color="error" variant="caption">
                    {errors.designationId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Contact Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Contact Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                error={!!errors.contactNo}
                helperText={errors.contactNo}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                error={!!errors.emailAddress}
                helperText={errors.emailAddress}
                className={classes.formField}
              />
            </Grid>
          </Grid>

          {/* Date Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Date Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <DatePicker
                fullWidth
                label="Date of Birth"
                value={formData.dOB}
                onChange={handleDateChange('dOB')}
                format="dd/MM/yyyy"
                className={classes.formField}
                maxDate={new Date()} // Can't be born in the future
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <DatePicker
                fullWidth
                label="Joining Date"
                value={formData.joiningDate}
                onChange={handleDateChange('joiningDate')}
                format="dd/MM/yyyy"
                className={classes.formField}
                minDate={new Date(formData.dOB)} // Must be after DOB
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <DatePicker
                fullWidth
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                format="dd/MM/yyyy"
                className={classes.formField}
                minDate={new Date(formData.joiningDate)} // Must be after joining date
              />
            </Grid>
          </Grid>

          {/* Address Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Address Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Present Address"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
                className={classes.formField}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                className={classes.formField}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          {/* Family Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Family Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Birth/NID No"
                name="birthOrNIDNo"
                type="number"
                value={formData.birthOrNIDNo}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
          </Grid>

          {/* Status Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Status
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAvailable}
                    onChange={handleCheckboxChange('isAvailable')}
                    name="isAvailable"
                    color="primary"
                  />
                }
                label="Is Available"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isWillingToSell}
                    onChange={handleCheckboxChange('isWillingToSell')}
                    name="isWillingToSell"
                    color="primary"
                  />
                }
                label="Willing to Sell"
              />
            </Grid>
          </Grid>

          {/* Document Upload Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Document Upload
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                accept=".pdf,.doc,.docx"
                id="document-upload"
                type="file"
                onChange={handleDocumentChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="document-upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                >
                  Upload Document
                </Button>
                {documentFileName && (
                  <Typography variant="body2" style={{ marginLeft: 8 }}>
                    {documentFileName}
                  </Typography>
                )}
              </label>
            </Grid>
          </Grid>
           {formData.documentPath && (
                  <Box mt={3}>
                      <Typography >Document:</Typography>
                      <a
                      href={`http://localhost:5281/api/${formData.documentPath?.split('/').pop()}`}
                       target="_blank"
                      rel="noopener noreferrer"
                      >
                      View / Download Document
                      </a>
                  </Box>
           )}

          {/* Form Actions */}
          <Box display="flex" justifyContent="flex-end" className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              color="default"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/employees')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;