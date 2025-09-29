const axios = require('axios');

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

    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model,
      messages: [{
        role: 'user',
        content: `Analyze this B2B solution for a ${companyType}: ${url}`
      }]
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