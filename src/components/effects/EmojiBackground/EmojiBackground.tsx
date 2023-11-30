import { useEffect, useState } from 'react';
import { useReward } from 'react-rewards';

const SingleEmoji = ({ id }: { id: number }) => {
  const { reward, isAnimating } = useReward(`emoji${id}`, 'emoji', {
    lifetime: 200,
    spread: 360,
    startVelocity: 20,
    elementSize: 16,
    emoji: ['🍃', '🧪', '🥀', '🛸💜', '🎣', '✖️'],
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!isAnimating) {
          reward();
        }
      },
      Math.random() * 3000 + 500,
    ); // 0.5秒〜3秒の間隔で繰り返し

    return () => clearInterval(interval);
  }, [isAnimating, reward]);

  return (
    <div
      id={`emoji${id}`}
      style={{
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        zIndex: -1,
      }}
    />
  );
};

// 画面幅に応じて紙吹雪の数を決定する関数
function getEmojiCount(width: number = 0) {
  if (width > 1200) {
    // 大きな画面
    return 30;
  } else if (width > 768) {
    // 中程度の画面
    return 20;
  } else {
    // 小さな画面
    return 18;
  }
}

export const EmojiBackground = () => {
  const [confettiCount, setConfettiCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setConfettiCount(getEmojiCount(window.innerWidth));
    };

    // 初期化
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {Array.from({ length: confettiCount }).map((_, index) => (
        <SingleEmoji key={index} id={index} />
      ))}
    </>
  );
};
