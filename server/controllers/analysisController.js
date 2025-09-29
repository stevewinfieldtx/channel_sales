const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

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

function buildCandidateUrls(input) {
  try {
    const u = new URL(input.includes('://') ? input : `https://${input}`);
    const hosts = new Set([u.hostname]);
    if (u.hostname.startsWith('www.')) hosts.add(u.hostname.replace(/^www\./, ''));
    else hosts.add(`www.${u.hostname}`);
    const schemes = new Set([u.protocol.replace(':', '') || 'https']);
    schemes.add(u.protocol === 'http:' ? 'https' : 'http');
    const out = [];
    for (const scheme of schemes) {
      for (const host of hosts) {
        out.push(`${scheme}://${host}${u.pathname || ''}${u.search || ''}`);
      }
    }
    return Array.from(new Set(out));
  } catch (_) {
    return [input];
  }
}

async function fetchAndExtract(url) {
  const candidates = buildCandidateUrls(url);
  for (const candidate of candidates) {
    try {
      const page = await axios.get(candidate, {
        timeout: 15000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        validateStatus: s => s >= 200 && s < 400
      });
      const $ = cheerio.load(page.data);
      $('script,noscript,style,svg,iframe,canvas,link,meta,nav,footer').remove();
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      if (text && text.length > 200) {
        return text.slice(0, 12000);
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.message || 'request failed';
      console.warn(`[fetchAndExtract] ${candidate} -> ${status || ''} ${msg}`);
      continue;
    }
  }
  return '';
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
    const extractedText = await fetchAndExtract(url);

    const sysPreamble = extractedText
      ? `You are an analyst. Use the provided extracted website text to ground your analysis. If text is thin or generic, acknowledge limitations.`
      : `You are an analyst. You have not been provided page text. Infer from the URL and inputs without claiming to have fetched the site.`;

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