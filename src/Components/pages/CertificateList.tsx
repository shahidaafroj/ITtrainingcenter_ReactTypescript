import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { ICertificate } from '../../interfaces/ICertificate';
import { CertificateService } from '../../utilities/services/certificateService';

export const CertificateList = () => {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    CertificateService.getAll().then(res => setCertificates(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this certificate?')) {
      await CertificateService.remove(id);
      setCertificates(prev => prev.filter(c => c.certificateId !== id));
    }
  };

  return (
    <Container>
      <Paper style={{ padding: 20 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/certificates/new')}>
          Add Certificate
        </Button>
        <Table>
          <TableHead>
        <TableRow>
            <TableCell>Certificate No</TableCell>
            <TableCell>Trainee Name</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Actions</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {certificates.map(cert => (
            <TableRow key={cert.certificateId}>
            <TableCell>{cert.certificateNumber}</TableCell>
            <TableCell>{cert.traineeName}</TableCell>
            <TableCell>{cert.courseName}</TableCell>
            <TableCell>
                <Button color="primary" onClick={() => navigate(`/certificates/details/${cert.certificateId}`)}>
                View
                </Button>
                <Button color="secondary" onClick={() => handleDelete(cert.certificateId!)}>
                Delete
                </Button>
            </TableCell>
            </TableRow>
        ))}
        </TableBody>

        </Table>
      </Paper>
    </Container>
  );
};