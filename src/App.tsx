// import { useCallback, useEffect, useRef, useState } from "react";
import { useCallback, useEffect, useState } from "react";
import Lucky777Game from "./components/Lucky777Game"
import { MusicPlayer } from "./components/GameMusic";
import LoadingScreen from "./components/LoadingScrean";
import { GAME_ASSETS, getAssetUrl } from "./config/gameconfig";
import { bootstrapGameStore, useGame, type GameStore } from "./hooks/useGameHook";

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => resolve();
  });
}

function getGameDetailsAssetUrls(gameDetails: GameStore["gameDetails"]) {
  return [
    ...(gameDetails?.options ?? []).map((option) => option.logo),
  ].map((path) => getAssetUrl(path));
}

function getUniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

async function preloadImageGroup(
  assets: string[],
  progressFrom: number,
  progressTo: number,
  setProgress: (value: number) => void,
) {
  const uniqueAssets = getUniqueUrls(assets);

  if (uniqueAssets.length === 0) {
    setProgress(progressTo);
    return;
  }

  let loaded = 0;

  await Promise.all(
    uniqueAssets.map((src) =>
      preloadImage(src).then(() => {
        loaded += 1;
        setProgress(
          progressFrom + Math.round((loaded / uniqueAssets.length) * (progressTo - progressFrom)),
        );
      }),
    ),
  );
}

async function preloadGameAssets(setProgress: (value: number) => void) {
  const logoSrc = getAssetUrl(GAME_ASSETS.loadingLogo);
  await preloadImage(logoSrc);
  setProgress(10);

  const gameStore = await bootstrapGameStore();
  setProgress(35);

  const staticAssets = [
    GAME_ASSETS.bg,
    GAME_ASSETS.gameBoard,
    GAME_ASSETS.rotated,
    GAME_ASSETS.cup,
    GAME_ASSETS.diamond,
    GAME_ASSETS.minusBtn,
    GAME_ASSETS.plusBtn,
    GAME_ASSETS.autoBtn,
    GAME_ASSETS.spinBtn,
  ].map((fileName) => getAssetUrl(fileName));
  const gameDetailsAssets = getGameDetailsAssetUrls(gameStore.gameDetails);

  await preloadImageGroup(
    [...staticAssets, ...gameDetailsAssets],
    35,
    100,
    setProgress,
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [audioUnlockVersion, setAudioUnlockVersion] = useState(0);
  const [hasAudioGesture, setHasAudioGesture] = useState(false);
  // const [roundId, setRoundId] = useState<number | null>(null);
  // const [isRoundRunning, setIsRoundRunning] = useState(false);
  // const [roundTime, setRoundTime] = useState(0);
  // const isAttemptingRoundRef = useRef(false);
  // const activeRoundIdRef = useRef<number | null>(null);
  const {
    // createRound,
    isMusicEnabled,
    isMusicSettingLoading,
    setMusicEnabled,
  } = useGame();
  const shouldRequestAudioUnlock =
    !isMusicSettingLoading &&
    isMusicEnabled &&
    !hasAudioGesture;

  const handleUnlockAudio = useCallback(() => {
    setHasAudioGesture(true);
    setAudioUnlockVersion((current) => current + 1);
  }, []);

  // const isRoundStartable = useCallback((remainingSeconds: number | undefined) => {
  //   if (remainingSeconds === undefined) {
  //     return false;
  //   }

  //   return remainingSeconds >= 7 && remainingSeconds < 39;
  // }, []);

  // const applyRoundState = useCallback((nextRoundId: number | null, nextRoundTime: number, running: boolean) => {
  //   activeRoundIdRef.current = nextRoundId;
  //   setRoundId(nextRoundId);
  //   setRoundTime(nextRoundTime);
  //   setIsRoundRunning(running);
  // }, []);

  // const attemptStartRound = useCallback(async () => {
  //   if (isAttemptingRoundRef.current) {
  //     return false;
  //   }

  //   isAttemptingRoundRef.current = true;

  //   try {
  //     const res = await createRound();
  //     if (!isRoundStartable(res?.remaining_seconds)) {
  //       return false;
  //     }

  //     if (activeRoundIdRef.current === res.round_no && isRoundRunning) {
  //       return true;
  //     }

  //     applyRoundState(res.round_no, res.remaining_seconds + 3, true);
  //     return true;
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   } finally {
  //     isAttemptingRoundRef.current = false;
  //   }
  // }, [applyRoundState, createRound, isRoundRunning, isRoundStartable]);

  // const handleRoundFinished = useCallback((finishedRoundId: number | null) => {
  //   if (finishedRoundId === null || activeRoundIdRef.current !== finishedRoundId) {
  //     return;
  //   }

  //   applyRoundState(null, 0, false);
  // }, [applyRoundState]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        await preloadGameAssets(setProgress);
        if (cancelled) {
          return;
        }


        // const [res] = await Promise.all([
        //   createRound(),
        //   bootstrapGameStore({ resetPendingBalanceDeduction: true }),
        // ]);
        // if (cancelled) {
        //   return;
        // }
        // if (!isRoundStartable(res?.remaining_seconds)) {
        //   applyRoundState(null, 0, false);
        // } else {
        //   applyRoundState(res.round_no, res.remaining_seconds + 3, true);
        // }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setProgress(100);
          setIsBootLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);
  // }, [applyRoundState, createRound, isRoundStartable]);

  // useEffect(() => {
  //   if (isBootLoading || isRoundRunning) {
  //     return;
  //   }

  //   const timer = window.setInterval(() => {
  //     void attemptStartRound();
  //   }, 1000);

  //   return () => window.clearInterval(timer);
  // }, [attemptStartRound, isBootLoading, isRoundRunning]);

  return (
    <div className="relative flex min-h-[100dvh] w-full items-end justify-center overflow-hidden">
      <MusicPlayer
        isMusicPlaying={!isMusicSettingLoading && isMusicEnabled}
        unlockVersion={audioUnlockVersion}
      />
      {isBootLoading ? (
        <LoadingScreen
          progress={progress}
          onUnlockAudio={handleUnlockAudio}
          showUnlockHint={shouldRequestAudioUnlock}
        />
      ) : (
        <div
          className="contents"
          onClick={shouldRequestAudioUnlock ? handleUnlockAudio : undefined}
          onTouchStart={shouldRequestAudioUnlock ? handleUnlockAudio : undefined}
        >
          <Lucky777Game
            // TodaysRoundId={roundId}
            // isRoundRunning={isRoundRunning}
            // RoundTime={roundTime}
            // onRoundFinished={handleRoundFinished}
            // onOpenResultMenu={() => undefined}
            // onCloseResultMenu={() => undefined}
            isMusicPlaying={isMusicEnabled}
            onToggleMusic={() => {
              void setMusicEnabled(!isMusicEnabled);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App
