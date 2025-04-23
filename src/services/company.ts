import axiosInstance from "./axios"
import { APIResponse, QueryObject } from "./types"

export interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  name: string;
  address: string | null;
  description: string | null;
  totalCo2: number;
  totalDistance: number;
  totalDuration: number;
  totalTrips: number;
}

export const getCompanies = async (data?: QueryObject) => {
  return await axiosInstance.get<QueryObject, APIResponse<Company[]>>(
    `/companies`,
    { params: data }
  )
}