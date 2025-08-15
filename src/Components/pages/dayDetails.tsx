import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider,
  CircularProgress,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { DayService } from '../../utilities/services';
import { IDay } from '../../interfaces/Iday';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

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
}));

export const DayDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [day, setDay] = useState<IDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDay = async () => {
      try {
        if (!id) {
          throw new Error('No ID provided');
        }
        
        const dayId = parseInt(id);
        if (isNaN(dayId)) {
          throw new Error('Invalid ID format');
        }

        setLoading(true);
        const data = await DayService.getById(dayId);
        setDay(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load day');
      } finally {
        setLoading(false);
      }
    };

    fetchDay();
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

  if (!day) {
    return (
      <Container className={classes.root}>
        <Typography>Day not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Day Details</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/days/edit/${day.dayId}`)}
        >
          Edit Day
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
             
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Day Name:</Typography>
                <Typography>{day.dayName}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Status:</Typography>
                <Box className={day.isActive ? classes.statusActive : classes.statusInactive}>
                  {day.isActive ? (
                    <>
                      <CheckCircleIcon style={{ marginRight: 8 }} />
                      <Typography>Active</Typography>
                    </>
                  ) : (
                    <>
                      <CancelIcon style={{ marginRight: 8 }} />
                      <Typography>Inactive</Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/days')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};