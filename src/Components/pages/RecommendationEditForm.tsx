import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IRecommendation } from '../../interfaces/IRecommendation';

const API_BASE = 'http://localhost:5281/api';

export const RecommendationEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<IRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/Recommendation/GetRecommendation/${id}`)
      .then(res => {
        const data = res.data;
        setRecommendation({
          recommendationId: data.recommendationId,
          traineeId: data.traineeId,
          instructorId: data.instructorId,
          batchId: data.batchId,
          assessmentId: data.assessmentId,
          invoiceId: data.invoiceId,
          recommendationText: data.recommendationText,
          recommendationDate: data.recommendationDate,
          recommendationStatus: data.recommendationStatus,
          traineeName: data.trainee?.registration?.traineeName,
          batchName: data.batch?.batchName,
          instructorName: data.instructor?.employee?.employeeName,
          invoiceNo: data.invoice?.invoiceNo,
          assessmentStatus: data.assessment?.isFinalized ? "Finalized" : "Not Finalized"
        });
      })
      .catch(err => console.error('Error loading recommendation:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof IRecommendation, value: any) => {
    setRecommendation(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = async () => {
    if (!recommendation?.recommendationId) return;

    try {
      await axios.put(
        `${API_BASE}/Recommendation/UpdateRecommendation/${recommendation.recommendationId}`,
        recommendation
      );
      alert('Recommendation updated successfully!');
      navigate('/recommendations');
    } catch (err) {
      console.error('Error updating recommendation:', err);
      alert('Error updating recommendation');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!recommendation) return <Typography>Recommendation not found.</Typography>;

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">Edit Recommendation</Typography>
        <Grid container spacing={2} style={{ marginTop: 16 }}>
          
          {/* Read-only info fields */}
          <Grid item xs={12} md={6}>
            <TextField label="Batch Name" value={recommendation.batchName || ''} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Instructor Name" value={recommendation.instructorName || ''} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Trainee Name" value={recommendation.traineeName || ''} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Invoice No" value={recommendation.invoiceNo || ''} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Assessment Status" value={recommendation.assessmentStatus || ''} fullWidth InputProps={{ readOnly: true }} />
          </Grid>

          {/* Editable fields */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Recommendation Date"
              type="date"
              value={recommendation.recommendationDate}
              onChange={(e) => handleChange('recommendationDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={recommendation.recommendationStatus}
                onChange={(e) => handleChange('recommendationStatus', e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Recommendation Text"
              value={recommendation.recommendationText}
              onChange={(e) => handleChange('recommendationText', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={handleSubmit}
        >
          Update Recommendation
        </Button>
      </Paper>
    </Container>
  );
};
