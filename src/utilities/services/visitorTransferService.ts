import { IVisitorTransfer } from "../../interfaces/IVisitorTransfer";
import { BaseService } from "./base";

export class VisitorTransferService {
  // static assignVisitors = async (transferData: IVisitorTransfer) => {
  //   const response = await BaseService.createInstance().post(
  //     "VisitorTransfer/assign",
  //     transferData
  //   );
  //   return response.data;
  // };


static assignVisitors = async (transferData: IVisitorTransfer) => {
  try {
    const response = await BaseService.createInstance().post(
      "VisitorTransfer/assign",
      transferData
    );
    return response.data;
  } catch (error: any) {  // Using 'any' as quick fix
    if (error.response?.status === 409) {
      throw new Error("Conflict: " + (error.response.data || "Visitors cannot be transferred in their current state"));
    }
    throw error;
  }
};
  static getEmployees = async () => {
    const res = await BaseService.createInstance().get("Employee/GetEmployees");
    return res.data;
  };

  static getVisitorsByEmployeeId = async (employeeId: number) => {
    const res = await BaseService.createInstance().get(
      `Visitor/ByEmployee/${employeeId}`
    );
    return res.data;
  };

  static getAllTransfers = async () => {
    const res = await BaseService.createInstance().get("VisitorTransfer/GetVisitorTransfers");
    return res.data;
  };

  static getTransferById = async (id: number) => {
    const res = await BaseService.createInstance().get(`VisitorTransfer/GetVisitorTransfer/${id}`);
    return res.data;
  };

  

  static getAssignedVisitorsByEmployeeId= async (employeeId: number) => {
    const response = await BaseService.createInstance().get(`/VisitorTransfer/AssignedVisitorsByEmployee/${employeeId}`);
    return response.data;
  };

   static deleteTransfer = async (id: number): Promise<void> => {
    await BaseService.createInstance().delete(`VisitorTransfer/DeleteVisitorTransfer/${id}`);
  };

}