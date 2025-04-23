import { useState, useEffect, useCallback } from 'react';
import { getTotalReport, ReportData, ReportByTypeData, ReportByCompanyData } from '@/services/report';
import { Pagination } from '@/services/types';

export const useReport = () => {
  const [totalReport, setTotalReport] = useState<ReportData | null>(null);
  const [typeReport, setTypeReport] = useState<ReportByTypeData | null>(null);
  const [companyReport, setCompanyReport] = useState<ReportByCompanyData[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = dateRange 
        ? { startDate: dateRange[0], endDate: dateRange[1] } 
        : undefined;
        
      const response = await getTotalReport(params);
      setTotalReport(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tổng hợp:", error);
      setError("Không thể tải dữ liệu tổng hợp");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

 

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTotalReport(),
      ]);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  }, [fetchTotalReport]);

  const handleDateRangeChange = (dates: [string, string] | null) => {
    setDateRange(dates);
  };

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  return {
    totalReport,
    typeReport,
    companyReport,
    loading,
    error,
    dateRange,
    handleDateRangeChange,
    fetchTotalReport,
    fetchAllReports
  };
}; 