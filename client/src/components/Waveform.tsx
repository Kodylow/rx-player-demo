import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  url: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export function Waveform({ url, onReady, onError }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      cursorColor: 'rgb(100, 0, 100)',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 60,
      normalize: true,
      partialRender: true,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      setIsLoading(false);
      onReady?.();
    });

    wavesurfer.on('error', (error) => {
      onError?.(error.message || 'Error loading audio waveform');
    });

    try {
      wavesurfer.load(url);
    } catch (error) {
      onError?.((error as Error).message || 'Error loading audio waveform');
    }

    return () => {
      wavesurfer.destroy();
    };
  }, [url]);

  return (
    <div className="w-full">
      {isLoading && (
        <div className="h-[60px] bg-muted animate-pulse rounded-md" />
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
