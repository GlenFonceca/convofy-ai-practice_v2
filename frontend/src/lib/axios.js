import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials:true, //Send the Cookies with request
})