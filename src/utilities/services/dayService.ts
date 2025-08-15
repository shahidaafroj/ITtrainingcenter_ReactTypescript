import { IDay } from "../../interfaces/Iday";
import { BaseService } from "./base";
export class DayService {
    static getAll = async (): Promise<IDay[]> => {
        const result = await BaseService.createInstance().get('Day/GetDays');
        return result.data;
    }

    static getById = async (id: number): Promise<IDay> => {
        const result = await BaseService.createInstance().get(`Day/GetDay/${id}`);
        return result.data;
    }

    static create = async (day: IDay): Promise<IDay> => {
        const result = await BaseService.createInstance().post('Day/InsertDay', day);
        return result.data;
    }

    static update = async (id: number, day: IDay): Promise<IDay> => {
        const result = await BaseService.createInstance().put(`Day/UpdateDay/${id}`, day);
        return result.data;
    }

    static delete = async (id: number): Promise<void> => {
        await BaseService.createInstance().delete(`Day/DeleteDay/${id}`);
    }
}