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

export interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  name: string;
  address: null | string;
  description: null | string;
  totalCo2: number;
  totalDistance: number;
  totalDuration: number;
  totalTrips: number;
}

export interface VehicleStats {
  vehicleType: string;
  totalDistance: number;
  totalCo2: number;
  tripCount: number;
  totalDuration?: number;
}

export interface CompanyVehicleDistanceStats {
  companyId: string;
  companyName: string;
  totalDistance: number;
  totalCo2: number;
  vehicleStats: VehicleStats[];
}

export interface CompanyVehicleDurationStats {
  companyId: string;
  companyName: string;
  totalDuration: number;
  vehicleStats: VehicleStats[];
}

export const getTotalReport = async (data?: QueryObject) => {
  return await axiosInstance.get<QueryObject, APIResponse<ReportData>>(
    `/reports/total`,
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

export const getCompanies = async () => {
  return await axiosInstance.get<QueryObject, APIResponse<Company[]>>(
    `/companies`
  )
}

export const getCompanyVehicleDistanceStats = async (
  companyId: string,
  startDate: string,
  endDate: string,
  groupBy: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  return await axiosInstance.get<QueryObject, APIResponse<CompanyVehicleDistanceStats>>(
    `/reports/companies/${companyId}/vehicle-distance-stats`,
    { 
      params: {
        startDate,
        endDate,
        groupBy
      } 
    }
  )
}

export const getCompanyVehicleDurationStats = async (
  companyId: string,
  startDate: string,
  endDate: string,
  groupBy: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  return await axiosInstance.get<QueryObject, APIResponse<CompanyVehicleDurationStats>>(
    `/reports/companies/${companyId}/vehicle-duration-stats`,
    { 
      params: {
        startDate,
        endDate,
        groupBy
      } 
    }
  )
} 