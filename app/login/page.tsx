"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      // 로그인 성공 시 feed 페이지로 이동
      router.push('/feed');
      
    } catch (error) {
      console.error('로그인 오류:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('로그인에 실패했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">로그인</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => window.history.back()} 
            className="text-gray-600 hover:text-gray-800"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
} 