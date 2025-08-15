import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import { 
  Container, 
  Paper, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton,
  Link,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { PersonAddOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  switch: {
    marginTop: theme.spacing(1),
  },
}));

const RegisterPage = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    isActive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Client-side validation
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords don't match");
    return;
  }

  try {
    // Prepare the EXACT data structure the API expects
    const registrationPayload = {
      FullName: formData.fullName,
      Username: formData.username,
      Email: formData.email,
      ContactNo: formData.contactNo,
      Password: formData.password,
      IsActive: formData.isActive
    };

    console.log('Sending registration data:', registrationPayload);

    const response = await axios.post(
      'http://localhost:5281/api/Auth/register', 
      registrationPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('Registration response:', response.data);

    if (response.data) {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    }
  } catch (err) {
    console.error('Full error details:', err);
    
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // Handle API validation errors
        if (err.response.data.errors) {
          const errorMessages = Object.entries(err.response.data.errors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('\n');
          setError(errorMessages);
        } else {
          setError(err.response.data.message || 'Registration failed');
        }
      } else {
        setError('Network error - could not connect to server');
      }
    } else {
      setError('An unexpected error occurred');
    }
  }
};
return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Contact Number"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            inputProps={{
              pattern: "[0-9]{10,15}",
              title: "Phone number must be 10-15 digits"
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
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
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleToggle}
                name="isActive"
                color="primary"
              />
            }
            label="Active Account"
            className={classes.switch}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link href="/login" variant="body2">
              Sign In
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;