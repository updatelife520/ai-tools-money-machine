import React, { useState, useEffect, useRef } from 'react';
import mediaConfig from '../config/media.json';

interface MediaConfig {
  background: {
    type: string;
    src?: string;
    fallback: {
      type: string;
      colors: string[];
    };
    particles: {
      enabled: boolean;
      count: number;
      color: string;
    };
  };
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    playlist: Array<{
      name: string;
      src: string;
      duration: string;
    }>;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

const MediaManager: React.FC = () => {
  const [config, setConfig] = useState<MediaConfig>(mediaConfig as MediaConfig);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (config.music.enabled && config.music.autoplay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % config.music.playlist.length;
    setCurrentTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = currentTrack === 0 ? config.music.playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
  };

  const uploadBackground = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig(prev => ({
        ...prev,
        background: {
          ...prev.background,
          type: 'video',
          src: url
        }
      }));
    }
  };

  const uploadMusic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig(prev => ({
        ...prev,
        music: {
          ...prev.music,
          playlist: [
            ...prev.music.playlist,
            {
              name: file.name,
              src: url,
              duration: '0:00'
            }
          ]
        }
      }));
    }
  };

  return (
    <>
      {/* 音频播放器 */}
      {config.music.enabled && (
        <audio 
          ref={audioRef}
          loop={config.music.loop}
          src={config.music.playlist[currentTrack]?.src}
        />
      )}

      {/* 背景渲染 */}
      <div className="fixed inset-0 -z-10">
        {config.background.type === 'video' && config.background.src ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={config.background.src} />
          </video>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.background.fallback.colors.join(' ')}`}></div>
        )}
        
        {/* 粒子效果 */}
        {config.background.particles.enabled && (
          <div className="absolute inset-0">
            {[...Array(config.background.particles.count)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                <div className={`w-1 h-1 bg-${config.background.particles.color}-400 rounded-full shadow-lg shadow-${config.background.particles.color}-400/50`}></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 音乐控制面板 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <span className="text-base">{isPlaying ? "🎵" : "🔇"}</span>
        </button>

        {showControls && (
          <div className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-md rounded-xl p-4 w-64 border border-white/20">
            <div className="text-white mb-3">
              <div className="text-sm font-semibold mb-1">
                {config.music.playlist[currentTrack]?.name}
              </div>
              <div className="text-xs text-blue-200">
                {config.music.playlist[currentTrack]?.duration}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={prevTrack}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
              >
                ⏮️
              </button>
              <button
                onClick={toggleMusic}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white"
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <button
                onClick={nextTrack}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
              >
                ⏭️
              </button>
            </div>

            {/* 上传音乐 */}
            <label className="block">
              <span className="w-full text-center px-3 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 cursor-pointer block">
                📁 上传音乐
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={uploadMusic}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* 管理面板 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowControls(!showControls)}
          className="px-3 py-2 bg-black/60 backdrop-blur-md text-white text-sm rounded-lg hover:bg-black/80 border border-white/20"
        >
          ⚙️ 媒体设置
        </button>

        {showControls && (
          <div className="absolute top-12 left-0 bg-black/80 backdrop-blur-md rounded-xl p-4 w-80 border border-white/20">
            <h3 className="text-white font-semibold mb-3">媒体设置</h3>
            
            {/* 背景设置 */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm mb-2">背景视频</label>
              <label className="block">
                <span className="w-full text-center px-3 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 cursor-pointer block">
                  📹 上传背景视频
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={uploadBackground}
                  className="hidden"
                />
              </label>
            </div>

            {/* 主题颜色 */}
            <div className="mb-4">
              <label className="block text-blue-200 text-sm mb-2">主题颜色</label>
              <div className="flex gap-2">
                {['blue', 'purple', 'green', 'red', 'yellow'].map(color => (
                  <button
                    key={color}
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: color }
                    }))}
                    className={`w-8 h-8 bg-${color}-500 rounded-full border-2 ${
                      config.theme.primaryColor === color ? 'border-white' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 粒子效果开关 */}
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-sm">粒子效果</span>
              <button
                onClick={() => setConfig(prev => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    particles: {
                      ...prev.background.particles,
                      enabled: !prev.background.particles.enabled
                    }
                  }
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  config.background.particles.enabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  config.background.particles.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MediaManager;