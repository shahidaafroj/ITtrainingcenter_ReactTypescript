import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box, 
  FormControlLabel, 
  Checkbox,
  CircularProgress,
  Snackbar,
  IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { DayService } from '../../utilities/services';
import { IDay } from '../../interfaces/Iday';
import CloseIcon from '@material-ui/icons/Close';

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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

const CustomAlert = ({ severity, message, onClose }: { 
  severity: 'success' | 'error', 
  message: string, 
  onClose: () => void 
}) => {
  return (
    <Box 
      bgcolor={severity === 'success' ? 'success.main' : 'error.main'} 
      color="white" 
      p={2} 
      borderRadius={4}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography>{message}</Typography>
      <IconButton
        size="small"
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const DayForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  const [formData, setFormData] = useState<IDay>({
    dayId: 0,
    dayName: '',
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchDay = async () => {
      if (id && id !== 'new') {
        try {
          setLoading(true);
          const day = await DayService.getById(parseInt(id));
          setFormData(day);
        } catch (err) {
          setError('Failed to load day');
          showSnackbar('Failed to load day', 'error');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDay();
  }, [id]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (formData.dayId > 0) {
        await DayService.update(formData.dayId, formData);
        showSnackbar('Day updated successfully', 'success');
      } else {
        await DayService.create(formData);
        showSnackbar('Day created successfully', 'success');
      }
      
      setTimeout(() => navigate('/days'), 1500);
    } catch (error) {
      console.error('Error saving day:', error);
      showSnackbar('Failed to save day', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Day' : 'Add New Day'}
      </Typography>
      
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Day Name"
                name="dayName"
                value={formData.dayName}
                onChange={handleInputChange}
                className={classes.formField}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Active"
                className={classes.formField}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => navigate('/days')}
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
                  {loading ? 'Saving...' : 'Save'}
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
        <CustomAlert 
          severity={snackbarSeverity} 
          message={snackbarMessage} 
          onClose={handleSnackbarClose} 
        />
      </Snackbar>
    </Container>
  );
};