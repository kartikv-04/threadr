import axios, {AxiosInstance} from "axios";

//  Centralized Axios Instance
const api : AxiosInstance = axios.create({
    baseURL : "http://localhost:5000/api/v1",
    timeout : 10000,
    headers : {
        'Content-Type' : 'application/json',
    }
});

export  {api};