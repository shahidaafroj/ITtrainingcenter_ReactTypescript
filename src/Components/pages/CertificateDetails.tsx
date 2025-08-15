import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Grid } from '@material-ui/core';
import { ICertificate } from '../../interfaces/ICertificate';
import { CertificateService } from '../../utilities/services/certificateService';

export const CertificateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      CertificateService.getById(+id).then(res => setCertificate(res.data));
    }
  }, [id]);

  if (!certificate) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">Certificate Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><strong>Trainee:</strong> {certificate.traineeName}</Grid>
          <Grid item xs={12}><strong>RegistrationId:</strong> {certificate.registrationNo}</Grid>
          <Grid item xs={12}><strong>BatchId:</strong> {certificate.batchName}</Grid>
          <Grid item xs={12}><strong>CourseId:</strong> {certificate.courseName}</Grid>
          <Grid item xs={12}><strong>RecommendationId:</strong> {certificate.recommendationStatus}</Grid>
          <Grid item xs={12}><strong>Issue Date:</strong> {certificate.issueDate}</Grid>
          <Grid item xs={12}><strong>Certificate No:</strong> {certificate.certificateNumber}</Grid>
        </Grid>
        <Button style={{ marginTop: 20 }} onClick={() => navigate('/certificates')}>
          Back to List
        </Button>
      </Paper>
    </Container>
  );
};
