// frontend/src/services/leaderboardService.ts
import { api } from './api'

export interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  avatar: string | null
  score: number
  height: number
  maxCombo: number
  createdAt: string
}

export interface LeaderboardPage {
  periodId: number
  periodStart: string
  periodEnd: string
  periodStatus: string
  page: number
  totalPages: number
  entries: LeaderboardEntry[]
}

export const leaderboardService = {
  getCurrent: (page = 0, size = 20) =>
    api.get<LeaderboardPage>('/leaderboard/current', { params: { page, size } }).then(r => r.data),
  getPeriod: (periodId: number, page = 0, size = 20) =>
    api.get<LeaderboardPage>(`/leaderboard/period/${periodId}`, { params: { page, size } }).then(r => r.data),
}
