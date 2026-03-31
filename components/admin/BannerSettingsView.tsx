import React, { useState, useEffect } from 'react';

export interface BannerSettings {
  type: 'slide' | 'video';
  videoUrl: string;
  thumbUrl: string;
}

const STORAGE_KEY = 'vivaz_banner_settings';

const defaultSettings: BannerSettings = {
  type: 'slide',
  videoUrl: '',
  thumbUrl: '',
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
  return match ? match[1] : null;
}

const BannerSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<BannerSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSettings(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const videoId = settings.type === 'video' ? getYouTubeId(settings.videoUrl) : null;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Banner</h2>

      {/* Toggle tipo de banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de Banner</label>
        <div className="flex gap-3">
          <button
            onClick={() => setSettings(s => ({ ...s, type: 'slide' }))}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              settings.type === 'slide'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                <path d="M3 9h18" strokeWidth="2" />
              </svg>
              Banner Slide
            </div>
          </button>
          <button
            onClick={() => setSettings(s => ({ ...s, type: 'video' }))}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              settings.type === 'video'
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14v-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="6" width="12" height="12" rx="2" strokeWidth="2" />
              </svg>
              Banner Vídeo
            </div>
          </button>
        </div>
      </div>

      {/* Campos de vídeo */}
      {settings.type === 'video' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Link do vídeo (YouTube)
            </label>
            <input
              type="url"
              value={settings.videoUrl}
              onChange={e => setSettings(s => ({ ...s, videoUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {settings.videoUrl && !videoId && (
              <p className="text-red-500 text-xs mt-1">URL do YouTube inválida.</p>
            )}
            {videoId && (
              <p className="text-green-600 text-xs mt-1">ID do vídeo detectado: <span className="font-mono">{videoId}</span></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL da thumbnail (exibida enquanto o vídeo carrega)
            </label>
            <input
              type="url"
              value={settings.thumbUrl}
              onChange={e => setSettings(s => ({ ...s, thumbUrl: e.target.value }))}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Preview da thumbnail */}
          {settings.thumbUrl && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preview da thumbnail</p>
              <img
                src={settings.thumbUrl}
                alt="Thumbnail preview"
                className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      )}

      {settings.type === 'slide' && (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 mb-6 text-center text-gray-500 text-sm">
          O banner slide utilizará as imagens configuradas no painel de slides.
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={settings.type === 'video' && (!videoId || !settings.thumbUrl)}
        className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saved ? '✓ Salvo com sucesso!' : 'Salvar configurações'}
      </button>
      {settings.type === 'video' && (!videoId || !settings.thumbUrl) && (
        <p className="text-xs text-gray-400 mt-2">Preencha o link do vídeo e a thumbnail para salvar.</p>
      )}
    </div>
  );
};

export default BannerSettingsView;
export { STORAGE_KEY };
