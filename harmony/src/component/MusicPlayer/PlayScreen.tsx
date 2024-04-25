import React, {useState, useEffect, useRef, useContext} from 'react';
import { useSpring, animated } from 'react-spring';
import '../style/PlayScreen.css';
import ReactPlayer from 'react-player/lazy';
import Lyric from 'lyric-parser';
import PlayerContext from "../../store/PlayerContext";
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import CustomerMusicPlayer from './CustomerMusicPlayer';

type LyricLine = {
    time: number;
    txt: string;
}

function PlayScreen() {
    const playerStore = PlayerContext;

    const songUrl = playerStore.currentSong.S3Music;
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLine, setCurrentLine] = useState(0);

    function lyricHandler({ lineNum, txt }: { lineNum: number, txt: string }) {
        setCurrentLine(lineNum);
    }
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const LRC_URL = playerStore.currentSong.S3Lrc;
    //是否正在拖动进度条
    const [isSeeking, setIsSeeking] = useState(false);
    const [props, set] = useSpring(() => ({ scrollTop: 0 }));
    const scrollTopRef = useRef(null);
    const playerRef = useRef<ReactPlayer>(null);

    function handlePlay() {
        runInAction(() => {
            playerStore.playing = true
        })
        console.log('playingg')
        setIsSeeking(false);

    }

    function handlePause() {
        runInAction(() => {
            playerStore.playing = false
        })
        console.log('stopping')
        setIsSeeking(false);
    }

    useEffect(() => {
        if (playerRef.current && playerStore.playedSeconds > 0) {
            playerRef.current.seekTo(playerStore.playedSeconds + 0.3, 'seconds');
        }
        fetch(LRC_URL)
            .then(response => {
                console.log("Received lyric data:");
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {

                const lyric = new Lyric(data, lyricHandler);
                setLyrics(lyric.lines);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error.message);
            });

    }, []);


    useEffect(() => {
        if (lyricsContainerRef.current) {
            const lyricsElement = lyricsContainerRef.current;
            const lineHeight = 24;
            const targetScrollTop = currentLine * lineHeight - (lineHeight * 3);
            set({ scrollTop: targetScrollTop });
        }
    }, [currentLine, set]);


    useEffect(() => {
        if (scrollTopRef.current && lyricsContainerRef.current) {
            lyricsContainerRef.current.scrollTop = scrollTopRef.current;
        }
    }, [props.scrollTop]);

    useEffect(() => {
        // console.log('Played seconds:', playerStore.playedSeconds);
        let activeLine = 0;
        for (let i = 0; i < lyrics.length; i++) {
            if (playerStore.playedSeconds * 1000 >= lyrics[i].time) {
                activeLine = i;

            }
        }
        setCurrentLine(activeLine);
    }, [playerStore.playedSeconds, lyrics]);





    return (
        <div className="playscreen-container">
            <div className="playscreen-circle">
                <img src={playerStore.currentSong.S3Image} />
            </div>
            <CustomerMusicPlayer
                styleType="A"
                songUrl={songUrl}
                handlePlay={handlePlay}
                handlePause={handlePause}
                onReady={function (): void {

                } }
                onSeek={function (): void {
                    setIsSeeking(true);
                    console.log('onSeek triggered');
                } }
                onSeeked={function (): void {
                    if (playerRef.current) {
                        const currentSeconds = playerRef.current.getCurrentTime();
                        runInAction(() => {
                            playerStore.playedSeconds = currentSeconds;
                        });
                    }
                    setIsSeeking(false);
                    console.log('onSeeked triggered');
                } }
                onStart={function (): void {
                    setIsSeeking(false);
                    console.log('onStart triggered');
                } }
                onEnded={function (): void {
                    setIsSeeking(false);
                    console.log('onEnded triggered');
                } }
                playerRef={playerRef}     />


            <div className="playscreen-lyrics" ref={lyricsContainerRef}>
                {lyrics.map((line, index) => (
                    <div
                        key={index}
                        className={`lyric-line ${index === currentLine ? 'current' : ''}`}
                    >
                        {line.txt}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default observer(PlayScreen)
