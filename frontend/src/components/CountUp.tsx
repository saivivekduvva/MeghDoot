import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({ end, duration = 2, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const storageKey = `animated_${end}`;
  const hasAnimated = sessionStorage.getItem(storageKey) === 'true';
  const [value, setValue] = useState(hasAnimated ? end : 0);

  useEffect(() => {
    if (hasAnimated || end === 0) {
      setValue(end);
      return;
    }

    const controls = animate(0, end, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (val) => setValue(val),
      onComplete: () => sessionStorage.setItem(storageKey, 'true')
    });
    return () => controls.stop();
  }, [end, duration, hasAnimated, storageKey]);

  return (
    <span>{prefix}{value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>
  );
}
