import axiosInstance from "./axios"
import { APIResponse, QueryObject } from "./types"

export interface ReportData {
  totalUsers: number;
  totalTrips: number;
  totalDistance: number;
  totalCo2: number;
  totalDuration: number;
}

export interface ReportByTypeData {
  byPlane: number;
  byCar: number;
  byPublicTransport: number;
  byCarpooling: number;
  total: number;
}

export interface ReportByCompanyData {
  companyId: string;
  companyName: string;
  totalCo2: number;
  percentage: number;
}

export const getTotalReport = async (data?: QueryObject) => {
  return await axiosInstance.get<QueryObject, APIResponse<ReportData>>(
    `/reports/total`,
    { params: data }
  )
}

export const getReportByType = async (data?: QueryObject) => {
  return await axiosInstance.get<QueryObject, APIResponse<ReportByTypeData>>(
    `/reports/by-type`,
    { params: data }
  )
}

export const getReportByCompany = async (data?: QueryObject) => {
  return await axiosInstance.get<QueryObject, APIResponse<ReportByCompanyData[]>>(
    `/reports/by-company`,
    { params: data }
  )
} 