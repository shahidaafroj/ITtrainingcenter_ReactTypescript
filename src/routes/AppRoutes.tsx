import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../Components/DashboardPage';
import { DayList, DayForm, DepartmentList, DepartmentForm, CourseList,  DesignationList, DesignationForm, EmployeeList,  InstructorList, InstructorForm, SlotForm, OfferList, OfferForm, CourseComboList, CourseComboForm,  ClassroomList, ClassroomForm, CourseForm, BatchList, BatchForm } from '../Components/pages';
import AdmissionForm from '../Components/pages/AdmissionForm';
import AdmissionList from '../Components/pages/AdmissionList';
import LandingPage from '../Components/pages/LandingPage';
import { SlotList } from '../Components/pages/SlotList';
import { VisitorList } from '../Components/pages/VisitorList';
import LoginPage from '../Components/pages/LoginPage';
import RegisterPage from '../Components/pages/RegisterPage';
import ProtectedRoute from '../Components/ProtectedRoute';
import MoneyReceiptForm from '../Components/pages/MoneyReceiptForm';
import MoneyReceiptList from '../Components/pages/MoneyReceiptList';
import AdmissionDetails from '../Components/pages/AdmissionDetails';
import DailySalesRecordForm from '../Components/pages/DailySalesRecordForm';
import DailySalesRecordList from '../Components/pages/DailySalesRecordList';
import RegistrationForm from '../Components/pages/RegistrationForm';
import RegistrationList from '../Components/pages/RegistrationList';
import RegistrationDetails from '../Components/pages/RegistrationDetails';
import { InstructorDetails } from '../Components/pages/InstructorDetails';
import { ClassroomDetails } from '../Components/pages/ClassRoomDetails';
import { CourseDetails } from '../Components/pages/CourseDetails';
import { ClassScheduleList } from '../Components/pages/ClassScheduleList';
import { ClassScheduleForm } from '../Components/pages/ClassScheduleFrom';
import { ClassScheduleDetails } from '../Components/pages/ClassScheduleDetails';
import { BatchDetails } from '../Components/pages/BatchDetails';
import { DailySalesDetails } from '../Components/pages/DailySalesDetails';
import { VisitorTransferList } from '../Components/pages/VisitorTransferList';
import { VisitorTransferForm } from '../Components/pages/VisitorTransferForm';
import { VisitorTransferDetails } from '../Components/pages/VisitorTransferDetails';
import { BatchTransferList } from '../Components/pages/BatchTransferList';
import { BatchTransferForm } from '../Components/pages/BatchTransferFrom';
import { BatchTransferDetails } from '../Components/pages/BatchTransferDetails';
import MoneyReceiptDetails from '../Components/pages/MoneyReceiptDetails';
import { DayDetails } from '../Components/pages/dayDetails';
import EmployeeForm from '../Components/pages/EmployeeForm';
import EmployeeDetails from '../Components/pages/EmployeeDetails';
import { AssessmentForm } from '../Components/pages/AssessmentFrom';
import { AssessmentList } from '../Components/pages/AssessmentList';
import { AssessmentDetails } from '../Components/pages/AssessmentDetails';
import { RecommendationList } from '../Components/pages/RecommendationList';
import { RecommendationDetails } from '../Components/pages/RecommendationDetails';
import InvoiceViewer from '../Components/pages/InvoiceViewer';
import InvoiceDetails from '../Components/pages/InvoiceDetails';
import TraineeViewer from '../Components/pages/TraineeViewer';
import TraineeDetails from '../Components/pages/TraineeDetails';
import VisitorForm from '../Components/pages/VisitorForm';
import VisitorDetails from '../Components/pages/VisitorDetails';
import { CertificateList } from '../Components/pages/CertificateList';
import { CertificateForm } from '../Components/pages/CertificateForm';
import { CertificateDetails } from '../Components/pages/CertificateDetails';
import { TraineeAttendanceList } from '../Components/pages/TraineeAttendanceList';
import { TraineeAttendanceForm } from '../Components/pages/TraineeAttendanceForm';
import { TraineeAttendanceDetails } from '../Components/pages/TraineeAttendanceDetails';
import EmployeeSalesReport from '../Components/pages/EmployeeSalesReport';
import ResetPasswordPage from '../Components/pages/ResetPasswordPage';
import ForgotPasswordPage from '../Components/pages/ForgotPasswordPage';
import { RecommendationForm } from '../Components/pages/RecommendationForm';
import { RecommendationEditForm } from '../Components/pages/RecommendationEditForm';
// import RecommendationForm from '../Components/pages/RecommendationForm';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
       <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        
        
        {/* Batch Management */}
            <Route path="/batches" element={<BatchList />} />
            <Route path="/batches/new" element={<BatchForm />} />
            <Route path="/batches/edit/:id" element={<BatchForm />} />
            <Route path="/batches/details/:id" element={<BatchDetails />} />
            


        {/* Day Management */}
        <Route path="/days" element={<DayList />} />
        <Route path="/days/new" element={<DayForm />} />
        <Route path="/days/edit/:id" element={<DayForm />} />
        <Route path="/days/details/:id" element={<DayDetails />} />

        {/* Batch Management */}

        {/* Department Management */}
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/departments/add" element={<DepartmentForm />} />
        <Route path="/departments/edit/:id" element={<DepartmentForm />} />

        {/* Course Management */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/new" element={<CourseForm />} />
        <Route path="/courses/edit/:id" element={<CourseForm />} />
        <Route path="/courses/details/:id" element={<CourseDetails />} />

     

        {/* Designation Management */}
        <Route path="/designations" element={<DesignationList />} />
        <Route path="/designations/add" element={<DesignationForm />} />
        <Route path="/designations/edit/:id" element={<DesignationForm />} />

        {/* Employee Management */}
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/add" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/employees/details/:id" element={<EmployeeDetails />} />

        {/* Instructor Management */}
        <Route path="/instructors" element={<InstructorList />} />
        <Route path="/instructors/new" element={<InstructorForm />} />
        <Route path="/instructors/edit/:id" element={<InstructorForm />} />
        <Route path="/instructors/details/:id" element={<InstructorDetails />} />


        {/* Slot Management */}
        <Route path="/slots" element={<SlotList />} />
        <Route path="/slots/add" element={<SlotForm />} />
        <Route path="/slots/edit/:id" element={<SlotForm />} />

        {/* Visitor Management */}
        <Route path="/visitors" element={<VisitorList />} />
        <Route path="/visitors/add" element={<VisitorForm />} />
        <Route path="/visitors/edit/:id" element={<VisitorForm />} />
        <Route path="/visitors/details/:id" element={<VisitorDetails />} />

        {/* Money Receipt Management */}

        {/* Assessment Management */}

        <Route path="/assessments" element={<AssessmentList />} />
        <Route path="/assessments/add" element={<AssessmentForm />} />
        <Route path="/assessments/edit/:id" element={<AssessmentForm />} />
        <Route path="/assessments/details/:id" element={<AssessmentDetails />} />

        {/* Invoice Management */}


          <Route path="/invoices" element={<InvoiceViewer />} />
        <Route path="/invoices/details/:id" element={<InvoiceDetails invoiceNo={''} creatingDate={''} invoiceCategory={''} moneyReceipts={[]} />} />

        {/* Trainee Management */}


        <Route path="/trainees" element={<TraineeViewer />} />
        <Route path="/trainees/details/:id" element={<TraineeDetails />} />



        {/* Recommendation Management */}

        <Route path="/recommendations" element={<RecommendationList />} />
        <Route path="/recommendations/create" element={<RecommendationForm />} />
        <Route path="/recommendations/details/:id" element={<RecommendationDetails />} />
         <Route path="/recommendations/edit/:id" element={<RecommendationEditForm />} />

        {/* Course Management */}

        {/* Offer Management */}
        <Route path="/offers" element={<OfferList />} />
        <Route path="/offers/add" element={<OfferForm />} />
        <Route path="/offers/edit/:id" element={<OfferForm />} />

        {/* Classroom Management */}
        <Route path="/classrooms" element={<ClassroomList />} />
        <Route path="/classrooms/new" element={<ClassroomForm />} />
        <Route path="/classrooms/edit/:id" element={<ClassroomForm />} />
        <Route path="/classrooms/details/:id" element={<ClassroomDetails />} />

        {/* ClassSchedule Management */}


        <Route path="/class-schedules" element={<ClassScheduleList />} />
        <Route path="/class-schedules/new" element={<ClassScheduleForm />} />
        <Route path="/class-schedules/edit/:id" element={<ClassScheduleForm />} />
        <Route path="/class-schedules/details/:id" element={<ClassScheduleDetails />} />




        {/* Course Combo Management */}
        <Route path="/course-combos" element={<CourseComboList />} />
        <Route path="/course-combos/add" element={<CourseComboForm />} />
        <Route path="/course-combos/edit/:id" element={<CourseComboForm />} />

         {/* Registration Management */}
        <Route path="/registrations" element={<RegistrationList />} />
        <Route path="/registrations/new" element={<RegistrationForm />} />
        <Route path="/registrations/edit/:id" element={<RegistrationForm />} />
        <Route path="/registrations/details/:id" element={<RegistrationDetails />} />


              <Route path="/daily-sales-records" element={<DailySalesRecordList />} />
        <Route path="/daily-sales-records/create" element={<DailySalesRecordForm visible={false} onCancel={function (): void {
          throw new Error('Function not implemented.');
        } } onSuccess={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/daily-sales-records/edit/:id" element={<DailySalesRecordForm visible={false} onCancel={function (): void {
          throw new Error('Function not implemented.');
        } } onSuccess={function (): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/daily-sales-records/:id" element={<DailySalesDetails />} />
        <Route path="/daily-sales-records/view/:id" element={<DailySalesRecordForm visible={false} onCancel={function (): void {
          throw new Error('Function not implemented.');
        } } onSuccess={function (): void {
          throw new Error('Function not implemented.');
        } }  />} />


      <Route path="/employee-sales-report" element={<EmployeeSalesReport />} />


    

      

       {/* Admission Management */}
        <Route path="/admissions" element={<AdmissionList />} />
        <Route path="/create-admission" element={<AdmissionForm />} />
        <Route path="/edit-admission/:id" element={<AdmissionForm />} />
        <Route path="/admission-details/:id" element={<AdmissionDetails />} />


       {/* Visitor Transfer Management */}

        <Route path="/visitor-transfers" element={<VisitorTransferList />} />
        <Route path="/create-visitor-transfer" element={<VisitorTransferForm />} />
        <Route path="/visitor-transfer-details/:id" element={<VisitorTransferDetails />} />


       {/* Visitor Transfer Management */}
        <Route path="/batch-transfers" element={<BatchTransferList />} />
        <Route path="/batch-transfers/new" element={<BatchTransferForm />} />
        <Route path="/batch-transfers/details/:id" element={<BatchTransferDetails />} />


       {/* Money Receipt Management */}
         <Route path="/money-receipts" element={<MoneyReceiptList />} />
         <Route path="/money-receipts/create" element={<MoneyReceiptForm />} />
         <Route path="/money-receipts/edit/:id" element={<MoneyReceiptForm />} />
         <Route path="/money-receipts/details/:id" element={<MoneyReceiptDetails />} />
      </Route>


       {/* Certificate Management */}
      <Route path="/certificates" element={<CertificateList />} />
      <Route path="/certificates/new" element={<CertificateForm />} />
      <Route path="/certificates/edit/:id" element={<CertificateForm />} />
      <Route path="/certificates/details/:id" element={<CertificateDetails />} />

      
      {/* Trainee Attendance Management */}
      <Route path="/attendances" element={<TraineeAttendanceList />} />
      <Route path="/attendances/new" element={<TraineeAttendanceForm />} />
      <Route path="/attendances/edit/:id" element={<TraineeAttendanceForm />} />
      <Route path="/attendances/details/:id" element={<TraineeAttendanceDetails />} />

      {/* 404 Page - Optional */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;