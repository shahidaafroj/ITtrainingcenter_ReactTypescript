import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider,
  Button,
  Chip,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { IBatchTransfer } from '../../interfaces/IBatchTransfer';
import { BatchTransferService } from '../../utilities/services/batchTransferService';

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
  detailItem: {
    marginBottom: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(1),
  },
}));

export const BatchTransferDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [transfer, setTransfer] = useState<IBatchTransfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        if (!id) {
          throw new Error('No ID provided');
        }
        
        const transferId = parseInt(id);
        if (isNaN(transferId)) {
          throw new Error('Invalid ID format');
        }

        setLoading(true);
        const data = await BatchTransferService.getById(transferId);
        setTransfer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load batch transfer');
      } finally {
        setLoading(false);
      }
    };

    fetchTransfer();
  }, [id]);

  if (loading) {
    return (
      <Container className={classes.root}>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
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

  if (!transfer) {
    return (
      <Container className={classes.root}>
        <Typography>Batch transfer not found</Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Batch Transfer Details</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/batch-transfers/edit/${transfer.batchTransferId}`)}
        >
          Edit Transfer
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Trainee Information
            </Typography>
            
            <Box className={classes.detailItem}>
              <Typography variant="subtitle2">Trainee:</Typography>
              <Typography>
                {transfer.traineeName} ({transfer.traineeNo})
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Batch Information
            </Typography>
            
            <Box className={classes.detailItem}>
              <Typography variant="subtitle2">Batch:</Typography>
              <Typography>{transfer.batchName}</Typography>
            </Box>
            
            <Box className={classes.detailItem}>
              <Typography variant="subtitle2">Transfer Date:</Typography>
              <Typography>
                {transfer.transferDate ? moment(transfer.transferDate).format('DD MMM YYYY') : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => navigate('/batch-transfers')}
          >
            Back to List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};