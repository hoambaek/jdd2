import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: feeds, error } = await supabase
      .from('feeds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(feeds);
  } catch (error) {
    console.error('피드 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '피드를 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('받은 데이터:', body);

    const { data, error } = await supabase
      .from('feeds')
      .insert([
        {
          type: body.type,
          title: body.title,
          manager: body.manager,
          content: body.content,
          tags: body.tags,
          image_url: body.image_url
        }
      ])
      .select();

    if (error) {
      console.error('Supabase 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('저장된 데이터:', data);
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('서버 에러:', error);
    return NextResponse.json(
      { error: '피드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Supabase에서 해당 피드 삭제
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
