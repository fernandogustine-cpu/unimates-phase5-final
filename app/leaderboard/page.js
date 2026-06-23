"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Leaderboard() {
 const [players, setPlayers] = useState([]);

 useEffect(() => {
   loadLeaderboard();
 }, []);

 async function loadLeaderboard() {
   const { data } = await supabase
     .from("puzzle_attempts")
     .select("*");

   const grouped = {};

   (data || []).forEach((row) => {
     const name = row.student_name || "Guest Student";

     if (!grouped[name]) {
       grouped[name] = {
         student_name: name,
         attempts: 0,
         correct: 0,
         score: 0,
       };
     }

     grouped[name].attempts++;

     if (row.is_correct) {
       grouped[name].correct++;
       grouped[name].score += 10;
     }
   });

   const leaderboard = Object.values(grouped)
     .map((player) => ({
       ...player,
       accuracy:
         player.attempts > 0
           ? Math.round(
               (player.correct / player.attempts) * 100
             )
           : 0,
     }))
     .sort((a, b) => b.score - a.score);

   setPlayers(leaderboard);
 }

 return (
   <div style={{ padding: "30px" }}>
     <h1>🏆 Uni-Mates Leaderboard</h1>

     <table
       style={{
         width: "100%",
         borderCollapse: "collapse",
       }}
     >
       <thead>
         <tr>
           <th>Rank</th>
           <th>Student</th>
           <th>Score</th>
           <th>Accuracy</th>
         </tr>
       </thead>

       <tbody>
         {players.map((player, index) => (
           <tr key={player.student_name}>
             <td>{index + 1}</td>
             <td>{player.student_name}</td>
             <td>{player.score}</td>
             <td>{player.accuracy}%</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 );
}
