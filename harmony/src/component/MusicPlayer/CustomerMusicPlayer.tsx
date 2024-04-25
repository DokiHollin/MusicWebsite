// CustomReactPlayer.tsx
import { runInAction } from 'mobx';
import React from 'react';
import ReactPlayer from 'react-player';
import PlayerContext from "../../store/PlayerContext";
import { useRef } from 'react';
import { observer } from 'mobx-react-lite';

const playerStore = PlayerContext;
type PlayerProps = {
    styleType: 'A' | 'B';
    songUrl: string;
    handlePlay: () => void;
    handlePause: () => void;
    onReady: () => void;
    onSeek: () => void;
    onSeeked: () => void;
    onStart: () => void;
    onEnded: () => void;
    playerRef: any;
  // ... 可以根据需要添加其他props
};


const CustomReactPlayer: React.FC<PlayerProps> = ({ styleType,
    songUrl,
    handlePlay,
    handlePause,
    onReady,
    onSeek,
    onSeeked,
    onStart,
    onEnded,
    playerRef,
    ...otherProps }) => {
  const commonProps = {

    // ref={playerRef}
    // url={songUrl}
    // controls={false}
    // width="0"
    // height="0"
    // playing={playerStore.playing}
    // volume={playerStore.volume}
    // style={{ display: 'none' }}
    // progressInterval={100}


    ref: playerRef,
    url: songUrl,
    progressInterval: 100,
    playing: playerStore.playing,
    volume: playerStore.volume,
    onPlay: handlePlay,
    onPause: handlePause,
    onReady,
    onSeek,
    onSeeked,
    onStart,
    onEnded,
    onDuration: (duration:number) => {
      runInAction(() => {
        playerStore.duration = duration;
      });
    },
    onProgress: ({ playedSeconds }: { playedSeconds: number }) => {
        runInAction(() => {
          playerStore.playedSeconds = playedSeconds;
        });
    },

    // ...其他通用props
  };

  const playerStyles = {
    A: {
      ...commonProps,
      controls: true,
      width: "400px",
      height: "50px",
    },
    B: {
      ...commonProps,
      controls: false,
      width: "0",
      height: "0",
      style: { display: 'none' }
    }
  };

  const currentStyle = playerStyles[styleType];

  return <ReactPlayer {...currentStyle} {...otherProps} />;
}

export default observer(CustomReactPlayer);

