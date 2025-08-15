import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { ICertificate, ITraineeDropdown, ITraineeInfo } from '../../interfaces/ICertificate';
import { CertificateService } from '../../utilities/services/certificateService';

export const CertificateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState<ICertificate>({
    traineeId: 0,
    registrationId: 0,
    batchId: 0,
    courseId: 0,
    issueDate: new Date().toISOString(),
    recommendationId: 0
  });

  
  useEffect(() => {
    // Replace getTraineeDropdown with getAvailableTrainees
    CertificateService.getAvailableTrainees().then(res => {
      setTrainees(res.data);
    });

    if (id) {
      CertificateService.getById(+id).then(res => setFormData(res.data));
    }
  }, [id]);

    const [trainees, setTrainees] = useState<ITraineeDropdown[]>([]);
const [traineeInfo, setTraineeInfo] = useState<ITraineeInfo | null>(null);
const [message, setMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

const handleTraineeChange = async (e: any) => {
  const traineeId = e.target.value as number;

  try {
    const res = await CertificateService.getTraineeInfo(traineeId);
    const info = res.data;
    setTraineeInfo(info);

    setFormData(prev => ({
      ...prev,
      traineeId: info.traineeId,
      registrationId: info.registrationId,
      batchId: info.batchId,
      courseId: info.courseId,
      recommendationId: info.recommendationId
    }));
  } catch (error) {
    console.error("Error loading trainee info:", error);
  }
};



  useEffect(() => {
    CertificateService.getTraineeDropdown().then(res => {
      setTrainees(res.data);
    });

    if (id) {
      CertificateService.getById(+id).then(res => setFormData(res.data));
    }
  }, [id]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (id) {
//       await CertificateService.update(+id, formData);
//     } else {
//       await CertificateService.create(formData);
//     }
//     navigate('/certificates');
//   };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);
  setError(null);

  try {
    if (id) {
      await CertificateService.update(+id, formData);
      setMessage('Certificate updated successfully!');
    } else {
      await CertificateService.create(formData);
      setMessage('Certificate created successfully!');
    }
    // Optionally, navigate after showing message
    setTimeout(() => {
      navigate('/certificates');
    }, 1500); // wait 1.5 seconds before navigating
  } catch (err) {
    setError('An error occurred while saving the certificate.');
  }
};

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">{id ? 'Edit' : 'Create'} Certificate</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
            <TextField
                label="Issue Date"
                value={formData.issueDate ? new Date(formData.issueDate).toLocaleDateString() : ''}
                fullWidth
                InputProps={{ readOnly: true }}
            />
            </Grid>
            {/* Trainee Dropdown */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Select Trainee</InputLabel>
                <Select
                    name="traineeId"
                    value={formData.traineeId}
                    onChange={handleTraineeChange}
                    >
                    <MenuItem value={0}>-- Select Trainee --</MenuItem>
                 {trainees.map((trainee) => (
                <MenuItem key={trainee.traineeId} value={trainee.traineeId}>
                    {trainee.traineeIDNo} - {trainee.traineeName}
                </MenuItem>
                ))}

                    </Select>

              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                    label="Registration No"
                    value={traineeInfo?.registrationNo || ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <TextField
                    label="Batch Name"
                    value={traineeInfo?.batchName || ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <TextField
                    label="Course Name"
                    value={traineeInfo?.courseName || ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <TextField
                    label="Recommendation Status"
                    value={traineeInfo?.recommendationStatus || 'Recommendation Incomplete'}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    />
                </Grid>
            <Grid item xs={12}>
             <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formData.traineeId === 0}
                >
                Save
                </Button>
            </Grid>
                    {message && <div style={{ color: 'green' }}>{message}</div>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
