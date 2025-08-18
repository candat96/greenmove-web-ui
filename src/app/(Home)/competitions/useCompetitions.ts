import { useState, useEffect, useCallback } from 'react';
import { 
  Competition, 
  CompetitionFilters, 
  LeaderboardResponse, 
  MyRankResponse, 
  CompetitionStats,
  getCompetitions,
  getCompetitionLeaderboard,
  getMyRankInCompetition,
  getCompetitionStats,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  CreateCompetitionPayload
} from '@/services/competition';
import { Pagination } from '@/services/types';
import { message } from 'antd';

export const useCompetitions = () => {
  // State cho danh sách cuộc thi
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  
  // State cho pagination
  const [pagination, setPagination] = useState<Pagination | undefined>();
  
  // State cho filters
  const [filters, setFilters] = useState<CompetitionFilters>({});
  
  // State cho loading
  const [loading, setLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // State cho leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);
  
  // State cho rank cá nhân
  const [myRank, setMyRank] = useState<MyRankResponse | null>(null);
  const [myRankLoading, setMyRankLoading] = useState<boolean>(false);
  
  // State cho thống kê
  const [stats, setStats] = useState<CompetitionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Fetch tất cả cuộc thi
  const fetchCompetitions = useCallback(async (page = 1, limit = 20, customFilters?: CompetitionFilters) => {
    try {
      setLoading(true);
      const payload = {
        ...filters,
        ...customFilters,
        page,
        limit,
      };
      const response = await getCompetitions(payload);
      setPagination(response.pagination || {});
      setCompetitions(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cuộc thi:', error);
      message.error('Không thể tải danh sách cuộc thi');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cập nhật cuộc thi (Admin only)
  const handleUpdateCompetition = useCallback(async (competitionId: string, payload: Partial<CreateCompetitionPayload>) => {
    try {
      setEditLoading(competitionId);
      const response = await updateCompetition(competitionId, payload);
      message.success('Cập nhật cuộc thi thành công');
      // Refresh data
      await fetchCompetitions();
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật cuộc thi:', error);
      message.error('Không thể cập nhật cuộc thi');
      throw error;
    } finally {
      setEditLoading(null);
    }
  }, [fetchCompetitions]);

  // Xóa cuộc thi (Admin only)
  const handleDeleteCompetition = useCallback(async (competitionId: string) => {
    try {
      setDeleteLoading(competitionId);
      const response = await deleteCompetition(competitionId);
      if (response.success) {
        message.success(response.message || 'Xóa cuộc thi thành công');
        // Refresh data
        await fetchCompetitions();
      }
    } catch (error) {
      console.error('Lỗi khi xóa cuộc thi:', error);
      message.error('Không thể xóa cuộc thi');
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchCompetitions]);



  // Fetch bảng xếp hạng
  const fetchLeaderboard = useCallback(async (
    competitionId: string, 
    page = 1, 
    limit = 20, 
    offset = 0
  ) => {
    try {
      setLeaderboardLoading(true);
      const response = await getCompetitionLeaderboard(competitionId, { page, limit, offset });
      setLeaderboard(response);
    } catch (error) {
      console.error('Lỗi khi tải bảng xếp hạng:', error);
      message.error('Không thể tải bảng xếp hạng');
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  // Fetch rank cá nhân
  const fetchMyRank = useCallback(async (competitionId: string) => {
    try {
      setMyRankLoading(true);
      const response = await getMyRankInCompetition(competitionId);
      setMyRank(response);
    } catch (error) {
      console.error('Lỗi khi tải thứ hạng cá nhân:', error);
      message.error('Không thể tải thứ hạng cá nhân');
    } finally {
      setMyRankLoading(false);
    }
  }, []);

  // Fetch thống kê cá nhân
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getCompetitionStats();
      setStats(response);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
      message.error('Không thể tải thống kê');
    } finally {
      setStatsLoading(false);
    }
  }, []);



  // Tạo cuộc thi mới
  const handleCreateCompetition = useCallback(async (payload: CreateCompetitionPayload) => {
    try {
      setLoading(true);
      const response = await createCompetition(payload);
      message.success('Tạo cuộc thi thành công');
      // Refresh data
      await fetchCompetitions();
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo cuộc thi:', error);
      message.error('Không thể tạo cuộc thi');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCompetitions]);

  // Pagination handlers
  const onChangePagination = (page?: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      page,
      limit: pageSize,
    });
    fetchCompetitions(page, pageSize);
  };





  // Filter handlers
  const updateFilters = useCallback((newFilters: CompetitionFilters) => {
    setFilters(newFilters);
  }, []);

  // Effects
  useEffect(() => {
    fetchCompetitions();
  }, [filters]);

  return {
    // Data
    competitions,
    leaderboard,
    myRank,
    stats,
    
    // Pagination
    pagination,
    
    // Filters
    filters,
    updateFilters,
    
    // Loading states
    loading,
    leaderboardLoading,
    myRankLoading,
    statsLoading,
    editLoading,
    deleteLoading,
    
    // Actions
    fetchCompetitions,
    fetchLeaderboard,
    fetchMyRank,
    fetchStats,
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    
    // Pagination handlers
    onChangePagination,
  };
};