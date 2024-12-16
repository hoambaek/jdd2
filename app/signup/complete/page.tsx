"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function SignUpComplete() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // 창 크기 초기화
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // 창 크기 변경 감지
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={500}
        recycle={false}
        colors={[
          '#FF0000', // 빨강
          '#FF7F00', // 주황
          '#FFFF00', // 노랑
          '#00FF00', // 초록
          '#0000FF', // 파랑
          '#4B0082', // 남색
          '#9400D3', // 보라
          '#FF1493', // 핫핑크
          '#00FFFF', // 하늘색
          '#FFD700', // 골드
          '#FF69B4', // 분홍
          '#32CD32', // 라임
          '#8A2BE2', // 블루바이올렛
          '#FF4500', // 오렌지레드
          '#00CED1', // 다크터콰이즈
        ]}
        gravity={0.9}
        tweenDuration={5000}
      />
      
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8">
          축하해요!<br />
          <span className="text-xl font-normal">회원가입이 완료되었어요.</span>
        </h1>
        
        <button
          onClick={() => router.push('/feed')}
          className="w-full bg-lime-500 text-white py-3 rounded-lg hover:bg-lime-600 transition-colors text-lg font-semibold"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
