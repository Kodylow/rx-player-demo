import { useEffect, useRef } from 'react';
import { usePlayer } from '@/lib/playerContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { MediaSource } from '@/lib/types';

interface MediaPlayerProps {
  source: MediaSource;
  onError: (error: string) => void;
}

export function MediaPlayer({ source, onError }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { player, playerState, volume, currentTime, duration, isFullscreen } = usePlayer();

  useEffect(() => {
    if (!player || !source) return;

    const loadContent = async () => {
      try {
        if (source.type === 'url') {
          await player.loadVideo({
            url: source.content as string,
            transport: source.transport || 'dash',
            autoPlay: true,
          });
        } else if (source.type === 'file') {
          const file = source.content as File;
          const url = URL.createObjectURL(file);
          await player.loadVideo({
            url,
            transport: 'directfile',
            autoPlay: true,
          });
        }
      } catch (error) {
        onError(`Failed to load media: ${(error as Error).message}`);
      }
    };

    loadContent();
  }, [source, player]);

  // Handle playback controls
  const togglePlay = () => {
    if (!player) return;
    if (playerState === "PLAYING") {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (player.getVolume() === 0) {
      player.unMute();
    } else {
      player.mute();
    }
  };

  const handleVolumeChange = (value: number) => {
    if (!player) return;
    player.setVolume(value);
  };

  const handleSeek = (value: number) => {
    if (!player) return;
    player.seekTo(value);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={([value]) => handleSeek(value)}
          />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="text-white hover:bg-white/20"
          >
            {playerState === "PLAYING" ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {volume === 0 ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
            <div className="w-24">
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => handleVolumeChange(value / 100)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}