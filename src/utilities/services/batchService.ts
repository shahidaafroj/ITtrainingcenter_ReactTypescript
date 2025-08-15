
// src/utilities/services/batchService.ts
import { IBatch, IResponse,  ISlot, ICourse, IClassRoom, IBatchListItem, IBatchDetails } from '../../interfaces';
import { IInstructor } from '../../interfaces/IInstructor';
import { IDay } from '../../interfaces/Iday';

import { BaseService } from '../services';

export class BatchService {


  // Fetch all instructors from database
  static getInstructors = async (): Promise<IInstructor[]> => {
    try {
      const result = await BaseService.createInstance().get('Instructor/GetInstructors');
      console.log("Instructors API Response:", result.data);
      return result.data?.map((instructor: any) => ({
        instructorId: instructor.instructorId,
        instructorName: instructor.instructorName || `${instructor.firstName} ${instructor.lastName}`,
        specialization: instructor.specialization,
      })) ?? [];
    } catch (error: any) {
      console.error("Error in getInstructors:", error);
      throw error;
    }
  };

  // Fetch all time slots from database
  static getTimeSlots = async (): Promise<ISlot[]> => {
    try {
      const result = await BaseService.createInstance().get('Batch/slots');
      return result.data?.map((slot: any) => ({
        slotId: slot.slotId,
        timeSlotType: slot.timeSlotType,
        startTime: slot.startTime,
        endTime: slot.endTime,
        // Format time if needed
        formattedTime: `${slot.startTime} - ${slot.endTime}`
      })) ?? [];
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch time slots';
      console.error("Error fetching time slots:", message);
      throw new Error(message);
    }
  };

  // Fetch all days from database
  static getDays = async (): Promise<IDay[]> => {
    try {
      const result = await BaseService.createInstance().get('Batch/days');
      return result.data?.map((day: any) => ({
        dayId: day.dayId,
        dayName: day.dayName,
        // Add other properties as needed
      })) ?? [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch days';
      console.error("Error fetching days:", message);
      throw new Error(message);
    }
  };

  // Batch CRUD operations
  static getAll = async (): Promise<IBatch[]> => {
    try {
      const result = await BaseService.createInstance().get('Batch/GetBatches');
      return result.data?.map((batch: any) => ({
        ...batch,
        // Ensure proper formatting of dates if needed
        startDate: batch.startDate ? new Date(batch.startDate).toISOString() : '',
        endDate: batch.endDate ? new Date(batch.endDate).toISOString() : undefined,
      })) ?? [];
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch batches';
      console.error("Error fetching batches:", message);
      throw new Error(message);
    }
  };

  static getById = async (batchId: number): Promise<IBatch> => {
    try {
      const result = await BaseService.createInstance().get(`Batch/GetBatch/${batchId}`);
      return {
        ...result.data,
        // Format dates if needed
        startDate: result.data.startDate ? new Date(result.data.startDate).toISOString() : '',
        endDate: result.data.endDate ? new Date(result.data.endDate).toISOString() : undefined,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch batch';
      console.error("Error fetching batch:", message);
      throw new Error(message);
    }
  };

  

  


    static getAlll = async (): Promise<IBatchListItem[]> => {
    const result = await BaseService.createInstance().get('Batch/GetBatches');
    return result.data;
  };

  // static getByIdd = async (id: number): Promise<IBatchDetails> => {
  //   const result = await BaseService.createInstance().get(`Batch/GetBatch/${id}`);
  //   return result.data;
  // };

static getByIdd = async (id: number): Promise<IBatchDetails> => {
  const result = await BaseService.createInstance().get(`Batch/GetBatches/${id}`);
  const data = result.data;

  return {
    ...data,
    schedules: data.schedules?.map((schedule: any) => ({
      classScheduleId: schedule.classScheduleId,
      selectedDays: schedule.selectedDays,
      slotId: schedule.slotId,
      slot: schedule.slot ? {
        timeSlotType: schedule.slot.timeSlotType,
        startTimeString: schedule.slot.startTimeString,
        endTimeString: schedule.slot.endTimeString
      } : undefined,
      scheduleDate: schedule.scheduleDate,
      isActive: schedule.isActive
    })) || []
  };
};


  static create = async (batch: IBatch): Promise<IBatch> => {
    const result = await BaseService.createInstance().post('Batch/InsertBatch', {
      CourseId: batch.courseId,
      StartDate: batch.startDate,
      EndDate: batch.endDate,
      BatchType: batch.batchType,
      InstructorId: batch.instructorId,
      ClassRoomId: batch.classRoomId,
      SelectedScheduleIds: batch.selectedScheduleIds,
      IsActive: batch.isActive,
      Remarks: batch.remarks
    });
    return result.data;
  };

  static update = async (id: number, batch: IBatch): Promise<IBatch> => {
    const result = await BaseService.createInstance().put(`Batch/UpdateBatch/${id}`, {
      BatchId: id,
      CourseId: batch.courseId,
      StartDate: batch.startDate,
      EndDate: batch.endDate,
      BatchType: batch.batchType,
      InstructorId: batch.instructorId,
      ClassRoomId: batch.classRoomId,
      SelectedScheduleIds: batch.selectedScheduleIds,
      IsActive: batch.isActive,
      Remarks: batch.remarks,
      PreviousInstructorIds: batch.previousInstructorIds
    });
    return result.data;
  };

  static delete = async (id: number): Promise<void> => {
    await BaseService.createInstance().delete(`Batch/DeleteBatch/${id}`);
  };

  static generateBatchName = async (courseId: number): Promise<string> => {
    const result = await BaseService.createInstance().get(`Batch/GenerateBatchName/${courseId}`);
    return result.data;
  };




}