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

export interface CompanyData {
  companyId: string;
  companyName: string;
  totalUsers: number;
  totalTrips: number;
  totalDistance: number;
  totalCo2: number;
  totalDuration: number;
}

export interface CompanyCO2StatisticsResponse {
  startDate: string;
  endDate: string;
  companies: CompanyData[];
  total: number;
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

export const getCompanyCO2Statistics = async (startDate: string, endDate: string, groupBy: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  return await axiosInstance.get<QueryObject, APIResponse<CompanyCO2StatisticsResponse>>(
    `/reports/company-co2-statistics`,
    { 
      params: {
        startDate,
        endDate,
        // groupBy
      } 
    }
  )
} 