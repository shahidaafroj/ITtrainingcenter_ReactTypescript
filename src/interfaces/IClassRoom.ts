export interface IClassRoom {
  classRoomId: number;
  roomName: string;
  seatCapacity: number;
  location: string;
  hasProjector: boolean;
  hasAirConditioning: boolean;
  hasWhiteboard: boolean;
  hasSoundSystem: boolean;
  hasInternetAccess: boolean;
  isActive: boolean;
  remarks?: string;
  additionalFacilities?: string;
classRoomCourse_Junction_Tables?: IClassroomCourseJunction[];
  assignedCourses?: IClassroomCourseJunction[]; }

export interface IClassroomCourseJunction {
  classRoomCourseId: number;
  classRoomId: number;
  courseId: number;
  course?: ICourse;
  isAvailable: boolean;
}

export interface ICourse {
  courseId: number;
  courseName: string;
  shortCode: string;
  totalHours: string;
  courseFee: number;
  remarks?: string;
  isActive: boolean;
  createdDate: string;
}