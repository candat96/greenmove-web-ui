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
  updateCompetitionStatus,
  CreateCompetitionPayload,
  UpdateCompetitionStatusPayload
} from '@/services/competition';
import { Pagination } from '@/services/types';
import { message } from 'antd';

export const useCompetitions = () => {
  // État pour la liste des compétitions
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  
  // État pour la pagination
  const [pagination, setPagination] = useState<Pagination | undefined>();
  
  // État pour les filtres
  const [filters, setFilters] = useState<CompetitionFilters>({});
  
  // État pour le chargement
  const [loading, setLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  // État pour le classement
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);
  
  // État pour le rang personnel
  const [myRank, setMyRank] = useState<MyRankResponse | null>(null);
  const [myRankLoading, setMyRankLoading] = useState<boolean>(false);
  
  // État pour les statistiques
  const [stats, setStats] = useState<CompetitionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Récupérer toutes les compétitions
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
      console.error('Erreur lors du chargement de la liste des compétitions:', error);
      message.error('Impossible de charger la liste des compétitions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Mettre à jour la compétition (Admin seulement)
  const handleUpdateCompetition = useCallback(async (competitionId: string, payload: Partial<CreateCompetitionPayload>) => {
    try {
      setEditLoading(competitionId);
      const response = await updateCompetition(competitionId, payload);
      message.success('Compétition mise à jour avec succès');
      // Actualiser les données
      await fetchCompetitions();
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la compétition:', error);
      message.error('Impossible de mettre à jour la compétition');
      throw error;
    } finally {
      setEditLoading(null);
    }
  }, [fetchCompetitions]);

  // Supprimer la compétition (Admin seulement)
  const handleDeleteCompetition = useCallback(async (competitionId: string) => {
    try {
      setDeleteLoading(competitionId);
      const response = await deleteCompetition(competitionId);
      if (response.success) {
        message.success(response.message || 'Compétition supprimée avec succès');
        // Actualiser les données
        await fetchCompetitions();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétition:', error);
      message.error('Impossible de supprimer la compétition');
    } finally {
      setDeleteLoading(null);
    }
  }, [fetchCompetitions]);

  // Mettre à jour le statut de la compétition (Admin seulement)
  const handleUpdateCompetitionStatus = useCallback(async (competitionId: string, payload: UpdateCompetitionStatusPayload) => {
    try {
      setStatusUpdateLoading(competitionId);
      const response = await updateCompetitionStatus(competitionId, payload);
      if (response.success) {
        message.success(response.message || 'Statut de la compétition mis à jour avec succès');
        // Actualiser les données
        await fetchCompetitions();
        return response.data;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la compétition:', error);
      message.error('Impossible de mettre à jour le statut de la compétition');
      throw error;
    } finally {
      setStatusUpdateLoading(null);
    }
  }, [fetchCompetitions]);

  // Récupérer le classement
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
      console.error('Erreur lors du chargement du classement:', error);
      message.error('Impossible de charger le classement');
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  // Récupérer le rang personnel
  const fetchMyRank = useCallback(async (competitionId: string) => {
    try {
      setMyRankLoading(true);
      const response = await getMyRankInCompetition(competitionId);
      setMyRank(response);
    } catch (error) {
      console.error('Erreur lors du chargement du rang personnel:', error);
      message.error('Impossible de charger le rang personnel');
    } finally {
      setMyRankLoading(false);
    }
  }, []);

  // Récupérer les statistiques personnelles
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getCompetitionStats();
      setStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      message.error('Impossible de charger les statistiques');
    } finally {
      setStatsLoading(false);
    }
  }, []);



  // Créer une nouvelle compétition
  const handleCreateCompetition = useCallback(async (payload: CreateCompetitionPayload) => {
    try {
      setLoading(true);
      const response = await createCompetition(payload);
      message.success('Compétition créée avec succès');
      // Actualiser les données
      await fetchCompetitions();
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la compétition:', error);
      message.error('Impossible de créer la compétition');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchCompetitions]);

  // Gestionnaires de pagination
  const onChangePagination = (page?: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      page,
      limit: pageSize,
    });
    fetchCompetitions(page, pageSize);
  };





  // Gestionnaires de filtres
  const updateFilters = useCallback((newFilters: CompetitionFilters) => {
    setFilters(newFilters);
  }, []);

  // Effets
  useEffect(() => {
    fetchCompetitions();
  }, [filters]);

  return {
    // Données
    competitions,
    leaderboard,
    myRank,
    stats,
    
    // Pagination
    pagination,
    
    // Filtres
    filters,
    updateFilters,
    
    // États de chargement
    loading,
    leaderboardLoading,
    myRankLoading,
    statsLoading,
    editLoading,
    deleteLoading,
    statusUpdateLoading,
    
    // Actions
    fetchCompetitions,
    fetchLeaderboard,
    fetchMyRank,
    fetchStats,
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    handleUpdateCompetitionStatus,
    
    // Gestionnaires de pagination
    onChangePagination,
  };
};