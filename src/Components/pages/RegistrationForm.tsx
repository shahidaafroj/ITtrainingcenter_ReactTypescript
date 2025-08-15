import axios, { AxiosError } from 'axios';
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
import {  IVisitor, ICourse, ICourseCombo } from '../../interfaces';
import { IRegistration } from '../../interfaces/IRegistration';
import { RegistrationService, VisitorService,  CourseComboService } from '../../utilities/services';
import { CourseService } from '../../utilities/services/courseService';
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
}));

const RegistrationForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [visitors, setVisitors] = useState<IVisitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [combos, setCombos] = useState<ICourseCombo[]>([]);

  const initialState: IRegistration = {
    registrationId: 0,
    visitorId: 0,
    traineeName: '',
    registrationDate: new Date().toISOString(),
    gender: '',
    nationality: '',
    religion: '',
    dateOfBirth: new Date().toISOString(),
    originatDateofBirth: new Date().toISOString(),
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    contactNo: '',
    emailAddress: '',
    birthOrNIDNo: '',
    presentAddress: '',
    permanentAddress: '',
    reference: '',
  };

  const [formData, setFormData] = useState<IRegistration>(initialState);
  const [errors, setErrors] = useState<Partial<IRegistration>>({});

  useEffect(() => {
  const fetchCoursesAndCombos = async () => {
    try {
      const [coursesData, combosData] = await Promise.all([
        CourseService.getAll(),
        CourseComboService.getAll()
      ]);
      setCourses(coursesData);
      setCombos(combosData);
    } catch (err) {
      console.error("Failed to fetch courses/combos:", err);
    }
  };

  fetchCoursesAndCombos();
  // ... rest of your useEffect
}, [id]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const data = await VisitorService.getAll();
        setVisitors(data);
      } catch (err) {
        setError('Failed to fetch visitors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegistration = async (id: number) => {
      try {
        setLoading(true);
        const data = await RegistrationService.getById(id);
        setFormData(data);
      } catch (err) {
        setError('Failed to fetch registration');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();

    if (id && !isNaN(parseInt(id))) {
      fetchRegistration(parseInt(id));
    }
  }, [id]);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch visitors, courses, and combos in parallel
        const [visitorsData, coursesData, combosData] = await Promise.all([
          VisitorService.getAll(),
          CourseService.getAll(),
          CourseComboService.getAll()
        ]);
        
        setVisitors(visitorsData);
        setCourses(coursesData);
        setCombos(combosData);

        // If editing, fetch the registration data
        if (id && !isNaN(parseInt(id))) {
          const registrationData = await RegistrationService.getById(parseInt(id));
          setFormData(registrationData);
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

  // Update the handleChange function
const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name as string]: value
  }));

  // Clear error when field is changed
  if (errors[name as keyof IRegistration]) {
    setErrors(prev => ({
      ...prev,
      [name as string]: undefined
    }));
  }

  // Special handling for visitor selection
  if (name === 'visitorId') {
    const selectedVisitor = visitors.find(v => v.visitorId === value);
    if (selectedVisitor) {
      setFormData(prev => ({
        ...prev,
        reference: selectedVisitor.employee?.employeeName || ''
      }));
    }
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

  const validateForm = () => {
  const newErrors: Partial<IRegistration> = {};
  
 
  
  // Rest of the validation checks...
  if (!formData.traineeName) newErrors.traineeName = 'Trainee name is required';
  if (!formData.gender) newErrors.gender = 'Gender is required';
  if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
  if (!formData.emailAddress) newErrors.emailAddress = 'Email is required';
  if (!formData.birthOrNIDNo) newErrors.birthOrNIDNo = 'Birth/NID number is required';
  if (!formData.presentAddress) newErrors.presentAddress = 'Present address is required';
  if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent address is required';
  if (!formData.reference) newErrors.reference = 'Reference is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



const debugFormData = (formData: IRegistration, formDataToSend: FormData) => {
  console.group("Form Data Debugging");
  
  // Log all regular fields
  console.log("--- Regular Fields ---");
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== 'imageFile' && key !== 'documentFile') {
      console.log(`${key}:`, value, `(Type: ${typeof value})`);
    }
  });

  // Log file information
  console.log("--- Files ---");
  console.log("imageFile:", formData.imageFile ? "Exists" : "Missing");
  console.log("documentFile:", formData.documentFile ? "Exists" : "Missing");

  // Log FormData contents (for actual submission)
  console.log("--- FormData Contents ---");
  formDataToSend.forEach((value, key) => {
    console.log(`${key}:`, value, `(Type: ${typeof value})`);
  });

  console.groupEnd();
};

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   try {
//     setLoading(true);
    
//     const formDataToSend = new FormData();

//     // 1. Handle Dates - Convert to YYYY-MM-DD format
//     const formatDateForAPI = (dateString: string) => {
//       return dateString ? new Date(dateString).toISOString().split('T')[0] : null;
//     };

//     // 2. Prepare the payload with proper types
//     const payload = {
//       ...formData,
//       visitorId: Number(formData.visitorId),
//       registrationId: Number(formData.registrationId),
//       courseId: formData.courseId ? Number(formData.courseId) : null,
//       courseComboId: formData.courseComboId ? Number(formData.courseComboId) : null,
//       dateOfBirth: formatDateForAPI(formData.dateOfBirth),
//       originatDateofBirth: formatDateForAPI(formData.originatDateofBirth),
//       registrationDate: formatDateForAPI(formData.registrationDate),
//     };

//     // 3. Append all non-file fields
//     Object.entries(payload).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         formDataToSend.append(key, String(value));
//       }
//     });

//     // 4. Append files separately
//     if (formData.imageFile) {
//       formDataToSend.append('imageFile', formData.imageFile);
//     }
//     if (formData.documentFile) {
//       formDataToSend.append('documentFile', formData.documentFile);
//     }

//     // Debug: Log what's actually being sent
//     console.log("Final FormData:", Object.fromEntries(formDataToSend));

//     const response = formData.registrationId > 0
//       ? await RegistrationService.update(formDataToSend)
//       : await RegistrationService.create(formDataToSend);
    
//     navigate('/registrations');
//   } catch (err: any) {
//     console.error("Full error:", err);
//     console.error("Error response:", err.response?.data);
//     setError(
//       err.response?.data?.message || 
//       err.message || 
//       "Registration failed. Please check all fields and try again."
//     );
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();

      // Format dates to YYYY-MM-DD
      const formatDate = (dateString: string) => 
        dateString ? new Date(dateString).toISOString().split('T')[0] : null;

      // Prepare payload with proper types
      const payload = {
        ...formData,
        visitorId: Number(formData.visitorId),
        registrationId: Number(formData.registrationId),
        courseId: formData.courseId ? Number(formData.courseId) : null,
        courseComboId: formData.courseComboId ? Number(formData.courseComboId) : null,
        dateOfBirth: formatDate(formData.dateOfBirth),
        originatDateofBirth: formatDate(formData.originatDateofBirth),
        registrationDate: formatDate(formData.registrationDate),
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
      const isEdit = formData.registrationId > 0;
      const response = isEdit
        ? await RegistrationService.update(formDataToSend)
        : await RegistrationService.create(formDataToSend);

      // Show success message and redirect
      setError('');
      navigate('/registrations', { state: { success: true } });
      
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        `Failed to ${id ? 'update' : 'create'} registration`
      );
    } finally {
      setLoading(false);
    }
  };


  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Registration' : 'Create New Registration'}
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="visitor-label">Visitor</InputLabel>
                <Select
                  labelId="visitor-label"
                  id="visitorId"
                  name="visitorId"
                  value={formData.visitorId || ''}
                  onChange={handleChange}
                  error={!!errors.visitorId}
                >
                  {visitors.map(visitor => (
                    <MenuItem key={visitor.visitorId} value={visitor.visitorId}>
                      {visitor.visitorName} ({visitor.contactNo})
                    </MenuItem>
                  ))}
                </Select>
                {errors.visitorId && (
                  <Typography color="error" variant="caption">
                    {errors.visitorId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trainee Name"
                name="traineeName"
                value={formData.traineeName}
                onChange={handleChange}
                error={!!errors.traineeName}
                helperText={errors.traineeName}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                fullWidth
                label="Registration Date"
                value={formData.registrationDate}
                onChange={handleDateChange('registrationDate')}
                format="dd/MM/yyyy"
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reference (Employee Name)"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                error={!!errors.reference}
                helperText={errors.reference}
                className={classes.formField}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          {/* Personal Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography color="error" variant="caption">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                error={!!errors.nationality}
                helperText={errors.nationality}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                error={!!errors.religion}
                helperText={errors.religion}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                fullWidth
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange('dateOfBirth')}
                format="dd/MM/yyyy"
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                fullWidth
                label="Original Date of Birth"
                value={formData.originatDateofBirth}
                onChange={handleDateChange('originatDateofBirth')}
                format="dd/MM/yyyy"
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel id="marital-status-label">Marital Status</InputLabel>
                <Select
                  labelId="marital-status-label"
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  error={!!errors.maritalStatus}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
                {errors.maritalStatus && (
                  <Typography color="error" variant="caption">
                    {errors.maritalStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                error={!!errors.fatherName}
                helperText={errors.fatherName}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                error={!!errors.motherName}
                helperText={errors.motherName}
                className={classes.formField}
              />
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
                label="Emergency Contact Number"
                name="emergencyContactNo"
                value={formData.emergencyContactNo || ''}
                onChange={handleChange}
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
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Birth/NID Number"
                name="birthOrNIDNo"
                value={formData.birthOrNIDNo}
                onChange={handleChange}
                error={!!errors.birthOrNIDNo}
                helperText={errors.birthOrNIDNo}
                className={classes.formField}
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
                error={!!errors.presentAddress}
                helperText={errors.presentAddress}
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
                error={!!errors.permanentAddress}
                helperText={errors.permanentAddress}
                className={classes.formField}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          {/* Education Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Education Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Highest Education"
                name="highestEducation"
                value={formData.highestEducation || ''}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Institution Name"
                name="institutionName"
                value={formData.institutionName || ''}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
          </Grid>

          {/* Course Information Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Course Information
          </Typography>
          
          <Grid container spacing={3}>
            {/* Course Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className={classes.formField}>
                    <InputLabel id="course-label">Course</InputLabel>
                    <Select
                      labelId="course-label"
                      id="courseId"
                      name="courseId"
                      value={formData.courseId || ''}
                      onChange={handleChange}
                    >
                      {courses.map(course => (
                        <MenuItem key={course.courseId} value={course.courseId}>
                          {course.courseName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Course Combo Dropdown */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className={classes.formField}>
                    <InputLabel id="combo-label">Course Combo</InputLabel>
                    <Select
                      labelId="combo-label"
                      id="courseComboId"
                      name="courseComboId"
                      value={formData.courseComboId || ''}
                      onChange={handleChange}
                    >
                      {combos.map(combo => (
                        <MenuItem key={combo.courseComboId} value={combo.courseComboId}>
                          {combo.comboName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
          </Grid>

          {/* Remarks Section */}
          <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
            Additional Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks || ''}
                onChange={handleChange}
                className={classes.formField}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          {/* File Upload Section */}
                  <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 24 }}>
                    Document Uploads
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <input
                        accept="image/*"
                        id="image-upload"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData(prev => ({
                              ...prev,
                              imageFile: e.target.files![0]
                            }));
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          className={classes.formField}
                        >
                          Upload Image
                        </Button>
                        {formData.imageFile && (
                          <Typography variant="body2" style={{ marginLeft: 8 }}>
                            {formData.imageFile.name}
                          </Typography>
                        )}
                      </label>
                                    <Avatar
                                  src={
                                      formData.imagePath
                                      ? `http://localhost:5281/api/${formData.imagePath?.split('/').pop()}`
                                      : ''
                                  }
                                  />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <input
                        accept=".pdf,.doc,.docx"
                        id="document-upload"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData(prev => ({
                              ...prev,
                              documentFile: e.target.files![0]
                            }));
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="document-upload">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          className={classes.formField}
                        >
                          Upload Document
                        </Button>
                        {formData.documentFile && (
                          <Typography variant="body2" style={{ marginLeft: 8 }}>
                            {formData.documentFile.name}
                          </Typography>
                        )}
                      </label>
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
                    </Grid>
                      
                  </Grid>

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
              onClick={() => navigate('/registrations')}
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

export default RegistrationForm;