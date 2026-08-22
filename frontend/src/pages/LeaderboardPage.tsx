// frontend/src/pages/LeaderboardPage.tsx
import { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useLiveLeaderboard } from '../hooks/useLiveLeaderboard'

export function LeaderboardPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useLeaderboard(page)
  useLiveLeaderboard() // subscribes to /topic/leaderboard for live updates

  if (isLoading) return <div className="flex justify-center mt-16 text-lg">Loading…</div>
  if (isError || !data) return <div className="flex justify-center mt-16 text-red-600">Failed to load leaderboard.</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <p className="text-sm text-gray-500 mb-4">
        Period ends {new Date(data.periodEnd).toLocaleDateString()}
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left w-10">#</th>
            <th className="py-2 text-left">Player</th>
            <th className="py-2 text-right">Score</th>
            <th className="py-2 text-right">Height</th>
            <th className="py-2 text-right">Combo</th>
          </tr>
        </thead>
        <tbody>
          {data.entries.map(e => (
            <tr key={e.userId} className="border-b hover:bg-gray-50">
              <td className="py-2 font-mono">{e.rank}</td>
              <td className="py-2 font-medium">{e.username}</td>
              <td className="py-2 text-right">{e.score.toLocaleString()}</td>
              <td className="py-2 text-right">{e.height}m</td>
              <td className="py-2 text-right">×{e.maxCombo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-500">Page {page + 1} of {data.totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          disabled={page >= data.totalPages - 1}
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
