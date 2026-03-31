import React, { useState, useEffect, useRef } from 'react';
import { BannerSettings, STORAGE_KEY } from './admin/BannerSettingsView';

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
  return match ? match[1] : null;
}

const VideoBanner: React.FC = () => {
  const [settings, setSettings] = useState<BannerSettings | null>(null);
  const [thumbVisible, setThumbVisible] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: BannerSettings = JSON.parse(raw);
        setSettings(parsed);
      } catch {}
    }
  }, []);

  if (!settings || settings.type !== 'video') return null;

  const videoId = getYouTubeId(settings.videoUrl);
  if (!videoId) return null;

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="w-full relative overflow-hidden bg-black" style={{ aspectRatio: '16/9', maxHeight: '500px' }}>
      {/* YouTube iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Banner vídeo"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={() => {
          // Fade out thumbnail após o iframe carregar
          setTimeout(() => setThumbVisible(false), 800);
        }}
        className="absolute inset-0 w-full h-full border-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Thumbnail overlay */}
      {settings.thumbUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: thumbVisible ? 1 : 0, pointerEvents: 'none' }}
        >
          <img
            src={settings.thumbUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default VideoBanner;
