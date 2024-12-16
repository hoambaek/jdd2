"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface FeedItem {
  id: string;
  type: "Large" | "Medium" | "Small";
  title: string;
  manager: string;
  content: string;
  tags: string[];
  image_url: string;
}

const EditFeedPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [feed, setFeed] = useState<FeedItem | null>(null);
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

  useEffect(() => {
    const fetchFeed = async () => {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('피드 조회 실패:', error);
        return;
      }

      setFeed(data);
    };

    fetchFeed();
  }, [params.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && feed) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `feeds/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('feeds')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('feeds')
          .getPublicUrl(filePath);

        setFeed({ ...feed, image_url: publicUrl });
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    if (!feed) return;
    const currentTags = feed.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setFeed({ ...feed, tags: updatedTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feed) return;

    try {
      const { error } = await supabase
        .from('feeds')
        .update({
          type: feed.type,
          title: feed.title,
          manager: feed.manager,
          content: feed.content,
          tags: feed.tags,
          image_url: feed.image_url
        })
        .eq('id', feed.id);

      if (error) throw error;

      alert('피드가 성공적으로 수정되었습니다!');
      router.push('/admin/feed'); // 관리자 메인 페이지로 이동
    } catch (error) {
      console.error('수정 실패:', error);
      alert('피드 수정에 실패했습니다.');
    }
  };

  if (!feed) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">피드 수정</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block mb-2 font-semibold">피드 종류</label>
          <select
            className="w-full p-2 border rounded"
            value={feed.type}
            onChange={(e) => setFeed({ ...feed, type: e.target.value as "Large" | "Medium" | "Small" })}
          >
            {feedTypes.map((type) => (
              <option key={type.type} value={type.type}>
                {type.type} ({type.size})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">이미지</label>
          <div
            className="border-2 border-dashed rounded-lg text-center cursor-pointer"
            style={{
              width: `${feedSizes[feed.type].width}px`,
              height: `${feedSizes[feed.type].height}px`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {feed.image_url ? (
              <Image
                src={feed.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                width={feedSizes[feed.type].width}
                height={feedSizes[feed.type].height}
              />
            ) : (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p>클릭하여 이미지 업로드</p>
                <p className="text-sm text-gray-500 mt-2">
                  {feedSizes[feed.type].width} x {feedSizes[feed.type].height}px
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
            value={feed.title}
            onChange={(e) => setFeed({ ...feed, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">담당자</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={feed.manager}
            onChange={(e) => setFeed({ ...feed, manager: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">내용</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={feed.content}
            onChange={(e) => setFeed({ ...feed, content: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">태그</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded ${
                  feed.tags?.includes(tag)
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/feed')}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFeedPage; 