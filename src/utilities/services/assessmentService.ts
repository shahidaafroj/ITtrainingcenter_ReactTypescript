import { IAssessmentCreate, IAssessmentDetailsDTO } from "../../interfaces/IAssessment";
import { BaseService } from "./base";
import axios from "axios";

export class AssessmentService {
  // static getAll = async (): Promise<IAssessmentCreate[]> => {
  //   const result = await BaseService.createInstance().get("Assessment/GetAssessments");
  //   return result.data;
  // };
  static getAll = async (): Promise<any[]> => {
  const result = await BaseService.createInstance().get("Assessment/GetAssessments");
  console.log("Assessments data:", result.data); // ডাটা স্ট্রাকচার চেক করুন
  return result.data;
};

  static getById = async (id: number): Promise<IAssessmentDetailsDTO> => {
    const result = await BaseService.createInstance().get(`Assessment/GetAssessment/${id}`);
    return result.data;
  };
 static create = async (assessment: IAssessmentCreate) => {
  const result = await BaseService.createInstance()
    .post("Assessment/InsertAssessment", assessment);
  return result.data;
};


  static update = async (id: number, assessment: IAssessmentCreate) => {
    const result = await BaseService.createInstance().put(`Assessment/UpdateAssessment/${id}`, assessment);
    return result.data;
  };

  static delete = async (id: number): Promise<void> => {
    await BaseService.createInstance().delete(`Assessment/DeleteAssessment/${id}`);
  };

//   static getInsTraiByBatch = async (batchId: number) => {
//   const result = await BaseService.createInstance().get(`Assessment/GetInsTraiByBatch/${batchId}`);
//   return result.data;
// };
static getInsTraiByBatch = async (batchId: number) => {
  const result = await BaseService.createInstance()
    .get(`Assessment/GetInsTraiByBatches/${batchId}`);
  console.log("API Response:", result.data); // রেস্পন্স ডাটা লগ করুন
  return result.data;
};

// services/assessmentService.ts

static getAssessedTrainees = async (batchId: number): Promise<number[]> => {
  const result = await BaseService.createInstance()
    .get(`Assessment/AssessedTrainees/${batchId}`);
  return result.data; // array of traineeId
};


}