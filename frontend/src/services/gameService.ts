// frontend/src/services/gameService.ts
import { api } from './api'

interface StartSessionResponse { sessionId: number }
interface SubmitScoreRequest {
  sessionId: number
  score: number
  height: number
  maxCombo: number
  platformsBroken: number
}
interface SubmitScoreResponse {
  scoreId: number
  score: number
  height: number
  maxCombo: number
  createdAt: string
}

export const gameService = {
  startSession: () => api.post<StartSessionResponse>('/game/session/start').then(r => r.data),
  submitScore: (req: SubmitScoreRequest) =>
    api.post<SubmitScoreResponse>('/game/session/submit', req).then(r => r.data),
}
