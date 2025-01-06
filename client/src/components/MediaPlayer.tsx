import { useEffect, useRef, useState } from 'react';
import RxPlayer from 'rx-player';
import type { MediaSource } from '@/lib/types';
import { Waveform } from './Waveform';

interface MediaPlayerProps {
  source: MediaSource;
  onError: (error: string) => void;
}

export function MediaPlayer({ source, onError }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<RxPlayer | null>(null);
  const [isAudio, setIsAudio] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string>('');

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
        let url: string;
        if (source.type === 'url') {
          url = source.content as string;
        } else {
          const file = source.content as File;
          url = URL.createObjectURL(file);
          // Check if it's an audio file
          setIsAudio(file.type.startsWith('audio/'));
        }

        setMediaUrl(url);

        await playerRef.current.loadVideo({
          url,
          transport: source.transport || 'directfile',
          autoPlay: true,
        });
      } catch (error) {
        onError(`Failed to load media: ${(error as Error).message}`);
      }
    };

    loadContent();
  }, [source]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {isAudio ? (
        <div className="p-4">
          <Waveform 
            url={mediaUrl}
            onError={onError}
          />
          <video
            ref={videoRef}
            className="hidden"
            controls
            playsInline
          />
        </div>
      ) : (
        <div className="aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            playsInline
          />
        </div>
      )}
    </div>
  );
}