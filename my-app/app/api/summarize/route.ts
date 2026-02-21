import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key is not configured' },
        { status: 500 }
      );
    }

    // 从 Supabase Storage 下载文件
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .download(`uploads/${fileName}`);

    if (error || !data) {
      return NextResponse.json(
        { error: `Failed to retrieve file: ${error?.message}` },
        { status: 400 }
      );
    }

    // 提取文本内容（假设文件为纯文本；若为其他格式需额外解析）
    let text = await data.text();

    // 限制文本长度，避免超出 API 令牌限制
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    // 调用 DeepSeek API 生成摘要
    const summary = await generateDeepSeekSummary(text);

    return NextResponse.json(
      {
        success: true,
        fileName,
        summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Summarize error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function generateDeepSeekSummary(text: string): Promise<string> {
  const completion = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional document summarization assistant. Summarize human-readable content only. Provide a concise summary (3-6 sentences) capturing main points, purpose, and key facts. Respond in English.',
      },
      {
        role: 'user',
        content: `Summarize the following document content: ${text}`,
      },
    ],
    max_tokens: 500,
  });

  if (completion.choices && completion.choices[0] && completion.choices[0].message) {
    return completion.choices[0].message.content || '';
  }

  throw new Error('Unexpected response format from DeepSeek API');
}