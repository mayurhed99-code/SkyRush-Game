// frontend/src/hooks/useLeaderboard.ts
import { useQuery } from '@tanstack/react-query'
import { leaderboardService } from '../services/leaderboardService'

export function useLeaderboard(page = 0, size = 20) {
  return useQuery({
    queryKey: ['leaderboard', 'current', page, size],
    queryFn: () => leaderboardService.getCurrent(page, size),
    refetchInterval: 30_000, // poll every 30s as a fallback to WebSocket
    staleTime: 10_000,
  })
}
