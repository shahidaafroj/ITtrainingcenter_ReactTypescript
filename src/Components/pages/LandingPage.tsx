import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper,
  Link as MuiLink,
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  CssBaseline,
  makeStyles
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  appBar: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#0ab9f2', // Your requested color
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(8),
  },
  hero: {
    background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
    color: 'white',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(8, 2),
    marginBottom: theme.spacing(6),
    boxShadow: theme.shadows[4],
  },
  featureCard: {
    padding: theme.spacing(4),
    height: '100%',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[6],
    },
  },
  featureNumber: {
    fontSize: 36,
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  ctaButton: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2, 4),
    fontSize: '1.1rem',
  },
  featureTitle: {
    position: 'relative',
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 50,
      height: 3,
      background: theme.palette.primary.main,
    }
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0),
    marginTop: theme.spacing(4),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  footerLinks: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
  socialIcon: {
    marginRight: theme.spacing(2),
    fontSize: 24,
    color: theme.palette.text.secondary,
    transition: 'color 0.3s',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  navButton: {
    color: 'white !important',
    margin: theme.spacing(0, 1),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  title: {
    flexGrow: 1,
    color: 'white !important',
    fontWeight: 600,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          IT Training Center
        </Typography>
        <Box>
          <Button 
            component={Link} 
            to="/" 
            className={classes.navButton}
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/dashboard" 
            className={classes.navButton}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/login" 
            className={classes.navButton}
          >
            Login
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            className={classes.navButton}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box component="footer" className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Tech Academy
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Empowering the next generation of tech professionals through quality education.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="textPrimary" gutterBottom>
              Quick Links
            </Typography>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              Courses
            </MuiLink>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              Instructors
            </MuiLink>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              Success Stories
            </MuiLink>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="textPrimary" gutterBottom>
              Support
            </Typography>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              FAQ
            </MuiLink>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              Contact Us
            </MuiLink>
            <MuiLink href="#" variant="subtitle2" display="block" className={classes.footerLinks}>
              Privacy Policy
            </MuiLink>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="textPrimary" gutterBottom>
              Connect With Us
            </Typography>
            <Box display="flex">
              <MuiLink href="#" className={classes.socialIcon}>
                <span className="material-icons">facebook</span>
              </MuiLink>
              <MuiLink href="#" className={classes.socialIcon}>
                <span className="material-icons">twitter</span>
              </MuiLink>
              <MuiLink href="#" className={classes.socialIcon}>
                <span className="material-icons">linkedin</span>
              </MuiLink>
              <MuiLink href="#" className={classes.socialIcon}>
                <span className="material-icons">youtube</span>
              </MuiLink>
            </Box>
            <Typography variant="subtitle2" color="textSecondary" style={{marginTop: 16}}>
              Email: info@techacademy.com
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Phone: +880 1234 567890
            </Typography>
          </Grid>
        </Grid>
        
        <Divider style={{ margin: '24px 0' }} />
        
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Tech Academy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

const LandingPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Modern Technologies',
      description: 'Learn the latest programming languages and frameworks from industry experts.',
    },
    {
      title: 'Expert Instructors',
      description: 'Our certified trainers have years of practical experience to share.',
    },
    {
      title: 'Interactive Learning',
      description: 'Hands-on projects and collaborative environment for effective learning.',
    },
    {
      title: 'Career Growth',
      description: 'Courses designed to boost your career with practical, job-ready skills.',
    },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar />
      
      <main className={classes.content}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box className={classes.hero} textAlign="center" style={{ marginTop: theme.spacing(4) }}>
            <Typography 
              variant={isMobile ? 'h4' : 'h2'} 
              gutterBottom 
              style={{ fontWeight: 700 }}
            >
              Advance Your Tech Career
            </Typography>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'} 
              style={{ opacity: 0.9, maxWidth: 800, margin: '0 auto' }}
            >
              Professional IT training programs to equip you with in-demand skills for the digital economy.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              className={classes.ctaButton}
            >
              Explore Courses
            </Button>
          </Box>

          {/* Features Section */}
          <Box mb={8}>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom 
              style={{ fontWeight: 600 }}
            >
              Why Choose Our Training Center?
            </Typography>
            <Typography 
              variant="subtitle1" 
              align="center" 
              color="textSecondary" 
              gutterBottom
              style={{ maxWidth: 700, margin: '0 auto 40px' }}
            >
              We provide comprehensive IT education with a practical approach to ensure you're job-ready.
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper className={classes.featureCard} elevation={3}>
                    <Box textAlign="center">
                      <Typography className={classes.featureNumber}>
                        {index + 1}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        className={classes.featureTitle}
                        style={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Call to Action */}
          <Box textAlign="center" mb={10}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>
              Ready to Transform Your Career?
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom style={{ marginBottom: 30 }}>
              Join thousands of successful graduates who have accelerated their careers with our programs.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              style={{ padding: '12px 40px' }}
            >
              Register Now
            </Button>
          </Box>
        </Container>
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;