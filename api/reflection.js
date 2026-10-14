const allowedTopics = new Set(['stress', 'anxiety', 'low', 'sleep', 'talk']);

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const topics = request.body?.topics;
  if (!Array.isArray(topics) || topics.length > 5 || topics.some((topic) => !allowedTopics.has(topic))) {
    return response.status(400).json({ error: 'Please select from the available check-in topics.' });
  }
  if (!topics.length) return response.status(400).json({ error: 'Select a topic first.' });
  if (!process.env.GEMINI_API_KEY) return response.status(503).json({ error: 'AI reflection is not configured' });

  try {
    const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You write a brief, warm, non-clinical reflection for a mental wellness support navigation prototype in India. Reflect the selected topics without diagnosing, assessing risk, suggesting treatment, or claiming to be a therapist. Do not ask questions. Do not invent facts. Use 1 or 2 sentences, under 55 words. Remind the user they deserve support. If the user has selected feeling low, be especially gentle. Output only the reflection.' }] },
        contents: [{ parts: [{ text: `Selected check-in topics: ${topics.join(', ')}.` }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 100 },
      }),
    });
    if (!upstream.ok) return response.status(502).json({ error: 'AI reflection is unavailable' });
    const data = await upstream.json();
    const reflection = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join(' ').trim();
    if (!reflection) return response.status(502).json({ error: 'AI reflection is unavailable' });
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).json({ reflection: reflection.slice(0, 600) });
  } catch {
    return response.status(502).json({ error: 'AI reflection is unavailable' });
  }
}
