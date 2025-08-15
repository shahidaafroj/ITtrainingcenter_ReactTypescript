import { ICourse} from "../../interfaces";
import { IInstructor } from "../../interfaces/IInstructor";
import { BaseService } from "./base";
export class InstructorService {
  static getAll = async (): Promise<IInstructor[]> => {
    const result = await BaseService.createInstance().get('Instructor/GetInstructors');
    return result.data;
  }

  static getById = async (id: number): Promise<IInstructor> => {
    const result = await BaseService.createInstance().get(`Instructor/GetInstructor/${id}`);
    return result.data;
  }

  static create = async (instructor: IInstructor): Promise<IInstructor> => {
    const result = await BaseService.createInstance().post('Instructor/InsertInstructor', instructor);
    return result.data;
  }

  static update = async (id: number, instructor: IInstructor): Promise<IInstructor> => {
    const result = await BaseService.createInstance().put(`Instructor/UpdateInstructor/${id}`, instructor);
    return result.data;
  }

  static delete = async (id: number): Promise<void> => {
    await BaseService.createInstance().delete(`Instructor/DeleteInstructor/${id}`);
  }

  static getCourses = async (): Promise<ICourse[]> => {
    const result = await BaseService.createInstance().get('Course/GetCourses');
    return result.data;
  }
}