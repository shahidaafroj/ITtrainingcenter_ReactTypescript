import { IClassRoom } from "../../interfaces";
import { BaseService } from "./base";

export class ClassroomService {
  static getAll = async (): Promise<IClassRoom[]> => {
    const result = await BaseService.createInstance().get('ClassRoom/GetAllClassRooms');
    return result.data;
  };

  // static getById = async (id: number): Promise<IClassRoom> => {
  //   const result = await BaseService.createInstance().get(`ClassRoom/GetClassRoom/${id}`);
  //   return result.data;
  // };

  // classroomService.ts
static getById = async (id: number): Promise<IClassRoom> => {
  const result = await BaseService.createInstance().get(`ClassRoom/GetClassRoom/${id}`);
  return {
    ...result.data,
    classRoomCourse_Junction_Tables: result.data.assignedCourses || []
  };
};

  static create = async (classroom: IClassRoom): Promise<IClassRoom> => {
    const result = await BaseService.createInstance().post('ClassRoom/InsertClassRoom', classroom);
    return result.data;
  };

  static update = async (id: number, classroom: IClassRoom): Promise<IClassRoom> => {
    const result = await BaseService.createInstance().put(`ClassRoom/UpdateClassRoom/${id}`, classroom);
    return result.data;
  };

  static delete = async (id: number): Promise<void> => {
    await BaseService.createInstance().delete(`ClassRoom/DeleteClassRoom/${id}`);
  };
}