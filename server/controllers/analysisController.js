const axios = require('axios');
const cheerio = require('cheerio');

function selectModelFromEnv() {
  const candidateKeys = [
    'OPENROUTER_MODEL',
    'MODEL',
    'LLM_MODEL',
    'OPENROUTER_DEFAULT_MODEL'
  ];
  for (const key of candidateKeys) {
    if (process.env[key]) return process.env[key];
  }
  return null;
}

exports.startAnalysis = async (url, companyType, subindustries) => {
  try {
    const model = selectModelFromEnv();
    if (!model) {
      throw new Error('Model not configured. Please set OPENROUTER_MODEL in the environment.');
    }
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY.');
    }

    // Attempt to fetch and extract site text
    let extractedText = '';
    try {
      const page = await axios.get(url, { timeout: 12000, headers: { 'User-Agent': 'Mozilla/5.0 channel-sales-bot' } });
      const $ = cheerio.load(page.data);
      $('script,noscript,style,svg,iframe,canvas,link,meta,nav,footer').remove();
      extractedText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 8000);
    } catch (_) {
      // Non-fatal; we proceed with URL-only context
    }

    const sysPreamble = extractedText
      ? `You are an analyst. Use the provided extracted website text to ground your analysis. If text is thin, say so.`
      : `You are an analyst. No browsing is available. The URL is for reference; do not claim to have visited it.`;

    const userContent = extractedText
      ? `Analyze this B2B solution for a ${companyType}. URL: ${url}\n\nExtracted Text:\n${extractedText}\n\nFocus on industry fit for: ${subindustries?.join(', ') || 'N/A'}.`
      : `Analyze this B2B solution for a ${companyType}. URL: ${url}. Focus on industry fit for: ${subindustries?.join(', ') || 'N/A'}.`;

    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model,
      messages: [
        { role: 'system', content: sysPreamble },
        { role: 'user', content: userContent }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(error?.message || 'OpenRouter API request failed');
  }
};