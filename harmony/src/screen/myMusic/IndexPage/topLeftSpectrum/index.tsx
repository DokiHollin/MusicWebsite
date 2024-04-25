import React from 'react';
import './index.scss';
import TransparentBox1 from 'src/components/transparentBox1';
import PlayerContext from 'src/store/PlayerContext';
import { observer } from 'mobx-react';

interface TopLeftSpectrumState {
  isPlaying: boolean;
  analyser: AnalyserNode | null;
}

class TopLeftSpectrum extends React.Component<{}, TopLeftSpectrumState> {
  state: TopLeftSpectrumState = {
    isPlaying: true,
    analyser: null,
  };

  private canvasCtx: CanvasRenderingContext2D | null | undefined;
  private drawVisual: number = 0;
  private timer: NodeJS.Timer | undefined;
  private audioContext: AudioContext | undefined;
  private myFftSize: 256 = 256;
  private audioElement: HTMLAudioElement | null = null;
  IndexCanvas = React.createRef<HTMLCanvasElement>();

  componentDidMount() {
    this.initializeAudio();
    this.initializeCanvas();
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  initializeAudio() {
    this.audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = this.myFftSize;
    this.setState({ analyser });

    this.audioElement = new Audio(PlayerContext.currentSong.S3Music);
    const source = this.audioContext.createMediaElementSource(this.audioElement);
    source.connect(analyser);
    analyser.connect(this.audioContext.destination);
  }

  initializeCanvas() {
    if (this.IndexCanvas.current) {
      this.canvasCtx = this.IndexCanvas.current.getContext('2d');
      this.drawToDom(this.IndexCanvas.current, new Uint8Array(this.myFftSize / 2).fill(0));
    }
    if (this.state.analyser) {
      this.draw(this.state.analyser);
    }
  }

  handleCanvasClick = () => {
    if (this.audioElement) {
      if (this.state.isPlaying) {
        this.audioElement.pause();
        PlayerContext.playing = false;
        this.setState({ isPlaying: false });
        if (this.timer) clearInterval(this.timer);
      } else {
        this.audioContext?.resume().then(() => {
          this.audioElement?.play();
          PlayerContext.playing = true;
          this.setState({ isPlaying: true });
          this.draw(this.state.analyser!);
        });
      }
    }
  };

  draw = (analyser: AnalyserNode) => {
    const alt = analyser.frequencyBinCount;
   
    this.timer = setInterval(() => {
      let array = new Uint8Array(alt);
      analyser.getByteFrequencyData(array);
      if (this.IndexCanvas.current) {
        this.drawToDom(this.IndexCanvas.current, array);
      }
    }, 30);
  };

  drawToDom = (canvas: HTMLCanvasElement, arr: Uint8Array) => {
    let canvasCtx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const alt = arr.length;
    
    if (canvasCtx) {
      canvasCtx.clearRect(0, 0, w, h);
      let barW = (w / alt) * 0.9;
      let barH = 0;
      let x = 0;

      for (let i = 0; i < alt; i++) {
        barH = arr[i] + 30;
        canvasCtx.fillStyle = '#bce5ef';
        canvasCtx.fillRect(x, h / 2 - barH / 8, barW, barH / 4);
        x += barW + 3;
      }
    }
  };

  render() {
    return (
      <TransparentBox1>
        <div className="topleft_spectrum">
          <canvas
            id="IndexCanvas"
            className="index_canvas"
            ref={this.IndexCanvas}
            onClick={this.handleCanvasClick}
          ></canvas>
        </div>
      </TransparentBox1>
    );
  }
}

export default observer(TopLeftSpectrum);
