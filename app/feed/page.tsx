"use client";

import { useState, useEffect } from 'react';

interface FeedItem {
  id: string;
  type: "Large" | "Medium" | "Small";
  title: string;
  subtitle?: string;
  manager: string;
  content: string;
  tags: string[];
  image_url: string;
}

export default function Feed() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gradientColors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-emerald-400',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-pink-500',
    'from-green-400 to-cyan-400',
    'from-indigo-400 to-purple-400',
    'from-pink-400 to-rose-400',
    'from-teal-400 to-blue-400'
  ];

  const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradientColors.length);
    return gradientColors[randomIndex];
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('/api/feeds');
        if (!response.ok) {
          throw new Error('피드를 불러오는데 실패했습니다');
        }
        const data = await response.json();
        setFeeds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Today</h1>
        
        <div className="grid gap-6">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative aspect-[4/3]">
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex gap-2">
                    {feed.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-sm text-white font-medium tracking-wider bg-black/30 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <img
                  src={feed.image_url}
                  alt={feed.title}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"
                />
                <div className="absolute bottom-8 left-6 right-6 text-white">
                  <h2 className="text-3xl font-bold">{feed.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 line-clamp-2 flex-1 mr-4">
                    {feed.content}
                  </p>
                  <span 
                    className={`text-sm text-white px-3 py-1 rounded-full whitespace-nowrap bg-gradient-to-r ${getRandomGradient()}`}
                  >
                    {feed.manager}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 