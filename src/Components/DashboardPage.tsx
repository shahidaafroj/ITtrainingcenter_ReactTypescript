import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Box,
  useMediaQuery 
} from '@material-ui/core';
import { 
  Business as DepartmentsIcon,
  Work as DesignationIcon,
  People as EmployeesIcon,
  School as CoursesIcon,
  Schedule as SlotsIcon,
  CalendarToday as DaysIcon,
  Class as ClassroomIcon,
  Group as InstructorsIcon,
  HowToReg as RegistrationsIcon,
  LocalOffer as OffersIcon,
  AccountTree as BatchesIcon,
  MeetingRoom as VisitorsIcon,
  Star as CombosIcon,
  AssignmentTurnedIn as AdmissionIcon,
  Receipt as MoneyReceiptIcon,
    MonetizationOn as DailySalesIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  header: {
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  card: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
    minHeight: 180,
  },
  cardTitle: {
    margin: theme.spacing(1, 0),
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  cardDescription: {
    fontSize: '0.875rem',
    marginBottom: theme.spacing(2),
  },
  cardButton: {
    marginTop: 'auto',
    padding: theme.spacing(1, 2),
    fontWeight: 500,
    borderRadius: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  quickActionButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

const DashboardPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dashboardItems = [
    {
      title: 'Admissions',
      description: 'Manage student admissions and enrollments',
      path: '/admissions',
      color: '#4a148c', // Purple color
      icon: <AdmissionIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Batches',
      description: 'Manage and view all batch information',
      path: '/batches',
      color: '#ff5722',
      icon: <BatchesIcon fontSize="large" style={{ color: 'white' }} />,
    },

      {
      title: 'Assessments',
      description: 'Manage and view all assessment information',
      path: '/assessments',
      color: '#ff5722',
      icon: <BatchesIcon fontSize="large" style={{ color: 'white' }} />,
    },

     {
      title: 'recommendations',
      description: 'Manage and view all recommendation information',
      path: '/recommendations',
      color: '#ff5722',
      icon: <BatchesIcon fontSize="large" style={{ color: 'white' }} />,
    },

      {
      title: 'Batche Transfer',
      description: 'Manage and view all batch transfer information',
      path: '/batch-transfers',
      color: '#ff5722',
      icon: <BatchesIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Courses',
      description: 'Handle all course related operations',
      path: '/courses',
      color: '#4caf50',
      icon: <CoursesIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Course Combos',
      description: 'Manage bundled course packages and discounts',
      path: '/course-combos',
      color: '#ffc107',
      icon: <CombosIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Classroom',
      description: 'View and manage Classroom ',
      path: '/classrooms',
      color: '#78f20c',
      icon: <ClassroomIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Class Schedules',
      description: 'View and manage Class schedules',
      path: '/class-schedules',
      color: '#78f20c',
      icon: <SlotsIcon fontSize="large" style={{ color: 'white' }} />,
    },

    {
      title: 'Days',
      description: 'Manage and view all days information',
      path: '/days-list',
      color: '#3f51b5',
      icon: <DaysIcon fontSize="large" style={{ color: 'white' }} />,
    },

     {
      title: 'Visitor Transfer',
      description: 'Manage and view all Visitor Transfer information',
      path: '/visitor-transfers',
      color: '#3f51b5',
      icon: <VisitorsIcon fontSize="large" style={{ color: 'white' }} />,
    },


    {
      title: 'Departments',
      description: 'View and manage department details',
      path: '/departments',
      color: '#2196f3',
      icon: <DepartmentsIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Designations',
      description: 'Handle all designation related operations',
      path: '/designations',
      color: '#4caf50',
      icon: <DesignationIcon fontSize="large" style={{ color: 'white' }} />,
    },

     {
      title: 'Daily Sales Records',
      description: 'Track and manage daily sales transactions',
      path: '/daily-sales-records',
      color: '#8bc34a', // Light green color for sales
      icon: <DailySalesIcon fontSize="large" style={{ color: 'white' }} />,
    },


     {
      title: 'Daily Sales Reports',
      description: 'Track and manage daily sales reports',
      path: '/employee-sales-report',
      color: '#8bc34a', // Light green color for sales
      icon: <DailySalesIcon fontSize="large" style={{ color: 'white' }} />,
    },


    {
      title: 'Employees',
      description: 'Manage employee records and information',
      path: '/employees',
      color: '#00bcd4',
      icon: <EmployeesIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Offers',
      description: 'Explore special offers and discounts',
      path: '/offers',
      color: '#0c1bf2',
      icon: <OffersIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Instructors',
      description: 'Manage instructor assignments',
      path: '/instructors',
      color: '#f44336',
      icon: <InstructorsIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Money Receipts',
      description: 'Create and manage payment receipts',
      path: '/money-receipts',
      color: '#00c853', // Green color for financial items
      icon: <MoneyReceiptIcon fontSize="large" style={{ color: 'white' }} />,
    },

     {
      title: 'Invoice',
      description: 'Show Invoice Details',
      path: '/invoices',
      color: '#00c853', // Green color for financial items
      icon: <MoneyReceiptIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Registrations',
      description: 'Manage trainee registrations',
      path: '/registrations',
      color: '#673ab7',
      icon: <RegistrationsIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Slots',
      description: 'Manage time slots and scheduling',
      path: '/slots',
      color: '#ff9800',
      icon: <SlotsIcon fontSize="large" style={{ color: 'white' }} />,
    },
    {
      title: 'Visitors',
      description: 'Track and manage visitor information',
      path: '/visitors',
      color: '#9c27b0',
      icon: <VisitorsIcon fontSize="large" style={{ color: 'white' }} />,
    },
     {
      title: 'Trainee details',
      description: 'Show trainee details',
      path: '/trainees',
      color: '#9c27b0',
      icon: <VisitorsIcon fontSize="large" style={{ color: 'white' }} />,
    },
     {
      title: 'Issue Certificate',
      description: 'Manage and issue certificates to trainees',
      path: '/certificates',
      color: '#9c27b0',
      icon: <VisitorsIcon fontSize="large" style={{ color: 'white' }} />,
    },
      {
      title: 'Trainee Attendance',
      description: 'Manage and track trainee attendance',
      path: '/attendances',
      color: '#9c27b0',
      icon: <VisitorsIcon fontSize="large" style={{ color: 'white' }} />,
    },
  ];

  const quickActions = [
    { label: 'Add Admission', path: '/admissions/new', color: 'primary' },
    { label: 'Add Batch', path: '/batches/new', color: 'secondary' },
    { label: 'Add Course', path: '/courses/new', color: 'primary' },
    { label: 'Add Employee', path: '/employees/new', color: 'secondary' },
    { label: 'Add Registration', path: '/registrations/new', color: 'primary' },
    { label: 'Create Receipt', path: '/money-receipts/create', color: 'primary' },
      { label: 'Add Daily Sales', path: '/daily-sales-records/new', color: 'secondary' }, 
  ];

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" className={classes.header} gutterBottom>
        Training Center Dashboard
      </Typography>
      
      {/* Dashboard Cards */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper 
              className={classes.card} 
              elevation={3}
              style={{ 
                borderTop: `4px solid ${item.color}`,
                background: theme.palette.background.paper
              }}
            >
              <Box 
                className={classes.iconContainer}
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </Box>
              
              <Typography variant="h6" className={classes.cardTitle}>
                {item.title}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" className={classes.cardDescription}>
                {item.description}
              </Typography>
              
              <Button
                variant="contained"
                style={{ 
                  backgroundColor: item.color,
                  color: 'white'
                }}
                component={Link}
                to={item.path}
                className={classes.cardButton}
                fullWidth
              >
                View {item.title}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;


