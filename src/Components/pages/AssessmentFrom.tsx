// components/AssessmentForm.tsx
import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox,
  FormControlLabel, Grid, Box, Paper, Typography
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IAssessmentDetail, IAssessmentCreate, IAssessmentDetailsDTO } from '../../interfaces/IAssessment';
import { BatchService } from '../../utilities/services/batchService';
import { AssessmentService } from '../../utilities/services/assessmentService';
import { AxiosError } from 'axios';


export const AssessmentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IAssessmentDetailsDTO>({
    traineeId: 0,
    batchId: 0,
    instructorId: 0,
    assessmentDate: '',
    assessmentType: '',
    theoreticalScore: 0,
    practicalScore: 0,
    daysPresent: 0,
    totalDays: 0,
    participationLevel: '',
    technicalSkillsRating: '',
    communicationSkillsRating: '',
    teamworkRating: '',
    disciplineRemarks: '',
    punctuality: '',
    attitudeRating: '',
    strengths: '',
    weaknesses: '',
    improvementAreas: '',
    trainerRemarks: '',
    isFinalized: false,
  });

  const [batches, setBatches] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  const assessmentTypeOptions = ['Weekly Test', 'Final Evaluation', 'Behavioral'];
  const participationOptions = ['Low', 'Medium', 'High'];
  const skillRatingOptions = ['Poor', 'Average', 'Good', 'Excellent'];
  const punctualityOptions = ['AlwaysOnTime', 'UsuallyOnTime', 'OccasionallyLate', 'FrequentlyLate', 'RarelyOnTime'];

  useEffect(() => {
    BatchService.getAll().then(setBatches);
    if (id) {
      AssessmentService.getById(+id).then(data => {
        setFormData(data);
        if (data.batchId) {
          handleBatchChange(data.batchId,data.traineeId);
        }
      });
    }
  }, [id]);


const handleBatchChange = async (batchId: number, currentTraineeId?: number) => {
  try {
    setFormData(prev => ({
      ...prev,
      batchId,
      instructorId: 0,
      traineeId: currentTraineeId || 0
    }));

    const response = await AssessmentService.getInsTraiByBatch(batchId);
    console.log("Raw API response:", response); // API থেকে আসা সম্পূর্ণ রেস্পন্স
    console.log("Raw trainee data:", response.trainees); // শুধু ট্রেইনি ডাটা
    const assessedIds = await AssessmentService.getAssessedTrainees(batchId);

    const traineesData = response.trainees
      // keep current trainee even if assessed
      .filter((t: any) => !assessedIds.includes(t.traineeId) || t.traineeId === currentTraineeId)
      .map((t: any) => ({
        traineeId: t.traineeId,
        traineeIdNo: t.traineeIDNo, 
        registration: { traineeName: t.traineeName }
      }));
   

    const instructorsData = response.instructor ? [{
      instructorId: response.instructor.instructorId,
      employee: { employeeName: response.instructor.instructorName }
    }] : [];

    setInstructors(instructorsData);
    setTrainees(traineesData);

    if (response.instructor) {
      setFormData(prev => ({
        ...prev,
        instructorId: response.instructor.instructorId
      }));
    }

    if (traineesData.length === 0) {
      alert("All trainees in this batch have already been assessed.");
    }

  } catch (error) {
    console.error("Error loading batch details:", error);
    alert("Failed to load batch information");
  }
};




  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'number' ? +newValue : newValue };
      const daysPresent = name === 'daysPresent' ? +newValue : prev.daysPresent;
      const totalDays = name === 'totalDays' ? +newValue : prev.totalDays;
      updated.attendancePercentage = totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 0;
      const theoretical = name === 'theoreticalScore' ? +newValue : prev.theoreticalScore;
      const practical = name === 'practicalScore' ? +newValue : prev.practicalScore;
      updated.overallScore = Math.round((theoretical + practical) / 2);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: IAssessmentCreate = {
      assessmentDate: formData.assessmentDate,
      batchId: formData.batchId,
      instructorId: formData.instructorId,
      assessments: [{
        traineeId: formData.traineeId,
        assessmentType: formData.assessmentType,
        theoreticalScore: formData.theoreticalScore,
        practicalScore: formData.practicalScore,
        daysPresent: formData.daysPresent,
        totalDays: formData.totalDays,
        participationLevel: formData.participationLevel,
        technicalSkillsRating: formData.technicalSkillsRating,
        communicationSkillsRating: formData.communicationSkillsRating,
        teamworkRating: formData.teamworkRating,
        disciplineRemarks: formData.disciplineRemarks,
        punctuality: formData.punctuality,
        attitudeRating: formData.attitudeRating,
        strengths: formData.strengths,
        weaknesses: formData.weaknesses,
        improvementAreas: formData.improvementAreas,
        trainerRemarks: formData.trainerRemarks,
        isFinalized: formData.isFinalized
      }]
    };
    try {
      if (id) {
        await AssessmentService.update(+id, payload);
      } else {
        await AssessmentService.create(payload);
      }
      navigate('/assessments');
    } catch (error: unknown) {
      let errorMessage = 'Submission failed';
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  };

  

  return (
    <Paper style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit' : 'Add'} Assessment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Batch */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Batch</InputLabel>
              <Select
                name="batchId"
                value={formData.batchId}
                onChange={(e) => handleBatchChange(Number(e.target.value))}
              >
                {batches.map(b => (
                  <MenuItem key={b.batchId} value={b.batchId}>{b.batchName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Trainee */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trainee</InputLabel>
              <Select
                name="traineeId"
                value={formData.traineeId}
                onChange={handleChange}
              >
                {trainees.map(t => (
                  <MenuItem key={t.traineeId} value={t.traineeId}>
                         {t.registration?.traineeName} ({t.traineeIdNo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Instructor */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Instructor</InputLabel>
              <Select
                name="instructorId"
                value={formData.instructorId}
                onChange={handleChange}
              >
                {instructors.map(i => (
                  <MenuItem key={i.instructorId} value={i.instructorId}>
                    {i.employee?.employeeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="assessmentDate"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.assessmentDate}
              onChange={handleChange}
            />
          </Grid>
          {/* Assessment Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assessment Type</InputLabel>
              <Select
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleChange}
              >
                {assessmentTypeOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Scores */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="theoreticalScore"
              label="Theoretical Score"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              fullWidth
              value={formData.theoreticalScore}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="practicalScore"
              label="Practical Score"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              fullWidth
              value={formData.practicalScore}
              onChange={handleChange}
            />
          </Grid>
          {/* Attendance */}
          <Grid item xs={6} sm={3}>
            <TextField
              name="daysPresent"
              label="Days Present"
              type="number"
              fullWidth
              value={formData.daysPresent}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              name="totalDays"
              label="Total Days"
              type="number"
              fullWidth
              value={formData.totalDays}
              onChange={handleChange}
            />
          </Grid>
          {/* Participation */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Participation Level</InputLabel>
              <Select
                name="participationLevel"
                value={formData.participationLevel}
                onChange={handleChange}
              >
                {participationOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Skills */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Technical Skills</InputLabel>
              <Select
                name="technicalSkillsRating"
                value={formData.technicalSkillsRating}
                onChange={handleChange}
              >
                {skillRatingOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Communication Skills</InputLabel>
              <Select
                name="communicationSkillsRating"
                value={formData.communicationSkillsRating}
                onChange={handleChange}
              >
                {skillRatingOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Teamwork</InputLabel>
              <Select
                name="teamworkRating"
                value={formData.teamworkRating}
                onChange={handleChange}
              >
                {skillRatingOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              name="disciplineRemarks"
              label="Discipline Remarks"
              fullWidth
              multiline
              rows={2}
              value={formData.disciplineRemarks}
              onChange={handleChange}
            />
          </Grid>
          {/* Punctuality */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Punctuality</InputLabel>
              <Select
                name="punctuality"
                value={formData.punctuality}
                onChange={handleChange}
              >
                {punctualityOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option.replace(/([A-Z])/g, ' $1').trim()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Attitude */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Attitude</InputLabel>
              <Select
                name="attitudeRating"
                value={formData.attitudeRating}
                onChange={handleChange}
              >
                {skillRatingOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Strengths */}
          <Grid item xs={12}>
            <TextField
              name="strengths"
              label="Strengths"
              fullWidth
              multiline
              rows={2}
              value={formData.strengths}
              onChange={handleChange}
            />
          </Grid>
          {/* Weaknesses */}
          <Grid item xs={12}>
            <TextField
              name="weaknesses"
              label="Weaknesses"
              fullWidth
              multiline
              rows={2}
              value={formData.weaknesses}
              onChange={handleChange}
            />
          </Grid>
          {/* Improvements */}
          <Grid item xs={12}>
            <TextField
              name="improvementAreas"
              label="Improvement Areas"
              fullWidth
              multiline
              rows={2}
              value={formData.improvementAreas}
              onChange={handleChange}
            />
          </Grid>
          {/* Trainer Remarks */}
          <Grid item xs={12}>
            <TextField
              name="trainerRemarks"
              label="Trainer Remarks"
              fullWidth
              multiline
              rows={2}
              value={formData.trainerRemarks}
              onChange={handleChange}
            />
          </Grid>
          {/* Finalized */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isFinalized}
                  onChange={handleChange}
                  name="isFinalized"
                />
              }
              label="IsFinalized?"
            />
          </Grid>
          {/* Submit */}
          <Grid item xs={12}>
            <Box mt={2} display="flex" justifyContent="flex-end">
               <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
               <br />    

                 <Button                 
                variant="contained" color="primary"
                onClick={() => navigate('/assessments')}
              >
                ← Back to List
              </Button>
            
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
