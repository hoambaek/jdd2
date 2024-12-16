import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <main className="flex flex-col items-center gap-8 relative z-10">
        <div className="flex flex-col items-center">
          <Image
            className="mb-2"
            src="/logo.png"
            alt="로고"
            width={250}
            height={146}
            priority
          />
          <h1 className="text-base font-small text-white text-center">
            장덕동성당 중고등부 앱
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] 
            transition-colors flex items-center justify-center hover:bg-[#f2f2f2] 
            dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-12 px-8 min-w-[160px]
            bg-white/70 backdrop-blur-sm"
            href="/login"
          >
            로그인
          </a>

          <a
            className="rounded-full border border-solid border-transparent 
            transition-colors flex items-center justify-center bg-foreground/70 
            text-background hover:bg-[#383838] dark:hover:bg-[#ccc] 
            text-sm sm:text-base h-12 px-8 min-w-[160px] backdrop-blur-sm"
            href="/signup"
          >
            회원가입
          </a>
        </div>
      </main>
    </div>
  );
}
