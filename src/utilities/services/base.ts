
import axios, { AxiosInstance } from 'axios';

export class BaseService {

    static baseURL: string = 'http://localhost:5281/api/';


    static  createInstance() {
        let headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
     
        const client: AxiosInstance = axios.create({
            baseURL: BaseService.baseURL,
            headers: { ...headers }
        });

        return client;
    }
 
}

