import React, { useEffect } from 'react';
import 'src/style/login/bubble.css';

const BubbleEffect: React.FC = () => {
    const bubbleContainer = document.createElement('div');
    document.body.appendChild(bubbleContainer);
    useEffect(() => {
        const bubbleCreate = () => {
            const bubble = document.createElement('span');
            bubble.className = 'bubble';  // 更新了类名
            let r = Math.random() * 5 + 25;
            bubble.style.width = r + 'px';
            bubble.style.height = r + 'px';
            bubble.style.left = Math.random() * window.innerWidth + 'px';
            bubbleContainer.append(bubble);
            setTimeout(() => {
                bubble.remove();
            }, 4000);
        };

        const intervalId = setInterval(() => {
            bubbleCreate();
        }, 200);

        return () => {
            clearInterval(intervalId);
            bubbleContainer.remove();  // 在组件卸载时移除泡泡容器
        };
    }, []);

    return null;
};

export default BubbleEffect;

