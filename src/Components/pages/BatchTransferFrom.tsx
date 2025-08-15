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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { IBatchOption, IBatchTransfer, ITraineeOption } from '../../interfaces/IBatchTransfer';
import { BatchTransferService } from '../../utilities/services/batchTransferService';

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

export const BatchTransferForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  const [formData, setFormData] = useState<IBatchTransfer>({
    traineeId: 0,
    traineeName: '',
    traineeNo: '',
    batchId: 0,
    batchName: '',
    transferDate: null
  });
  
  const [traineeOptions, setTraineeOptions] = useState<ITraineeOption[]>([]);
  const [batchOptions, setBatchOptions] = useState<IBatchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trainees, batches] = await Promise.all([
          BatchTransferService.getTraineeOptions(),
          BatchTransferService.getBatchOptions()
        ]);
        
        setTraineeOptions(trainees);
        setBatchOptions(batches);
        
        if (id && id !== 'new') {
          const transfer = await BatchTransferService.getById(parseInt(id));
          setFormData(transfer);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbarMessage('Failed to load data');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Prepare payload in exact format API expects
    const payload = {
      traineeId: formData.traineeId,
      batchId: formData.batchId,
      transferDate: formData.transferDate 
        ? moment(formData.transferDate).format('YYYY-MM-DD') // Format as simple date string
        : null,
      createdDate: null // Explicitly set as null as per your API
    };

    console.log('Final payload:', payload);

    let response;
    if (id && id !== 'new') {
      response = await BatchTransferService.update(parseInt(id), payload);
    } else {
      response = await BatchTransferService.create(payload);
    }

    console.log('Success:', response);
    setSnackbarMessage(id ? 'Updated successfully' : 'Created successfully');
    setSnackbarOpen(true);
    setTimeout(() => navigate('/batch-transfers'), 1500);
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    setSnackbarMessage(error.response?.data?.title || error.message);
    setSnackbarOpen(true);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleTraineeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const traineeId = e.target.value as number;
    const selectedTrainee = traineeOptions.find(t => t.traineeId === traineeId);
    
    setFormData({
      ...formData,
      traineeId,
      traineeName: selectedTrainee?.traineeName || '',
      traineeNo: selectedTrainee?.traineeNo || ''
    });
  };

  const handleBatchChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const batchId = e.target.value as number;
    const selectedBatch = batchOptions.find(b => b.batchId === batchId);
    
    setFormData({
      ...formData,
      batchId,
      batchName: selectedBatch?.batchName || ''
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      transferDate: date
    });
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Batch Transfer' : 'Create Batch Transfer'}
      </Typography>
      
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Trainee Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Trainee</InputLabel>
                <Select
                  value={formData.traineeId}
                  onChange={handleTraineeChange}
                  label="Trainee"
                  required
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value={0}>Select Trainee</MenuItem>
                  {traineeOptions.map((trainee) => (
                    <MenuItem key={trainee.traineeId} value={trainee.traineeId}>
                      {trainee.traineeName} ({trainee.traineeNo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Batch Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={formData.batchId}
                  onChange={handleBatchChange}
                  label="Batch"
                  required
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value={0}>Select Batch</MenuItem>
                  {batchOptions.map((batch) => (
                    <MenuItem key={batch.batchId} value={batch.batchId}>
                      {batch.batchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Transfer Date */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Transfer Date"
                value={formData.transferDate}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                fullWidth
                required
                disabled={loading || isSubmitting}
              />
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => navigate('/batch-transfers')}
                  style={{ marginRight: 16 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    id ? 'Update' : 'Create'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};