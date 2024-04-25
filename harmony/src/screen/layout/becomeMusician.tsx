import guide1 from "../../resource/Guide1.png";
import guide2 from "../../resource/Guide2.png";
import guide3 from "../../resource/Guide3.png";
import guide4 from "../../resource/guide4.png";
import guide5 from "../../resource/guide5.png";
import guide6 from "../../resource/guide6.png";
import guide7 from "../../resource/guide7.png";
import '../../style/question.css';
export default function becomeMusician(){
    return(
        <div>
            <h1>Become musician</h1>
            <h2>Step 1: Login</h2>
            <div>
                <img src={guide1} className='guide'/>
                <img src={guide2} className='guide'/>
                <img src={guide3} className='guide'/>
                <h2>Step 2: Apply for begin a musician</h2>
                <img src={guide4} className='guide'/>
                <img src={guide5} className='guide'/>
                <img src={guide6} className='guide'/>
                <img src={guide7} className='guide'/>
            </div>
            
        </div>
    )
}
