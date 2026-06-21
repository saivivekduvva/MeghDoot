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
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, end, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (val) => setValue(val)
    });
    return () => controls.stop();
  }, [end, duration]);

  return (
    <span>{prefix}{value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>
  );
}
