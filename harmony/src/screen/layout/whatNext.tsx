import guide1 from "../../resource/Guide1.png";
import guide2 from "../../resource/Guide2.png";
import guide3 from "../../resource/Guide3.png";
import guide4 from "../../resource/guide4.png";
import guide5 from "../../resource/guide5.png";
import guide6 from "../../resource/guide6.png";
import guide7 from "../../resource/guide7.png";
import guide8 from "../../resource/guide8.png";
import guide9 from "../../resource/guide9.png";
import '../../style/question.css';

export default function whatNext(){
    return(
    <div>
        <h1>What next?</h1>
        <h2>Upload your music</h2>
        <img src={guide8} className='guide'/>
        <img src={guide9} className='guide'/>
    </div>)
}
