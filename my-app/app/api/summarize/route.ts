import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    // Download file from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .download(`uploads/${fileName}`);

    if (error || !data) {
      return NextResponse.json(
        { error: `Failed to retrieve file: ${error?.message}` },
        { status: 400 }
      );
    }

    // Convert blob to text
    const text = await data.text();

    // Generate AI summary (simple text processing)
    const summary = generateAISummary(text, fileName);

    return NextResponse.json(
      {
        success: true,
        fileName,
        summary,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

function generateAISummary(text: string, fileName: string): string {
  // Extract key information from text
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length === 0) {
    return 'Unable to generate summary from this file format.';
  }

  // Score sentences by keyword frequency
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: { [key: string]: number } = {};
  
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
    'who', 'when', 'where', 'why', 'how', 'as', 'if', 'so', 'it'
  ]);

  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Select sentences with highest-frequency words
  const scoredSentences = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
    return { sentence: sentence.trim(), score, index };
  });

  // Get top 3 sentences (or fewer if text is short)
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
    .sort((a, b) => a.index - b.index)
    .map(s => s.sentence);

  // Format the summary
  const fileType = fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT';
  const summary = `
AI SUMMARY - ${fileType} File

${topSentences.join(' ')}

Key Statistics:
- Total Words: ${words.length}
- Total Sentences: ${sentences.length}
- Average Words per Sentence: ${Math.round(words.length / sentences.length)}
- File Size: ${(text.length / 1024).toFixed(2)} KB
  `.trim();

  return summary;
}
