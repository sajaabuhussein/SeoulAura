import React, { useEffect, useState } from 'react';

export const SakuraPetals = () => {
  const [petals, setPetals] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: `${10 + Math.random() * 15}px`,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura bg-cherry-pink/40 rounded-full"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            borderRadius: '100% 0% 100% 0% / 100% 0% 100% 0%',
          }}
        />
      ))}
    </>
  );
};
