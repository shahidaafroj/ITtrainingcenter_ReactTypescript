export interface IResponse<T = any> {
    isSuccess: boolean;
//    dayId: string;
    message: string;
    httpStatusCode: string;
    // data?:any;
    data: T | null;
}
