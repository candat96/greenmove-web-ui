import { useState, useEffect, useCallback } from 'react';
import { 
  LeaderboardResponse,
  getCompetitionLeaderboard
} from '@/services/competition';
import { message } from 'antd';

export const useCompetitionDetail = (competitionId: string) => {
  // État pour le classement (y compris les informations de compétition)
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);



  // Récupérer le classement avec pagination
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
      console.error('Erreur lors du chargement du classement:', error);
      message.error('Impossible de charger le classement');
    } finally {
      setLeaderboardLoading(false);
    }
  }, [competitionId, currentPage, pageSize]);



  // Gestionnaire pour les changements de page
  const handlePageChange = useCallback((page: number, size?: number) => {
    fetchLeaderboard(page, size || pageSize);
  }, [fetchLeaderboard, pageSize]);

  // Actualiser les données
  const refreshData = useCallback(async () => {
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Effets
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
