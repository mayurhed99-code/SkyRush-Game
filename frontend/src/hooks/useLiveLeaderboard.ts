// frontend/src/hooks/useLiveLeaderboard.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

/**
 * Opens a STOMP WebSocket connection to /topic/leaderboard.
 * On every live-score event the leaderboard React Query cache is invalidated,
 * triggering a background refetch so the UI stays fresh.
 */
export function useLiveLeaderboard() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/leaderboard', () => {
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        })
      },
    })
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [queryClient])
}
