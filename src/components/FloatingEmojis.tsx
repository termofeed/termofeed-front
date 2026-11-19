import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FloatingEmojiItem {
  id: string;
  emoji: string;
  leftPercent: number;
  swayDistance: number;
}

interface FloatingEmojisProps {
  emojis: FloatingEmojiItem[];
  onComplete: (id: string) => void;
}

export const FloatingEmojis: React.FC<FloatingEmojisProps> = ({ emojis, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();

  // Se o usuário prefere movimento reduzido (RNF-015), não renderiza as partículas em movimento
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {emojis.map((item) => (
        <FloatingSingleEmoji
          key={item.id}
          item={item}
          onDone={() => onComplete(item.id)}
        />
      ))}
    </div>
  );
};

const FloatingSingleEmoji: React.FC<{
  item: FloatingEmojiItem;
  onDone: () => void;
}> = ({ item, onDone }) => {
  useEffect(() => {
    // Garante remoção após 2.5s se a animação não disparar onAnimationComplete
    const timer = setTimeout(onDone, 2600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="absolute bottom-16 text-3xl sm:text-4xl select-none"
      style={{ left: `${item.leftPercent}%` }}
      initial={{
        y: 20,
        x: 0,
        opacity: 0,
        scale: 0.6,
      }}
      animate={{
        y: -360,
        x: [0, item.swayDistance, -item.swayDistance, 0],
        opacity: [0, 1, 0.95, 0],
        scale: [0.6, 1.2, 1, 0.8],
      }}
      transition={{
        duration: 2.5,
        ease: 'easeOut',
      }}
      onAnimationComplete={onDone}
    >
      {item.emoji}
    </motion.div>
  );
};
