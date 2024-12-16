"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";

interface FeedItem {
  id: string;
  type: "Large" | "Medium" | "Small";
  title: string;
  manager: string;
  content: string;
  tags: string[];
  image_url: string;
}

export default function AdminPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [newFeed, setNewFeed] = useState<Partial<FeedItem>>({
    type: "Large",
    tags: [],
  });
  const router = useRouter();

  const feedTypes = [
    { type: "Large", size: "320x468px" },
    { type: "Medium", size: "320x366px" },
    { type: "Small", size: "320x200px" },
  ];

  const availableTags = ["이벤트", "공부", "캠프", "미사", "연습"];

  const feedSizes = {
    Large: { width: 320, height: 468 },
    Medium: { width: 320, height: 366 },
    Small: { width: 320, height: 200 }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `feeds/${fileName}`;

        const { data, error } = await supabase.storage
          .from('feeds')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('feeds')
          .getPublicUrl(filePath);

        console.log('생성된 이미지 URL:', publicUrl);

        setNewFeed({ ...newFeed, image_url: publicUrl });
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = newFeed.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setNewFeed({ ...newFeed, tags: updatedTags });
  };

  const fetchFeeds = async () => {
    try {
      const response = await fetch('/api/feeds');
      if (!response.ok) throw new Error('피드 조회 실패');
      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      console.error('피드 조회 중 오류:', error);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFeed.image_url) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    try {
      const feedData = {
        type: newFeed.type,
        title: newFeed.title,
        manager: newFeed.manager,
        content: newFeed.content,
        tags: newFeed.tags || [],
        image_url: newFeed.image_url
      };

      console.log('전송하는 데이터:', feedData);

      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '피드 등록에 실패했습니다');
      }

      const responseData = await response.json();
      console.log('서버 응답:', responseData);  // 서버 응답 확인용

      await fetchFeeds();
      setNewFeed({ type: "Large", tags: [] });
      alert('피드가 성공적으로 등록되었습니다!');
    } catch (error: unknown) {
      console.error('등록 실패 상세:', error);
      if (error instanceof Error) {
        alert(`피드 등록 실패: ${error.message}`);
      } else {
        alert('피드 등록 중 알 수 없는 오류가 발생했습니다');
      }
    }
  };

  const handleEditFeed = (feed: FeedItem) => {
    router.push(`/admin/feed/edit/${feed.id}`);
  };

  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm('정말로 이 피드를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/feeds/del`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: feedId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '피드 삭제에 실패했습니다');
      }

      await fetchFeeds(); // 피드 목록 새로고침
      alert('피드가 성공적으로 삭제되었습니다');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert(error instanceof Error ? error.message : '피드 삭제 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">활동 추가</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block mb-2 font-semibold">피드 종류 선택</label>
          <select
            className="w-full p-2 border rounded"
            value={newFeed.type}
            onChange={(e) => setNewFeed({ ...newFeed, type: e.target.value as "Large" | "Medium" | "Small" })}
          >
            {feedTypes.map((feed) => (
              <option key={feed.type} value={feed.type}>
                {feed.type} ({feed.size})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">이미지 업로드</label>
          <div
            className="border-2 border-dashed rounded-lg text-center cursor-pointer"
            style={{
              width: `${feedSizes[newFeed.type || 'Large'].width}px`,
              height: `${feedSizes[newFeed.type || 'Large'].height}px`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {newFeed.image_url ? (
              <img
                src={newFeed.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p>클릭하여 이미지 업로드</p>
                <p className="text-sm text-gray-500 mt-2">
                  {feedSizes[newFeed.type || 'Large'].width} x {feedSizes[newFeed.type || 'Large'].height}px
                </p>
              </div>
            )}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">제목</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newFeed.title || ""}
            onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">담당자</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newFeed.manager || ""}
            onChange={(e) => setNewFeed({ ...newFeed, manager: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">내용</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={newFeed.content || ""}
            onChange={(e) => setNewFeed({ ...newFeed, content: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">태그 선택</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded ${
                  newFeed.tags?.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          등록하기
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">등록된 피드 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeds.map((feed) => (
            <div key={feed.id} className="border rounded p-4">
              {feed.image_url && (
                <img
                  src={feed.image_url}
                  alt={feed.title}
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <h3 className="font-bold">{feed.title}</h3>
              <p className="text-sm text-gray-600">담당자: {feed.manager}</p>
              <p className="text-sm text-gray-600">타입: {feed.type}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {feed.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex-1"
                  onClick={() => handleEditFeed(feed)}
                >
                  수정하기
                </button>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                  onClick={() => handleDeleteFeed(feed.id)}
                >
                  삭제하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
