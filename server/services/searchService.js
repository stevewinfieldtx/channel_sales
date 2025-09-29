const axios = require('axios');

function pickProvider() {
  const explicit = (process.env.SEARCH_PROVIDER || '').toLowerCase();
  if (explicit === 'brave') return 'brave';
  if (explicit === 'serpapi') return 'serpapi';
  if (process.env.BRAVE_API_KEY) return 'brave';
  if (process.env.SERPAPI_API_KEY) return 'serpapi';
  return null;
}

async function searchBrave(query, { count = 5 } = {}) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) throw new Error('BRAVE_API_KEY not set');
  const url = 'https://api.search.brave.com/res/v1/web/search';
  const res = await axios.get(url, {
    params: { q: query, count },
    headers: {
      'X-Subscription-Token': apiKey,
      'Accept': 'application/json'
    },
    timeout: 10000
  });
  const items = res.data?.web?.results || [];
  return items.map(i => ({
    title: i.title,
    url: i.url,
    snippet: i.description || i.snippet || ''
  }));
}

async function searchSerpAPI(query, { count = 5 } = {}) {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) throw new Error('SERPAPI_API_KEY not set');
  const url = 'https://serpapi.com/search.json';
  const res = await axios.get(url, {
    params: { engine: 'google', q: query, num: count, api_key: apiKey },
    timeout: 10000
  });
  const items = res.data?.organic_results || [];
  return items.map(i => ({
    title: i.title,
    url: i.link,
    snippet: i.snippet || ''
  }));
}

async function searchWeb(query, opts = {}) {
  const provider = pickProvider();
  if (!provider) throw new Error('No search provider configured');
  if (provider === 'brave') return searchBrave(query, opts);
  return searchSerpAPI(query, opts);
}

module.exports = { searchWeb };


