const fmtPct = (n) => (n * 100).toFixed(2) + '%';
const fmtNum = (n) => Number(n).toLocaleString();

function renderTable(el, rows, columns) {
  const head = '<tr>' + columns.map((c) => `<th>${c.label}</th>`).join('') + '</tr>';
  const body = rows.map((r) => '<tr>' + columns.map((c) => {
    const v = c.get(r);
    return `<td${c.num ? ' class="num"' : ''}>${v}</td>`;
  }).join('') + '</tr>').join('');
  el.innerHTML = head + body;
}

function renderChart(canvasId, rows) {
  const top = rows.slice(0, 8);
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: top.map((r) => r.label),
      datasets: [{
        label: 'Avg engagement rate',
        data: top.map((r) => r.avg_engagement_rate * 100),
        backgroundColor: '#6ea8ff',
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#888' }, grid: { color: '#1f1f23' } },
        y: { ticks: { color: '#c8c8cc' }, grid: { display: false } },
      },
    },
  });
}

async function load() {
  const res = await fetch('/api/stats');
  const stats = await res.json();

  document.getElementById('meta').textContent =
    `${stats.analyzed_posts} of ${stats.total_posts} posts analyzed. Engagement rate = (likes + comments + shares) / views, posts under 1k views excluded from rate.`;

  const labelCols = [
    { label: 'Label',     get: (r) => r.label, num: false },
    { label: 'Posts',     get: (r) => r.count, num: true },
    { label: 'Avg views', get: (r) => fmtNum(r.avg_views), num: true },
    { label: 'Eng rate',  get: (r) => fmtPct(r.avg_engagement_rate), num: true },
  ];

  renderChart('hooksChart',   stats.hooks);
  renderTable(document.getElementById('hooksTable'),   stats.hooks.slice(0, 10), labelCols);
  renderChart('formatsChart', stats.formats);
  renderTable(document.getElementById('formatsTable'), stats.formats.slice(0, 10), labelCols);
  renderChart('ctasChart',    stats.ctas);
  renderTable(document.getElementById('ctasTable'),    stats.ctas.slice(0, 10), labelCols);

  renderTable(document.getElementById('topPosts'), stats.top_posts, [
    { label: 'Creator',  get: (r) => `@${r.handle}`, num: false },
    { label: 'Platform', get: (r) => r.platform,     num: false },
    { label: 'Hook',     get: (r) => r.hook_label || '', num: false },
    { label: 'Format',   get: (r) => r.content_format_label || '', num: false },
    { label: 'Views',    get: (r) => fmtNum(r.views), num: true },
    { label: 'Eng rate', get: (r) => fmtPct(r.engagement_rate), num: true },
    { label: 'Link',     get: (r) => `<a href="${r.post_url}" target="_blank">view</a>`, num: false },
  ]);
}

load().catch((err) => {
  document.getElementById('meta').textContent = 'Failed to load stats: ' + err.message;
});
