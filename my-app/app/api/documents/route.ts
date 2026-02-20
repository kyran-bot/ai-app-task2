import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      );
    }

    // 创建唯一的文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const uniqueFileName = `${timestamp}-${randomString}-${fileName}`;

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传文件到Supabase Storage（使用服务端密钥）
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .upload(`uploads/${uniqueFileName}`, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase上传错误:', error);
      return NextResponse.json(
        { error: `上传失败: ${error.message}` },
        { status: 400 }
      );
    }

    // 获取文件的公开URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('documents').getPublicUrl(`uploads/${uniqueFileName}`);

    return NextResponse.json(
      {
        success: true,
        fileUrl: publicUrl,
        fileName: uniqueFileName,
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 列出存储中的所有文件（使用服务端密钥）
    const { data: files, error } = await supabaseAdmin.storage
      .from('documents')
      .list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      });

    if (error) {
      return NextResponse.json(
        { error: `获取文件列表失败: ${error.message}` },
        { status: 400 }
      );
    }

    // 为每个文件生成公开URL
    const filesWithUrls = files?.map((file) => {
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from('documents').getPublicUrl(`uploads/${file.name}`);

      return {
        ...file,
        publicUrl,
      };
    }) || [];

    return NextResponse.json(
      {
        success: true,
        files: filesWithUrls,
        total: filesWithUrls.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('获取文件列表错误:', error);
    return NextResponse.json(
      { error: '获取文件列表失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json(
        { error: '文件名未提供' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.storage
      .from('documents')
      .remove([`uploads/${fileName}`]);

    if (error) {
      return NextResponse.json(
        { error: `删除失败: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: '文件已删除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除文件错误:', error);
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    );
  }
}
