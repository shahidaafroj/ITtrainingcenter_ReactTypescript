import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { AssessmentService } from '../../utilities/services/assessmentService';

export const AssessmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<any>(null);
   const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      AssessmentService.getById(+id).then(setAssessment);
    }
  }, [id]);

  if (!assessment) return <div>Loading...</div>;

  return (
    <Paper style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>Assessment Details</Typography>
          <button 
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/assessments')}
      >
        ← Back to List
      </button>
      <Grid container spacing={2}>
        <Grid item xs={6}><strong>Batch:</strong> {assessment.batchName}</Grid>
        <Grid item xs={6}><strong>Trainee:</strong> {assessment.traineeName}-{assessment.traineeIDNo}</Grid>
        <Grid item xs={6}><strong>Instructor:</strong> {assessment.instructorName}</Grid>
        <Grid item xs={6}><strong>Date:</strong> {assessment.assessmentDate}</Grid>
        <Grid item xs={6}><strong>Type:</strong> {assessment.assessmentType}</Grid>
        <Grid item xs={6}><strong>Theoretical:</strong> {assessment.theoreticalScore}</Grid>
        <Grid item xs={6}><strong>Practical:</strong> {assessment.practicalScore}</Grid>
        <Grid item xs={6}><strong>Attendance:</strong> {assessment.daysPresent}/{assessment.totalDays}</Grid>
        <Grid item xs={6}><strong>Participation:</strong> {assessment.participationLevel}</Grid>
        <Grid item xs={6}><strong>Technical Skills:</strong> {assessment.technicalSkillsRating}</Grid>
        <Grid item xs={6}><strong>Communication:</strong> {assessment.communicationSkillsRating}</Grid>
        <Grid item xs={6}><strong>Teamwork:</strong> {assessment.teamworkRating}</Grid>
        <Grid item xs={12}><strong>Discipline:</strong> {assessment.disciplineRemarks}</Grid>
        <Grid item xs={6}><strong>Punctuality:</strong> {assessment.punctuality}</Grid>
        <Grid item xs={6}><strong>Attitude:</strong> {assessment.attitudeRating}</Grid>
        <Grid item xs={12}><strong>Strengths:</strong> {assessment.strengths}</Grid>
        <Grid item xs={12}><strong>Weaknesses:</strong> {assessment.weaknesses}</Grid>
        <Grid item xs={12}><strong>Improvement Areas:</strong> {assessment.improvementAreas}</Grid>
        <Grid item xs={12}><strong>Trainer Remarks:</strong> {assessment.trainerRemarks}</Grid>
        <Grid item xs={12}><strong>Finalized:</strong> {assessment.isFinalized ? 'Yes' : 'No'}</Grid>
      </Grid>
    </Paper>
  );
};