export interface IInstructor {
  instructorId: number;
  employeeId: number;
  employeeName?: string;
  isActive: boolean;
  remarks?: string;
  selectedCourseIds: number[];
   courses?: IInstructorCourse[];
  assignedBatchPlanningIds?: number[];
}

export interface ICourse {
  courseId: number;
  courseName: string;
}

export interface IInstructorCourse {
  instructorCourseId: number;
  instructorId: number;
  courseId: number;
  courseName: string;
  isPrimaryInstructor: boolean;
  assignmentDate: string;
}