// frontend/src/pages/HomePage.tsx
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="flex flex-col items-center mt-16 gap-4">
      <h1 className="text-3xl font-extrabold">SkyRush</h1>
      <Link to="/game" className="bg-blue-600 text-white rounded px-4 py-2">Play</Link>
      <Link to="/leaderboard" className="text-blue-600 underline">View leaderboard</Link>
    </div>
  )
}
