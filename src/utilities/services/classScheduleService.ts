import { IClassSchedule, IDay, ISlot } from "../../interfaces/IClassSchedule";
import { BaseService } from "./base";

export class ClassScheduleService {
  static async getAll(): Promise<IClassSchedule[]> {
    const res = await BaseService.createInstance().get("ClassSchedule/GetSchedules");
    return res.data;
  }

  static async getById(id: number): Promise<IClassSchedule> {
    const res = await BaseService.createInstance().get(`ClassSchedule/GetSchedule/${id}`);
    return res.data;
  }

  static async create(data: IClassSchedule): Promise<IClassSchedule> {
    const res = await BaseService.createInstance().post("ClassSchedule/InsertSchedule", data);
    return res.data;
  }

  static async update(id: number, data: IClassSchedule): Promise<void> {
    await BaseService.createInstance().put(`ClassSchedule/UpdateSchedule/${id}`, data);
  }

  static async delete(id: number): Promise<void> {
    await BaseService.createInstance().delete(`ClassSchedule/DeleteSchedule/${id}`);
  }

  static async getSlots(): Promise<ISlot[]> {
    const res = await BaseService.createInstance().get("Slot/GetSlots");
    return res.data;
  }

  static async getDays(): Promise<IDay[]> {
  const res = await BaseService.createInstance().get("Day/GetDays");
  return res.data.data; // ✅ Only return the inner data array
}

}
