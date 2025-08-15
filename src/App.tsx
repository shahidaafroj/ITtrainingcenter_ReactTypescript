

// import React from 'react';
// import { CssBaseline, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { BatchForm,ClassRoomForm, ClassRoomList, CourseComboForm, CourseComboList, CourseForm, CourseList, DayForm, DayList, DepartmentForm, DepartmentList, DesignationForm, DesignationList, InstructorForm, InstructorList, OfferForm, OfferList, RegistrationForm, RegistrationList, SlotForm } from './Components/pages';
// import Navbar from './Components/Navbar'; 
// import LandingPage from './Components/pages/LandingPage'; 
// import DashboardPage from './Components/DashboardPage';
// import { SlotList } from './Components/pages/SlotList';
// import { VisitorList } from './Components/pages/VisitorList';
// import { VisitorForm } from './Components/pages/VisitorForm';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';
// import BatchList from './Components/pages/BatchList';
// import { EmployeeList } from './Components/pages/EmployeeList';
// import { EmployeeForm } from './Components/pages/EmployeeForm';
// import AdmissionForm from './Components/pages/AdmissionForm';
// import AdmissionList from './Components/pages/AdmissionList';
// import AdmissionDetails from './Components/pages/AdmissionDetails';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#333996",
//       light: '#3c44b126'
//     },
//     secondary: {
//       main: "#f83245",
//       light: '#f8324526'
//     },
//     background: {
//       default: "#f4f5fd"
//     },
//   },
//   overrides: {
//     MuiAppBar: {
//       root: {
//         transform: 'translateZ(0)'
//       }
//     }
//   },
//   props: {
//     MuiIconButton: {
//       disableRipple: true
//     }
//   }
// });

// const useStyles = makeStyles({
//   appMain: {
//     paddingLeft: '20px',
//     width: '100%'
//   }
// });

// function App() {
//   const classes = useStyles();

//   return (
//     <ThemeProvider theme={theme}>
//       <MuiPickersUtilsProvider utils={DateFnsUtils}>
//         <div className={classes.appMain}>
//           <Router>
//             <Navbar />
//             <Routes>
//               <Route path="/" element={<LandingPage />} />
              
//               <Route path="/dashboard" element={<DashboardPage />} />

                    



   
//                          {/* Batch Routes */}
//                       <Route path="/batches" element={<BatchList />} />
//                       <Route path="/add-batch" element={<BatchForm />} />
//                       <Route path="/update-batch/:id" element={<BatchForm />} />            
//                      {/* Day */}
//               <Route path="/days-list" element={<DayList />} />
//               <Route path="/add-day" element={<DayForm />} />
//               <Route path="/update-day/:id" element={<DayForm />} />

//               {/* Department */}
//               <Route path="/departments" element={<DepartmentList />} />
//               <Route path="/add-department" element={<DepartmentForm />} />
//               <Route path="/update-department/:id" element={<DepartmentForm />} />

//                      {/* Department */}
//               <Route path="/courses" element={<CourseList />} />
//               <Route path="/add-course" element={<CourseForm />} />
//               <Route path="/update-course/:id" element={<CourseForm />} />

//               {/* Designation */}
//               <Route path="/designations" element={<DesignationList />} />
//               <Route path="/add-designation" element={<DesignationForm />} />
//               <Route path="/update-designation/:id" element={<DesignationForm />} />


//               {/* Employee */}
//             <Route path="/employees" element={<EmployeeList />} />
//             <Route path="/add-employee" element={<EmployeeForm />} />
//             <Route path="/update-employee/:id" element={<EmployeeForm />} />


//                {/* Instructor */}
//                         <Route path="/instructors" element={<InstructorList />} />
//                         <Route path="/add-instructor" element={<InstructorForm />} />
//                         <Route path="/update-instructor/:id" element={<InstructorForm />} />
          
//               {/* Slot */}
//               <Route path="/slots" element={<SlotList />} />
//               <Route path="/add-slot" element={<SlotForm />} />
//               <Route path="/update-slot/:id" element={<SlotForm />} />
          
//               {/* Visitor */}
//               <Route path="/visitors" element={<VisitorList />} />
//               <Route path="/add-visitor" element={<VisitorForm />} />
//               <Route path="/update-visitor/:id" element={<VisitorForm />} />

//                              {/* Offer */}
//               <Route path="/offers" element={<OfferList />} />
//              <Route path="/add-offer" element={<OfferForm />} />
//              <Route path="/update-offer/:id" element={<OfferForm />} />
                
//                               {/* Add these new routes */}
//                             <Route path="/classrooms" element={<ClassRoomList/>}/>
//                             <Route path="/add-classroom" element={<ClassRoomForm/>}/>
//                             <Route path="/update-classroom/:id" element={<ClassRoomForm/>}/>
              
//                                    {/*Registration*/}
//                             <Route path="/registrations" element={<RegistrationList />} />
//                           <Route path="/add-registration" element={<RegistrationForm onSuccess={() => {}} onCancel={() => {}} />} />
//                           <Route path="/update-registration/:id" element={<RegistrationForm onSuccess={() => {}} onCancel={() => {}} />} />


//                                   {/* CourseCombo */}
//                             <Route path="/course-combos" element={<CourseComboList/>}/>
//                             <Route path="/add-course-combo" element={<CourseComboForm/>}/>
//                             <Route path="/update-course-combo/:id" element={<CourseComboForm/>}/>
//                                {/* Admission */}
                               
//                             <Route path="/admissions" element={<AdmissionList />} />
//         <Route path="/create-admission" element={<AdmissionForm />} />
//         <Route path="/edit-admission/:id" element={<AdmissionForm />} />
//         <Route path="/admission-details/:id" element={<AdmissionDetails />} />

//                            {/* <Route path="/" element={<AdmissionList />} /> */}
                                 
//             </Routes>
//           </Router>
//         </div>
//         <CssBaseline />
//       </MuiPickersUtilsProvider>
//     </ThemeProvider>
//   );
// }

// export default App;







import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Navbar from './Components/Navbar';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f4f5fd"
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
});

const useStyles = makeStyles({
  appMain: {
    paddingLeft: '20px',
    width: '100%'
  }
});

function App() {
  const classes = useStyles();

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <AuthProvider>
            <div className={classes.appMain}>
              <Navbar />
              <AppRoutes />
            </div>
            <CssBaseline />
          </AuthProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;