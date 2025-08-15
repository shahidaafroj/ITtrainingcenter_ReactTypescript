export interface ICoursePostRequest {
  courseId?: number; // 👈 optional for update
  courseName: string;
  shortCode: string;
  totalHours: string;
  courseFee: string | number;
  remarks?: string;
  isactive: boolean;
  createdDate: string;
  instructorCourse_Junction_Tables: {
    instructorId: number;
    isPrimaryInstructor: boolean;
  }[];
  classRoomCourse_Junction_Tables: {
    classRoomId: number;
    isAvailable: boolean;
  }[];
}


export interface IInstructorCourseInput {
  instructorId: number;
  isPrimaryInstructor: boolean;
}

export interface IClassRoomCourseInput {
  classRoomId: number;
  isAvailable: boolean;
}

export interface ICourseListItem {
  courseId: number;
  courseName: string;
  shortCode: string;
  totalHours: string;
  courseFee: number;
  isActive: boolean;
  remarks?: string;
  createdDate: string;
  instructors: {
    instructorId: number;
    employeeName: string;
  }[];
  classRooms: {
    classRoomId: number;
    roomName: string;
  }[];
}

export interface ICourseDetails {
  courseId: number;
  courseName: string;
  shortCode: string;
  totalHours: string;
  courseFee: number;
  isActive: boolean;
  remarks?: string;
  createdDate: string;
  instructors: {
    instructorId: number;
    employeeName: string;
    isPrimaryInstructor: boolean;
    assignmentDate: string;
  }[];
  classRooms: {
    classRoomId: number;
    roomName: string;
    isAvailable: boolean;
  }[];
}


export interface ICourseDetailss {
  courseId: number;
  courseName: string;
  shortCode: string;
  totalHours: string;
  courseFee: number;
  isActive: boolean;
  remarks?: string;
  createdDate: string;
  instructors: {
    instructorId: number;
    employeeName: string;
    isPrimaryInstructor: boolean;
    assignmentDate: string;
  }[];
  classRooms: {
    classRoomId: number;
    roomName: string;
    isAvailable: boolean;
  }[];
  instructorCourse_Junction_Tables: {
    instructorId: number;
    isPrimaryInstructor: boolean;
  }[];

  classRoomCourse_Junction_Tables: {
    classRoomId: number;
    isAvailable: boolean;
  }[];
}

