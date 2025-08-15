import axios from 'axios';
import {  IBatchDetails, ITraineeAttendance } from '../../interfaces/ITraineeAttendance';

const API_URL = 'http://localhost:5281/api/TraineeAttendance';

export class TraineeAttendanceService {
  static getAllAttendances = async (): Promise<ITraineeAttendance[]> => {
    const response = await axios.get(`${API_URL}/GetTraineeAttendances`);
    return response.data;
  };

static getAttendanceById = async (id: number): Promise<ITraineeAttendance> => {
  const response = await axios.get(`${API_URL}/GetTraineeAttendance/${id}`);
  console.log('Single Attendance Response:', response.data);
  return response.data;
};

static getAttendanceByDateBatchInstructor = async (
  date: string, 
  batchId: number, 
  instructorId: number
): Promise<ITraineeAttendance> => {
  const response = await axios.get(`${API_URL}/GetAttendanceByDateBatchInstructor`, {
    params: { date, batchId, instructorId }
  });
  return response.data;
};



static async createAttendance(attendance: ITraineeAttendance): Promise<ITraineeAttendance> {
    try {
      // Transform data to match backend structure
      const payload = {
        attendanceDate: attendance.attendanceDate,
        batchId: attendance.batchId,
        instructorId: attendance.instructorId,
        traineeAttendanceDetails: attendance.traineeAttendanceDetails?.map(detail => ({
          traineeId: detail.traineeId,
          admissionId: detail.admissionId,
          invoiceId: detail.invoiceId || null,
          attendanceStatus: detail.attendanceStatus,
          remarks: detail.remarks || null
        }))
      };

      const response = await axios.post(`${API_URL}/InsertTraineeAttendance`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }
 static updateAttendance = async (id: number, data: ITraineeAttendance): Promise<void> => {
  await axios.put(`${API_URL}/UpdateTraineeAttendance/${id}`, data);
};

  // In traineeAttendanceService.ts
static deleteAttendance = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/DeleteTraineeAttendance/${id}`);
};

  static async getBatchDetails(batchId: number): Promise<IBatchDetails> {
    try {
      const response = await axios.get<IBatchDetails>(`${API_URL}/GetBatchDetails/${batchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching batch details:', error);
      throw error;
    }
  }
}