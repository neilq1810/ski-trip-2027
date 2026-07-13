// --- Tab switching ---
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// --- RSVP, backed by GitHub Issues on this repo ---
const GITHUB_OWNER = "neilq1810";
const GITHUB_REPO = "ski-trip-2027";
const REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

function newIssueUrl(status) {
  const title = `RSVP: [Your Name] - ${status}`;
  const body = "Comments (optional):\n\n";
  const params = new URLSearchParams({ title, body });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

document.getElementById("rsvp-yes").href = newIssueUrl("YES");
document.getElementById("rsvp-maybe").href = newIssueUrl("MAYBE");
document.getElementById("rsvp-no").href = newIssueUrl("NO");

const RSVP_TITLE_RE = /^RSVP:\s*(.+?)\s*-\s*(YES|NO|MAYBE)\s*$/i;

async function loadRsvps() {
  const listEl = document.getElementById("rsvp-list");
  const summaryEl = document.getElementById("rsvp-summary");

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const issues = await res.json();
    const rsvps = [];

    for (const issue of issues) {
      if (issue.pull_request) continue;
      const match = issue.title.match(RSVP_TITLE_RE);
      if (!match) continue;
      rsvps.push({
        name: match[1].trim(),
        status: match[2].toUpperCase(),
        comment: (issue.body || "").replace(/^Comments \(optional\):\s*/i, "").trim(),
        url: issue.html_url,
      });
    }

    renderRsvps(rsvps, listEl, summaryEl);
  } catch (err) {
    listEl.innerHTML = `<p class="note">Couldn't load responses right now (${err.message}). You can view them directly on <a href="${REPO_URL}/issues" target="_blank" rel="noopener">GitHub</a>.</p>`;
    summaryEl.innerHTML = "";
  }
}

function renderRsvps(rsvps, listEl, summaryEl) {
  if (rsvps.length === 0) {
    listEl.innerHTML = '<p class="note">No responses yet &mdash; be the first!</p>';
    summaryEl.innerHTML = "";
    return;
  }

  const counts = { YES: 0, MAYBE: 0, NO: 0 };
  rsvps.forEach((r) => counts[r.status]++);

  summaryEl.innerHTML = `
    <span class="yes">🟢 ${counts.YES} in</span>
    <span class="maybe">🟡 ${counts.MAYBE} maybe</span>
    <span class="no">🔴 ${counts.NO} out</span>
  `;

  const order = { YES: 0, MAYBE: 1, NO: 2 };
  rsvps.sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));

  const rows = rsvps
    .map(
      (r) => `
    <tr>
      <td>${escapeHtml(r.name)}</td>
      <td><span class="status-pill ${r.status.toLowerCase()}">${r.status}</span></td>
      <td>${escapeHtml(r.comment) || "&mdash;"}</td>
      <td><a href="${r.url}" target="_blank" rel="noopener">edit</a></td>
    </tr>`
    )
    .join("");

  listEl.innerHTML = `
    <table class="rsvp-table">
      <thead><tr><th>Name</th><th>Status</th><th>Comment</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadRsvps();
