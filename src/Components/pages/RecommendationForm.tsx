// components/recommendation/RecommendationForm.tsx
import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Box,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { IRecommendation } from '../../interfaces/IRecommendation';
import axios from 'axios';

const API_BASE = 'http://localhost:5281/api';

interface IBatch {
  batchId: number;
  batchName: string;
}

interface ITrainee {
  traineeId: number;
  traineeName: string;
  
}

interface IAssessment {
  assessmentId: number;
  assessmentType: string;
  assessmentDate: string;
  isFinalized: boolean;
}

interface IInvoice {
  invoiceId: number;
  invoiceNo: string;
}

interface IPaymentSummary {
  statusMessage: string;
  invoiceNo?: string;
}

interface IEntry {
  traineeId: number;
  traineeName: string;
  assessmentId: number | null;
  invoiceId: number | null;
  recommendationText: string;
  recommendationDate: string;
  recommendationStatus: string;
  assessments: IAssessment[];
  invoices: IInvoice[];
  paymentSummary?: IPaymentSummary;
  traineeIDNo?: string; // Assuming this is part of the trainee data
}

export const RecommendationForm = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | ''>('');
  const [instructorId, setInstructorId] = useState<number | null>(null);
  const [instructorName, setInstructorName] = useState<string | null>(null);
  const [recommendationEntries, setRecommendationEntries] = useState<IEntry[]>([]);
  

  // Load batches on mount
  useEffect(() => {
    axios.get(`${API_BASE}/Batch/GetBatches`).then(res => setBatches(res.data));
  }, []);

  // When batch changes
  const handleBatchChange = async (batchId: number) => {
    setSelectedBatchId(batchId);
    setRecommendationEntries([]);

    try {
      const [batchRes, existingRecRes] = await Promise.all([
        axios.get(`${API_BASE}/Recommendation/GetInsTraiByBatch/${batchId}`),
        axios.get(`${API_BASE}/Recommendation/GetRecommendationsByBatch/${batchId}`)
      ]);

      setInstructorName(batchRes.data.instructor?.instructorName || null);
      setInstructorId(batchRes.data.instructor?.instructorId || null);

      const existingTraineeIds = existingRecRes.data.map((r: any) => r.traineeId);

      // Filter trainees who don't have recommendation yet
      const eligibleTrainees = batchRes.data.trainees.filter(
        (t: any) => !existingTraineeIds.includes(t.traineeId)
      );

      // For each eligible trainee, get assessments + payment summary
      const traineeData = await Promise.all(
        eligibleTrainees.map(async (t: ITrainee) => {
          const [assessRes, payRes] = await Promise.all([
            axios.get(`${API_BASE}/Recommendation/GetInvAssessbyTrainee/${t.traineeId}`),
            axios.get(`${API_BASE}/Recommendation/trainee-payment-summary/${t.traineeId}`)
          ]);
          return {
            traineeId: t.traineeId,
            traineeName: t.traineeName,
            assessments: assessRes.data.assessments || [],
            invoices: assessRes.data.invoices || [],
            paymentSummary: payRes.data
          };
        })
      );

      // Filter only finalized + cleared
      const filteredEntries: IEntry[] = traineeData
        .filter(td => {
          const hasFinalized = td.assessments.some((a: IAssessment) => a.isFinalized);
          const isCleared = td.paymentSummary?.statusMessage === 'Cleared';
          return hasFinalized && isCleared;
        })
        .map(td => ({
          traineeId: td.traineeId,
          traineeName: td.traineeName,
          traineeIDNo: td.traineeIDNo,
          assessmentId: null,
          invoiceId: null,
          recommendationText: '',
          recommendationDate: new Date().toISOString().substring(0, 10),
          recommendationStatus: 'pending',
          assessments: td.assessments,
          invoices: td.invoices,
          paymentSummary: td.paymentSummary
        }));

      setRecommendationEntries(filteredEntries);
    } catch (err) {
      console.error('Error loading batch trainees:', err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBatchId || !instructorId) return;

    const payload = {
      recommendationDate: new Date().toISOString().substring(0, 10),
      batchId: selectedBatchId,
      instructorId: instructorId,
      recommendations: recommendationEntries.map(e => ({
        traineeId: e.traineeId,
        assessmentId: e.assessmentId!,
        invoiceId: e.invoiceId!,
        recommendationText: e.recommendationText,
        recommendationStatus: e.recommendationStatus
      }))
    };

    try {
      await axios.post(`${API_BASE}/Recommendation/InsertRecommendation`, payload);
      alert('Recommendations submitted successfully!');
      navigate('/recommendations');
    } catch (err) {
      console.error('Error submitting recommendations:', err);
      alert('Error submitting recommendations');
    }
  };

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">Create Recommendations</Typography>
        <Grid container spacing={2} style={{ marginTop: 16 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Batch</InputLabel>
              <Select
                value={selectedBatchId}
                onChange={(e) => handleBatchChange(e.target.value as number)}
              >
                <MenuItem value="">-- Select Batch --</MenuItem>
                {batches.map(b => (
                  <MenuItem key={b.batchId} value={b.batchId}>
                    {b.batchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {instructorName && (
            <Grid item xs={12} md={6}>
              <TextField label="Instructor" value={instructorName} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          )}
        </Grid>

        {recommendationEntries.length > 0 && (
          <Box mt={3}>
            {recommendationEntries.map((entry, idx) => (
              <Paper key={idx} style={{ padding: 16, marginBottom: 16 }}>
                <Typography variant="subtitle1">{entry.traineeName}</Typography>
                <Grid container spacing={2} style={{ marginTop: 8 }}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Assessment</InputLabel>
                      <Select
                        value={entry.assessmentId || ''}
                        onChange={(e) => {
                          const val = e.target.value as number;
                          setRecommendationEntries(prev => {
                            const copy = [...prev];
                            copy[idx].assessmentId = val;
                            return copy;
                          });
                        }}
                      >
                        <MenuItem value="">-- Select Assessment --</MenuItem>
                        {entry.assessments
                          .filter(a => a.isFinalized)
                          .map(a => (
                            <MenuItem key={a.assessmentId} value={a.assessmentId}>
                              {`${a.assessmentType} - ${new Date(a.assessmentDate).toLocaleDateString()}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Invoice</InputLabel>
                      <Select
                        value={entry.invoiceId || ''}
                        onChange={(e) => {
                          const val = e.target.value as number;
                          setRecommendationEntries(prev => {
                            const copy = [...prev];
                            copy[idx].invoiceId = val;
                            return copy;
                          });
                        }}
                      >
                        <MenuItem value="">-- Select Invoice --</MenuItem>
                        {entry.invoices.map(inv => (
                          <MenuItem key={inv.invoiceId} value={inv.invoiceId}>
                            {inv.invoiceNo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={entry.recommendationStatus}
                        onChange={(e) => {
                          const val = e.target.value as string;
                          setRecommendationEntries(prev => {
                            const copy = [...prev];
                            copy[idx].recommendationStatus = val;
                            return copy;
                          });
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <TextField
                  label="Recommendation Text"
                  value={entry.recommendationText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRecommendationEntries(prev => {
                      const copy = [...prev];
                      copy[idx].recommendationText = val;
                      return copy;
                    });
                  }}
                  fullWidth
                  multiline
                  rows={2}
                  style={{ marginTop: 8 }}
                />
              </Paper>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={recommendationEntries.length === 0}
            >
              Submit Recommendations
            </Button>
          </Box>
        )}

        {selectedBatchId && recommendationEntries.length === 0 && (
          <Typography style={{ marginTop: 16 }}>
            No eligible trainees found for this batch.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};
