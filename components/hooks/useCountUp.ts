
import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end: number, duration: number, isVisible: boolean, decimals: number = 0) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    
    const counter = () => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const currentCount = end * progress;
      
      setCount(Number(currentCount.toFixed(decimals)));

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(counter);
      }
    };

    if (isVisible) {
       rafRef.current = requestAnimationFrame(counter);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, isVisible, decimals]);

  return count;
};
