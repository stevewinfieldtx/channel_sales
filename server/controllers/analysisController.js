const axios = require('axios');

exports.startAnalysis = async (url, companyType, subindustries) => {
  try {
    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
      messages: [{
        role: 'user',
        content: `Analyze this B2B solution for a ${companyType}: ${url}`
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('OpenRouter API request failed');
  }
};