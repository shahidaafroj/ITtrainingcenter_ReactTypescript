import { IBatchOption, IBatchTransfer, ITraineeOption } from "../../interfaces/IBatchTransfer";
import { BaseService } from "./base";
export class BatchTransferService {
  static getAll = async (): Promise<IBatchTransfer[]> => {
    const result = await BaseService.createInstance().get('BatchTransfer/GetBatchTransfers');
    return result.data;
  }

  static getById = async (id: number): Promise<IBatchTransfer> => {
    const result = await BaseService.createInstance().get(`BatchTransfer/GetBatchTransfer/${id}`);
    return result.data;
  }

static create = async (transfer: any): Promise<IBatchTransfer> => {
  const response = await BaseService.createInstance().post(
    'BatchTransfer/InsertBatchTransfer',
    transfer // Send flat object directly
  );
  return response.data;
};

static update = async (id: number, transfer: any): Promise<IBatchTransfer> => {
  const response = await BaseService.createInstance().put(
    `BatchTransfer/UpdateBatchTransfer/${id}`,
    transfer // Send flat object directly
  );
  return response.data;
};

  static getTraineeOptions = async (): Promise<ITraineeOption[]> => {
    const result = await BaseService.createInstance().get('BatchTransfer/GetTraineeOptions');
    return result.data;
  }

  static getBatchOptions = async (): Promise<IBatchOption[]> => {
    const result = await BaseService.createInstance().get('BatchTransfer/GetBatchOptions');
    return result.data;
  }
    static delete = async (id: number): Promise<void> => {
        await BaseService.createInstance().delete(`BatchTransfer/DeleteBatchTransfer/${id}`);
    }
}