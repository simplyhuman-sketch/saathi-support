const button = document.querySelector('#get-support');
const results = document.querySelector('#results');
const errorMessage = document.querySelector('#error-message');
const recommendations = {
  stress: ['Make the next ten minutes gentler', 'Try one slow breath out, then choose just one small thing that can wait until later.', '#resources-title'],
  anxiety: ['Come back to what is around you', 'Name five things you can see and feel your feet on the ground. If the worry keeps returning, talking with someone can help.', 'tel:14416'],
  low: ['You deserve company with this', 'A small connection can be a start. Consider telling someone you trust that today feels hard, or reach a trained listener.', 'tel:14416'],
  sleep: ['Give yourself a softer landing', 'If sleep is not coming, a quiet low light activity may feel kinder than trying to force it. You can also talk through what is getting in the way.', 'tel:14416'],
  talk: ['A trained person can listen', 'Tele-MANAS offers free, round-the-clock mental health support in India. You can call and ask to speak in a language that feels comfortable.', 'tel:14416'],
};
const topics = {
  stress: 'feeling stressed or overwhelmed', anxiety: 'feeling worried or on edge', low: 'feeling low or disconnected',
  sleep: 'finding it hard to sleep', talk: 'wanting someone to talk to',
};

function localReflection(selected) {
  if (!selected.length) return 'There is no perfect way to describe how things feel. You can take this one step at a time, and you deserve support even if you are not sure where to begin.';
  const words = selected.map((key) => topics[key]).filter(Boolean);
  return `You’ve shared that you’re ${words.join(' and ')}. That can be a lot to hold. You deserve care at your own pace, and it’s okay to start with one small next step.`;
}

button.addEventListener('click', async () => {
  const selected = [...document.querySelectorAll('#mood-options input:checked')].map((input) => input.value);
  const aiConsent = document.querySelector('#ai-consent').checked;
  errorMessage.hidden = true;
  button.disabled = true;
  button.innerHTML = 'Finding a next step… <span aria-hidden="true">·</span>';

  let reflection = localReflection(selected);
  if (aiConsent && selected.length) {
    try {
      const response = await fetch('/api/reflection', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selected }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload.reflection === 'string' && payload.reflection.length < 600) reflection = payload.reflection;
      }
    } catch { /* The private local reflection is the fallback. */ }
  }

  const preferred = selected.find((key) => key !== 'talk') || selected[0] || 'talk';
  const [title, copy, link] = recommendations[preferred];
  document.querySelector('#reflection').textContent = reflection;
  document.querySelector('#rec-title').textContent = title;
  document.querySelector('#rec-copy').textContent = copy;
  const recLink = document.querySelector('#rec-link');
  recLink.href = link;
  recLink.textContent = link.startsWith('tel:') ? 'Call Tele-MANAS 14416 →' : 'See small steps below →';
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'center' });
  button.disabled = false;
  button.innerHTML = 'Find a next step <span aria-hidden="true">→</span>';
});

document.querySelector('#restart').addEventListener('click', () => {
  document.querySelectorAll('#mood-options input').forEach((input) => { input.checked = false; });
  document.querySelector('#ai-consent').checked = false;
  results.hidden = true;
  document.querySelector('#checkin-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
