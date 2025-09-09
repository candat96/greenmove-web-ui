import axiosInstance from "./axios"
import { APIResponse, QueryObject } from "./types"

// Competition types and interfaces
export interface Competition {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  category: CompetitionCategory;
  objective: CompetitionObjective;
  status: CompetitionStatus;
  scope: CompetitionScope;
  participantCount: number;
  isJoined: boolean;
  banner?: string;
  rewards?: string;
  companies: CompetitionCompany[];
  config?: CompetitionConfig;
  baselinePeriodDays?: number;
  baselineStartDate?: string;
}

export interface CompetitionCompany {
  id: string;
  name: string;
}

export type CompetitionCategory = 
  | 'CO2' 
  | 'BICYCLE' 
  | 'WALKING' 
  | 'CAR' 
  | 'CAR_POOL' 
  | 'TRAIN' 
  | 'AIRPLANE' 
  | 'PUBLIC_TRANSPORT'
  | 'POINTS';

export type CompetitionObjective = 'HIGHEST' | 'LOWEST' | 'INCREASE_FROM_BASELINE' | 'DECREASE_FROM_BASELINE';

export type CompetitionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export type CompetitionScope = 'GLOBAL' | 'COMPANY';

// Filter interfaces
export interface CompetitionFilters {
  status?: CompetitionStatus;
  category?: CompetitionCategory;
  scope?: CompetitionScope;
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
  companyId?: string;
  page?: number;
  limit?: number;
}

// Leaderboard interfaces
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar?: string;
  totalScore: number;
  summary: CompetitionSummary;
  previousRank?: number;
  change?: number;
}

export interface CompetitionSummary {
  tripCount: number;
  totalDistance: number;
  totalCo2: number;
  totalPoints: number;
  totalDuration: number;
}

export interface CompetitionConfig {
  autoJoin: boolean;
  maxParticipants: number;
}

export interface LeaderboardResponse {
  competition: Competition;
  leaderboard: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  currentUserRank?: LeaderboardEntry;
  totalParticipants: number;
}

// My rank interface
export interface MyRankResponse {
  rank: number;
  totalScore: number;
  summary: CompetitionSummary;
  totalParticipants: number;
  previousRank?: number;
  change?: number;
}

// Competition stats interface
export interface CompetitionStats {
  totalCompetitions: number;
  activeCompetitions: number;
  joinedCompetitions: number;
  wonCompetitions: number;
}

// Create competition interface
export interface CreateCompetitionPayload {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  category: CompetitionCategory;
  objective: CompetitionObjective;
  scope: CompetitionScope;
  companyIds?: string[];
  rewards?: string;
  banner?: string;
  baselinePeriodDays?: number;
  baselineStartDate?: string;
}

// Join competition interface
export interface JoinCompetitionPayload {
  competitionId: string;
}

export interface JoinCompetitionResponse {
  success: boolean;
  message: string;
}

// Update competition status interface
export interface UpdateCompetitionStatusPayload {
  status: CompetitionStatus;
  reason: string;
}

export interface UpdateCompetitionStatusResponse {
  success: boolean;
  message: string;
  data?: Competition;
}

// API functions
export const getCompetitions = async (filters?: CompetitionFilters) => {
  return await axiosInstance.get<CompetitionFilters, APIResponse<Competition[]>>(
    `/competition`,
    { params: filters }
  )
}

export const getMyCompetitions = async (filters?: CompetitionFilters) => {
  return await axiosInstance.get<CompetitionFilters, APIResponse<Competition[]>>(
    `/competition/my-competitions`,
    { params: filters }
  )
}



export const getCompetitionLeaderboard = async (
  competitionId: string, 
  params?: { page?: number; limit?: number; offset?: number }
) => {
  return await axiosInstance.get<typeof params, LeaderboardResponse>(
    `/competition/${competitionId}/leaderboard`,
    { params }
  )
}

export const getMyRankInCompetition = async (competitionId: string) => {
  return await axiosInstance.get<void, MyRankResponse>(
    `/competition/${competitionId}/my-rank`
  )
}

export const getCompetitionStats = async () => {
  return await axiosInstance.get<void, CompetitionStats>(
    `/competition/stats`
  )
}

export const createCompetition = async (payload: CreateCompetitionPayload) => {
  return await axiosInstance.post<CreateCompetitionPayload, APIResponse<Competition>>(
    `/competition`,
    payload
  )
}

export const joinCompetition = async (payload: JoinCompetitionPayload) => {
  return await axiosInstance.post<JoinCompetitionPayload, JoinCompetitionResponse>(
    `/competition/join`,
    payload
  )
}

export const leaveCompetition = async (competitionId: string) => {
  return await axiosInstance.delete<void, JoinCompetitionResponse>(
    `/competition/${competitionId}/leave`
  )
}

export const updateCompetition = async (competitionId: string, payload: Partial<CreateCompetitionPayload>) => {
  return await axiosInstance.patch<Partial<CreateCompetitionPayload>, APIResponse<Competition>>(
    `/competition/${competitionId}`,
    payload
  )
}

export const deleteCompetition = async (competitionId: string) => {
  return await axiosInstance.delete<void, { success: boolean; message: string }>(
    `/competition/${competitionId}`
  )
}

export const getCompetitionById = async (competitionId: string) => {
  return await axiosInstance.get<void, APIResponse<Competition>>(
    `/competition/${competitionId}`
  )
}

export const updateCompetitionStatus = async (competitionId: string, payload: UpdateCompetitionStatusPayload) => {
  return await axiosInstance.patch<UpdateCompetitionStatusPayload, UpdateCompetitionStatusResponse>(
    `/competition/${competitionId}/status`,
    payload
  )
}
