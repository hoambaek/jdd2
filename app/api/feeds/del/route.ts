import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('feeds')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: '피드가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('피드 삭제 중 오류:', error);
    return NextResponse.json(
      { error: '피드 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}