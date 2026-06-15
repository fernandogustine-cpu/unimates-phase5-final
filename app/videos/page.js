'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setVideos(data || []);
    }
  }

  return (
    <Shell title="Videos">
      <h1>Uni-Mates Chess Academy Video Library</h1>

      <p>
        Watch training videos from Coach Fernando and improve your chess skills.
      </p>

      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            background: '#ffffff',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <h2>{video.title}</h2>

          <p>
            <strong>Level:</strong> {video.level}
          </p>

          <p>
            <strong>Course:</strong> {video.course}
          </p>

          <p>{video.description}</p>

          <a
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#2563eb',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Watch Video
          </a>
        </div>
      ))}
    </Shell>
  );
}
