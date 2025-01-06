import { useEffect, useRef } from 'react';
import RxPlayer from 'rx-player';
import type { MediaSource } from '@/lib/types';

interface MediaPlayerProps {
  source: MediaSource;
  onError: (error: string) => void;
}

export function MediaPlayer({ source, onError }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<RxPlayer | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize RxPlayer
    const player = new RxPlayer({ videoElement: videoRef.current });
    playerRef.current = player;

    // Set up error handling
    player.addEventListener('error', (err) => {
      onError(`Playback error: ${err.message || 'Unknown error occurred'}`);
    });

    // Set up state change handling
    player.addEventListener('playerStateChange', (state) => {
      if (state === 'LOADED') {
        console.log('Content loaded successfully');
      }
    });

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !source) return;

    const loadContent = async () => {
      try {
        if (source.type === 'url') {
          await playerRef.current.loadVideo({
            url: source.content as string,
            transport: source.transport || 'dash',
            autoPlay: true,
          });
        } else if (source.type === 'file') {
          const file = source.content as File;
          const url = URL.createObjectURL(file);
          await playerRef.current.loadVideo({
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
  }, [source]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
      />
    </div>
  );
}
