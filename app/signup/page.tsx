"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    baptismal: "",
    userType: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 6) {
      setStep(step + 1);
      return;
    }

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      // 1. 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            baptismal_name: formData.baptismal,
            user_type: formData.userType
          }
        }
      });

      if (authError) {
        throw new Error(`인증 오류: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('사용자 데이터를 받지 못했습니다.');
      }

      // 2. 프로필 정보 저장
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          baptismal_name: formData.baptismal,
          user_type: formData.userType
        });

      if (profileError) {
        throw new Error(`프로필 저장 오류: ${profileError.message}`);
      }

      // 3. 자동 로그인
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(`로그인 오류: ${signInError.message}`);
      }

      router.push('/signup/complete');

    } catch (error) {
      console.error('회원가입 오류:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl mb-4">이메일을 입력해주세요</h2>
            <div>
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
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl mb-4">이름을 입력해주세요</h2>
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl mb-4">세례명을 입력해주세요</h2>
            <div>
              <input
                type="text"
                id="baptismal"
                name="baptismal"
                value={formData.baptismal}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl mb-4">Step 3: 당신은 누구신가요?</h2>
            <div>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="j1">중1</option>
                <option value="j2">중2</option>
                <option value="j3">중3</option>
                <option value="h1">고1</option>
                <option value="h2">고2</option>
                <option value="h3">고3</option>
                <option value="teacher">선생님</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl mb-4">비밀번호를 입력해주세요</h2>
            <div>
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
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-xl mb-4">비밀번호를 한번 더 입력해주세요</h2>
            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">회원가입</h1>
        
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* 배경 바 */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
            
            {/* 진행 바 */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-lime-500 transition-all duration-300 -z-5"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            ></div>

            {/* 단계 원형 표시 */}
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${step >= num ? 'bg-lime-500 text-white' : 'bg-gray-200'}
                  transition-colors duration-300 z-10`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStep()}

          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                이전
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition-colors"
            >
              {step < 6 ? "다음" : "가입하기"}
            </button>
          </div>
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