'use client';

import { useEffect, useState } from 'react';
import Shell from '../../components/Shell';
import { supabase } from '../../lib/supabaseClient';

function getEmbedUrl(url) {
  if (!url) return '';

  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

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
            marginBottom: '25px',
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

          <iframe
            width="100%"
            height="360"
            src={getEmbedUrl(video.youtube_url)}
            title={video.title}
            frameBorder="0"
            allowFullScreen
            style={{
              borderRadius: '10px',
              marginTop: '15px'
            }}
          />
        </div>
      ))}
    </Shell>
  );
}
