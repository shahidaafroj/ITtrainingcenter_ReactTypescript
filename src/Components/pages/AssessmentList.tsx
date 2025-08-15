import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Box
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { AssessmentService } from '../../utilities/services/assessmentService';

export const AssessmentList = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    AssessmentService.getAll().then(setAssessments);
  }, []);
const handleDelete = async (id: number) => {
  const confirmed = window.confirm("Are you sure you want to delete this assessment?");
  if (!confirmed) return;

  try {
    await AssessmentService.delete(id);
    setAssessments(assessments.filter(a => a.assessmentId !== id));
  } catch (error) {
    console.error("Failed to delete assessment:", error);
    alert("Error deleting assessment. Please try again.");
  }
};


  return (
    <>
      {/* Add Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/assessments/add')}
        >
          + Add Assessment
        </Button>
      </Box>

      {/* Table List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch</TableCell>
              <TableCell>Trainee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map(a => (
              <TableRow key={a.assessmentId}>
                <TableCell>{a.batchName || a.batch?.batchName}</TableCell>
                <TableCell>{a.traineeName  || a.trainee?.registration?.traineeName}</TableCell>
                <TableCell>{a.assessmentType}</TableCell>
                <TableCell>{a.assessmentDate}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => navigate(`/assessments/details/${a.assessmentId}`)}>View</Button>
                  <Button color="primary" onClick={() => navigate(`/assessments/edit/${a.assessmentId}`)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDelete(a.assessmentId)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
