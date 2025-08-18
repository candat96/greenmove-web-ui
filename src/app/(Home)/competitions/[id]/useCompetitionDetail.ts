import { useState, useEffect, useCallback } from 'react';
import { 
  LeaderboardResponse,
  getCompetitionLeaderboard
} from '@/services/competition';
import { message } from 'antd';

export const useCompetitionDetail = (competitionId: string) => {
  // State cho bảng xếp hạng (bao gồm thông tin cuộc thi)
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);
  
  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);



  // Fetch bảng xếp hạng với phân trang
  const fetchLeaderboard = useCallback(async (page = currentPage, limit = pageSize) => {
    if (!competitionId) return;
    
    try {
      setLeaderboardLoading(true);
      const response = await getCompetitionLeaderboard(competitionId, { 
        page, 
        limit,
        offset: (page - 1) * limit 
      });
      setLeaderboard(response);
      setCurrentPage(page);
      setPageSize(limit);
    } catch (error) {
      console.error('Lỗi khi tải bảng xếp hạng:', error);
      message.error('Không thể tải bảng xếp hạng');
    } finally {
      setLeaderboardLoading(false);
    }
  }, [competitionId, currentPage, pageSize]);



  // Handler cho thay đổi trang
  const handlePageChange = useCallback((page: number, size?: number) => {
    fetchLeaderboard(page, size || pageSize);
  }, [fetchLeaderboard, pageSize]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Effects
  useEffect(() => {
    if (competitionId) {
      fetchLeaderboard();
    }
  }, [competitionId, fetchLeaderboard]);

  return {
    // Data
    competition: leaderboard?.competition || null,
    leaderboard,
    
    // Loading states
    leaderboardLoading,
    
    // Pagination
    currentPage,
    pageSize,
    
    // Actions
    fetchLeaderboard,
    handlePageChange,
    refreshData,
  };
};
