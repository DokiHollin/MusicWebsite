import { request } from "../request";
// Download Function
function DownloadAudio(audioInfo: any) {
  if (audioInfo.S3Music) {
    let url = audioInfo.S3Music;
    let a = document.createElement('a');
    a.href = url;
    a.download = `${audioInfo.music_name} - ${audioInfo.artist_name}.mp3`;
    a.click();
  }
}

export default DownloadAudio;

