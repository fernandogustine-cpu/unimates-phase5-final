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
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    setVideos(data || []);
  }

  return (
    <Shell title="Videos">
      <h1>Uni-Mates Chess Academy Video Library</h1>

      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            background: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '10px'
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
          >
            Watch Video
          </a>
        </div>
      ))}
    </Shell>
  );
}
