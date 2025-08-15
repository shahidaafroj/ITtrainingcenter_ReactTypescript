import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Avatar, 
  Typography, 
  TextField, 
  Button,
  InputAdornment,
  IconButton,
  Box
} from '@material-ui/core';
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  success: {
    color: theme.palette.success.main,
    marginTop: theme.spacing(1),
  }
}));

const ForgotPasswordPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = email step, 2 = password reset step
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, you would verify the email exists
      // For this demo, we'll just proceed to step 2
      setStep(2);
    } catch (err) {
      setError('Failed to proceed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Here you would call your API to reset the password
      // For demo, we'll just show a success message
      setSuccess('Password has been reset successfully!');
      
      // In a real app:
      // await axios.post('/api/auth/reset-password', { 
      //   email, 
      //   newPassword 
      // });
      
      // Redirect after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          {step === 1 ? <EmailOutlined /> : <LockOutlined />}
        </Avatar>
        <Typography component="h1" variant="h5">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </Typography>
        
        {error && (
          <Typography className={classes.error} variant="body2">
            {error}
          </Typography>
        )}
        
        {success && (
          <Typography className={classes.success} variant="body2">
            {success}
          </Typography>
        )}

        {step === 1 ? (
          <form className={classes.form} onSubmit={handleEmailSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Button onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            </Box>
          </form>
        ) : (
          <form className={classes.form} onSubmit={handlePasswordReset}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Button onClick={() => setStep(1)}>
                Back
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;