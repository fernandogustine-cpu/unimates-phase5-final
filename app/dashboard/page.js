'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const { data } = await supabase
      .from('student_profiles')
      .select('*')
      .order('rating', { ascending: false })

    setStudents(data || [])
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Uni-Mates Chess Academy Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h2>Total Students</h2>
          <p className="text-2xl">{students.length}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded">
          <h2>Lessons</h2>
          <p className="text-2xl">0</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded">
          <h2>PGNs</h2>
          <p className="text-2xl">0</p>
        </div>

        <div className="bg-orange-500 text-white p-4 rounded">
          <h2>Puzzles</h2>
          <p className="text-2xl">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Student Rankings
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Level</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">
                  {student.full_name}
                </td>

                <td className="border p-2">
                  {student.rating}
                </td>

                <td className="border p-2">
                  {student.level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
