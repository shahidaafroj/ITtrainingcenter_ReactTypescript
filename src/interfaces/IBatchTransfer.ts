export interface IBatchTransfer {
  batchTransferId?: number;
  traineeId: number;
  traineeName: string;
  traineeNo: string;
  batchId: number;
  batchName: string;
  createdDate?: Date | null;
  transferDate: Date | null;
}

export interface ITraineeOption {
  traineeId: number;
  traineeName: string;
  traineeNo: string;
}

export interface IBatchOption {
  batchId: number;
  batchName: string;
}