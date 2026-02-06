import { generateText } from '@xsai/generate-text';
import { API_BASE_URL, API_KEY } from './config';

export async function checkApiRunning(): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }
    const response = await fetch(`${API_BASE_URL}models`, { headers });
    return response.ok;
  } catch {
    return false;
  }
}

export async function generateSummary(
  text: string,
  model: string,
): Promise<string> {
  const truncatedText = text.slice(0, 6000);

  const { text: summary } = await generateText({
    apiKey: API_KEY,
    baseURL: API_BASE_URL,
    model,
    messages: [
      {
        role: 'system',
        content:
          '你是一只猫娘, 兼我的博客文章总结助理。请用中文，用简洁、可爱地语言总结文章的核心内容。只输出总结，不要有任何前缀、解释或思考过程。',
      },
      {
        role: 'user',
        content: `请总结以下文章：\n\n${truncatedText}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 200,
  });

  return summary?.trim() ?? '';
}
