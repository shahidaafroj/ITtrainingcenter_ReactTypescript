import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IVisitorr } from '../../interfaces/IVisitor';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { VisitorService } from '../../utilities/services/visitorService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

const VisitorDetails = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState<IVisitorr | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        if (!id) throw new Error('No ID provided');
        const visitorId = parseInt(id);
        if (isNaN(visitorId)) throw new Error('Invalid ID format');

        setLoading(true);
        const data = await VisitorService.getById(visitorId);
        setVisitor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load visitor');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitor();
  }, [id]);

  if (loading) {
    return (
      <Container className={classes.root}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!visitor) {
    return (
      <Container className={classes.root}>
        <Typography>Visitor not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/visitors')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Visitor Details</Typography>
      </Box>

      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Visitor Profile */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar className={classes.avatar}>
                <PersonIcon style={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {visitor.visitorName}
              </Typography>
              <Chip
                label={`Visitor ID: ${visitor.visitorNo || visitor.visitorId}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Visitor Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Contact Number:</Typography>
                <Typography>{visitor.contactNo}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography>{visitor.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Visit Date & Time:</Typography>
                <Typography>
                  {format(new Date(visitor.visitDateTime), 'dd MMM yyyy hh:mm a')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Visitor Type:</Typography>
                <Typography>{visitor.visitorType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address:</Typography>
                <Typography>{visitor.address}</Typography>
              </Grid>
            </Grid>

            <Divider className={classes.sectionTitle} />

            {/* Additional Information */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Additional Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Education Level:</Typography>
                <Typography>{visitor.educationLevel}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Expected Course:</Typography>
                <Typography>{visitor.expectedCourse}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Visit Purpose:</Typography>
                <Typography>{visitor.visitPurpose || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Visitor Source:</Typography>
                <Typography>{visitor.visitorSource}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Reference:</Typography>
                <Typography>{visitor.reference || 'Not specified'}</Typography>
              </Grid>
            </Grid>

            {/* Employee Information */}
            <Typography variant="h6" className={classes.sectionTitle}>
              Employee Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Employee Comments:</Typography>
                <Typography style={{ whiteSpace: 'pre-line' }}>{visitor.employeeComments}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Assigned Employee ID:</Typography>
                <Typography>{visitor.employeeId}</Typography>
                {visitor.employeeName && (
                  <>
                    <Typography variant="subtitle2">Employee Name:</Typography>
                    <Typography>{visitor.employeeName}</Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Company Name:</Typography>
                <Typography>{visitor.companyName || 'Not specified'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/visitors/edit/${visitor.visitorId}`)}
            style={{ marginRight: 16 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/visitors')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VisitorDetails;