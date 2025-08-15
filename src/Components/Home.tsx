// import "./Home.style.css"; 

// const Home = () => {
//     return (
//         <>
//             <article>
//                 <header>
//                     <h1>React: Simple CRUD Application</h1>
//                 </header>
//             </article>
//         </>
//     )
// };

// export default Home;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  TextField, 
  IconButton, 
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import { 
  LockOutlined, 
  PersonAddOutlined, 
  Visibility, 
  VisibilityOff 
} from '@material-ui/icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import "./Home.style.css";

const useStyles = makeStyles((theme) => ({
  authPaper: {
    padding: theme.spacing(4),
    width: 400,
    maxWidth: '90%',
    textAlign: 'center',
    margin: '2rem auto',
  },
  avatar: {
    margin: 'auto',
    backgroundColor: '#0ab9f2',
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  switchForm: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
}));

const Home = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<'login' | 'register' | null>(null);
  const [authData, setAuthData] = useState({
    name: '',
    username: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(authData.username, authData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login failed:', err);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (authData.password !== authData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!authData.contactNo.match(/^[0-9]{10,15}$/)) {
      setError("Please enter a valid contact number");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5281/api/Auth/register', {
        name: authData.name,
        username: authData.username,
        email: authData.email,
        contactNo: authData.contactNo,
        password: authData.password
      });

      if (response.data.success) {
        await login(authData.username, authData.password);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Container maxWidth="md" className="home-container">
      {authType === null ? (
        <header>
          <Typography variant="h2" gutterBottom>
            Welcome to IT Training Center
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Get started with our training programs
          </Typography>
          
          <div className="auth-buttons">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setAuthType('login')}
              style={{ marginRight: '1rem' }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => setAuthType('register')}
            >
              Register
            </Button>
          </div>
        </header>
      ) : authType === 'login' ? (
        <Paper className={classes.authPaper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleLoginSubmit}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.username}
              onChange={handleAuthChange}
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.password}
              onChange={handleAuthChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submitButton}
            >
              Sign In
            </Button>
            <div className={classes.switchForm}>
              <Button color="primary" onClick={() => setAuthType('register')}>
                Don't have an account? Sign Up
              </Button>
            </div>
          </form>
        </Paper>
      ) : (
        <Paper className={classes.authPaper}>
          <Avatar className={classes.avatar}>
            <PersonAddOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              name="full Name"
              label="Full Name"
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.name}
              onChange={handleAuthChange}
            />
            <TextField
              name="username"
              label="Username"
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.username}
              onChange={handleAuthChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.email}
              onChange={handleAuthChange}
            />
            <TextField
              name="contactNo"
              label="Contact Number"
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.contactNo}
              onChange={handleAuthChange}
              inputProps={{
                pattern: "[0-9]{10,15}",
                title: "Please enter a valid phone number (10-15 digits)"
              }}
            />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.password}
              onChange={handleAuthChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              required
              variant="outlined"
              className={classes.formField}
              value={authData.confirmPassword}
              onChange={handleAuthChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submitButton}
            >
              Register
            </Button>
            <div className={classes.switchForm}>
              <Button color="primary" onClick={() => setAuthType('login')}>
                Already have an account? Sign In
              </Button>
            </div>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default Home;