import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import RxPlayer from "rx-player";

interface PlayerContextType {
  player: RxPlayer | null;
  playerState: string;
  isLive: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  isFullscreen: boolean;
  audioBitrates: number[];
  videoBitrates: number[];
  audioTracks: any[];
  textTracks: any[];
}

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  playerState: "STOPPED",
  isLive: false,
  volume: 1,
  duration: 0,
  currentTime: 0,
  isFullscreen: false,
  audioBitrates: [],
  videoBitrates: [],
  audioTracks: [],
  textTracks: [],
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player] = useState(() => new RxPlayer());
  const [playerState, setPlayerState] = useState("STOPPED");
  const [isLive, setIsLive] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioBitrates, setAudioBitrates] = useState<number[]>([]);
  const [videoBitrates, setVideoBitrates] = useState<number[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [textTracks, setTextTracks] = useState<any[]>([]);

  useEffect(() => {
    // Set up event listeners
    player.addEventListener("playerStateChange", (state) => {
      setPlayerState(state);

      // Update available tracks and bitrates when content is loaded
      if (state === "LOADED") {
        setAudioBitrates(
          player.getAvailableAudioTracks().map(track => 
            track.bitrate || 0
          )
        );
        setVideoBitrates(
          player.getCurrentRepresentations()?.video?.map(rep => 
            rep.bitrate
          ) || []
        );
        setAudioTracks(player.getAvailableAudioTracks());
        setTextTracks(player.getAvailableTextTracks());
        setIsLive(player.isLive());
        setDuration(player.getMaximumPosition() || 0);
      }
    });

    player.addEventListener("positionUpdate", ({ position }) => {
      setCurrentTime(position);
    });

    player.addEventListener("volumeChange", ({ volume }) => {
      setVolume(volume);
    });

    // Update fullscreen state through browser API since RxPlayer doesn't provide an event
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      player.dispose();
    };
  }, [player]);

  return (
    <PlayerContext.Provider
      value={{
        player,
        playerState,
        isLive,
        volume,
        duration,
        currentTime,
        isFullscreen,
        audioBitrates,
        videoBitrates,
        audioTracks,
        textTracks,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);