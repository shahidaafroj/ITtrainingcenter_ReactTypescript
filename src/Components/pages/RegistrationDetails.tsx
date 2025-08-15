import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Button,
  Divider,
  Chip,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { IRegistration } from '../../interfaces/IRegistration';
import { RegistrationService } from '../../utilities/services';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  detailRow: {
    marginBottom: theme.spacing(2),
  },
  label: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(3),
    '& > *': {
      marginRight: theme.spacing(1),
    }
  },
}));

const RegistrationDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<IRegistration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        const data = await RegistrationService.getById(parseInt(id!));
        setRegistration(data);
      } catch (err) {
        setError('Failed to fetch registration details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id && !isNaN(parseInt(id))) {
      fetchRegistration();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!registration) return <Typography>Registration not found</Typography>;

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Registration Details
      </Typography>
      
      <Paper className={classes.paper}>
         <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                src={
                    registration.imagePath
                    ? `http://localhost:5281/api/${registration.imagePath?.split('/').pop()}`
                    : ''
                }
                />
                </Box>
        {/* Basic Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Basic Information
        </Typography>

        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Registration ID:</span> {registration.registrationId}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Trainee Name:</span> {registration.traineeName}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Registration Date:</span> {formatDate(registration.registrationDate)}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Reference:</span> {registration.reference}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Personal Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Personal Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Gender:</span> {registration.gender}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Nationality:</span> {registration.nationality}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Religion:</span> {registration.religion}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Date of Birth:</span> {formatDate(registration.dateOfBirth)}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Marital Status:</span> {registration.maritalStatus}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Father's Name:</span> {registration.fatherName}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Mother's Name:</span> {registration.motherName}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Contact Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Contact Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Contact Number:</span> {registration.contactNo}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Emergency Contact:</span> {registration.emergencyContactNo || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Email:</span> {registration.emailAddress}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Blood Group:</span> {registration.bloodGroup || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Birth/NID Number:</span> {registration.birthOrNIDNo}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Address Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Address Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Present Address:</span></Typography>
            <Typography>{registration.presentAddress}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Permanent Address:</span></Typography>
            <Typography>{registration.permanentAddress}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Education Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Education Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Highest Education:</span> {registration.highestEducation || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Institution Name:</span> {registration.institutionName || 'N/A'}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Course Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Course Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Course:</span> 
              {registration.course?.courseName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
            <Typography><span className={classes.label}>Course Combo:</span> 
              {registration.courseCombo?.comboName || 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0' }} />

        {/* Additional Information */}
        <Typography variant="h6" className={classes.sectionTitle}>
          Additional Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.detailRow}>
            <Typography><span className={classes.label}>Remarks:</span> {registration.remarks || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
        
          </Grid>
          <Grid item xs={12} md={6} className={classes.detailRow}>
          <Typography className={classes.label}>Document:</Typography>
                      <a
                      href={`http://localhost:5281/api/${registration.documentPath?.split('/').pop()}`}
                       target="_blank"
                      rel="noopener noreferrer"
                      >
                      View / Download Document
                      </a>
          </Grid>
        </Grid>

        <Box className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/registrations/edit/${registration.registrationId}`)}
          >
            Edit Registration
          </Button>
          <Button
            variant="outlined"
            color="default"
            onClick={() => navigate('/registrations')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationDetails;