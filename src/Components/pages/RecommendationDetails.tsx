// components/recommendation/RecommendationDetails.tsx
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { IRecommendation } from '../../interfaces/IRecommendation';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import { RecommendationService } from '../../utilities/services/recommendationService';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
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
  statusActive: {
    color: theme.palette.success.main,
    display: 'flex',
    alignItems: 'center',
  },
  statusInactive: {
    color: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
  },
  statusChip: {
    margin: theme.spacing(0.5),
    fontWeight: 'bold',
  },
  statusPending: {
    backgroundColor: '#ff9800',
    color: theme.palette.common.white,
  },
  statusApproved: {
    backgroundColor: '#4caf50',
    color: theme.palette.common.white,
  },
  statusRejected: {
    backgroundColor: '#f44336',
    color: theme.palette.common.white,
  },
}));

export const RecommendationDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
  const fetchRecommendation = async () => {
    try {
      const recommendationId = parseInt(id || '', 10);
      if (isNaN(recommendationId)) {
        throw new Error('Invalid recommendation ID format');
      }

      setLoading(true);
      const { data } = await RecommendationService.getById(recommendationId);
      console.log('API Response:', data);
      
      setRecommendation(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  fetchRecommendation();
}, [id]);

  const getStatusChip = (status: string) => {
    let chipClass = classes.statusPending;
    if (status === 'Approved') chipClass = classes.statusApproved;
    if (status === 'Rejected') chipClass = classes.statusRejected;
    
    return (
      <Chip 
        label={status} 
        className={`${classes.statusChip} ${chipClass}`} 
        size="medium" 
      />
    );
  };

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

  if (!recommendation) {
    return (
      <Container className={classes.root}>
        <Typography>Recommendation not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Recommendation Details</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/recommendations/edit/${recommendation.recommendationId}`)}
        >
          Edit Recommendation
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Basic Info Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recommendation 
              </Typography>
              {getStatusChip(recommendation.recommendationStatus)}
            </Box>
            
            <Divider />
          </Grid>
          
          {/* Main Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant="subtitle2">Trainee:</Typography>
                <Typography>{recommendation?.trainee?.registration?.traineeName || 'N/A'} { recommendation?.traineeIDNo }</Typography>
            </Grid>
            
            <Grid item xs={6}>
                <Typography variant="subtitle2">Instructor:</Typography>
                <Typography>{recommendation?.instructor?.employee?.employeeName || 'N/A'}</Typography>
            </Grid>
            
            <Grid item xs={6}>
                <Typography variant="subtitle2">Batch:</Typography>
                <Typography>{recommendation?.batch?.batchName || 'N/A'}</Typography>
            </Grid>
            
            <Grid item xs={6}>
                <Typography variant="subtitle2">Date:</Typography>
                <Typography>{recommendation?.recommendationDate || 'N/A'}</Typography>
            </Grid>
            </Grid>
          </Grid>
          
          {/* Related Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Related Information
            </Typography>
            
            <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant="subtitle2">Assessment:</Typography>
                <Typography>
                {recommendation?.assessmentId} 
                ({recommendation?.assessment?.isFinalized ? 'Finalized' : 'Pending'})
                </Typography>
            </Grid>
            
            <Grid item xs={6}>
                <Typography variant="subtitle2">Invoice:</Typography>
                <Typography>{recommendation?.invoice?.invoiceNo || 'N/A'}</Typography>
            </Grid>
            </Grid>
          </Grid>
          
          {/* Recommendation Text */}
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Recommendation Text
            </Typography>
            <Paper variant="outlined" style={{ padding: 16 }}>
              <Typography style={{ whiteSpace: 'pre-line' }}>
                {recommendation.recommendationText}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/recommendations')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};