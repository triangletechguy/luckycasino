import { useCallback, useState } from "react";
import Lucky777Game from "./components/Lucky777Game";
import { MusicPlayer } from "./components/GameMusic";
import { useGame } from "./hooks/useGameHook";

function App() {
  const [audioUnlockVersion, setAudioUnlockVersion] = useState(0);
  const [hasAudioGesture, setHasAudioGesture] = useState(false);

  const {
    isMusicEnabled,
    isMusicSettingLoading,
    setMusicEnabled,
  } = useGame();

  const shouldRequestAudioUnlock =
    !isMusicSettingLoading && isMusicEnabled && !hasAudioGesture;

  const handleUnlockAudio = useCallback(() => {
    setHasAudioGesture(true);
    setAudioUnlockVersion((current) => current + 1);
  }, []);

  return (
    <div
      className="relative flex min-h-[100dvh] w-full items-end justify-center overflow-hidden"
      onClick={shouldRequestAudioUnlock ? handleUnlockAudio : undefined}
      onTouchStart={shouldRequestAudioUnlock ? handleUnlockAudio : undefined}
    >
      <MusicPlayer
        isMusicPlaying={!isMusicSettingLoading && isMusicEnabled}
        unlockVersion={audioUnlockVersion}
      />

      <Lucky777Game
        isMusicPlaying={isMusicEnabled}
        onToggleMusic={() => {
          void setMusicEnabled(!isMusicEnabled);
        }}
      />
    </div>
  );
}

export default App;