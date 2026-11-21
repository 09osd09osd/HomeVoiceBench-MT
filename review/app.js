const SHORT = { edge_native: "edge 原生", qwen35_4b: "Qwen3.5-4B 级联", qwen35_2b: "Qwen3.5-2B 级联", minicpm5_2b: "MiniCPM5-2B 级联", qwen25_omni_3b: "Qwen2.5-Omni-3B 原生" };
const SCEN = { home: "家居", child: "儿童" };
const STORE = "hvmt-rubric-review-v1";
let DATA = null, notes = {}, selected = null, filtered = [];

function loadNotes() { try { notes = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { notes = {}; } }
function saveNotes() { localStorage.setItem(STORE, JSON.stringify(notes)); renderProgress(); }
function avg(scores) { if (!scores) return null; const v = Object.values(scores).filter((x) => typeof x === "number"); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function audioSrc(p) { if (!p) return null; if (p.startsWith("assets/")) return "../" + p; return null; }

function renderProgress() {
  const total = DATA ? DATA.cases.length : 0;
  const heard = Object.values(notes).filter((n) => n.heard).length;
  document.getElementById("progress").textContent = `已听 ${heard} / ${total}`;
}

function renderList() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  const scen = document.getElementById("scenario").value;
  const onlyTodo = document.getElementById("onlyTodo").checked;
  filtered = DATA.cases.filter((c) => {
    if (scen && c.scenario !== scen) return false;
    if (onlyTodo && notes[c.id] && notes[c.id].heard) return false;
    if (!q) return true;
    const hay = (c.id + " " + (c.topic || "") + " " + c.turns.map((t) => t.user).join(" ")).toLowerCase();
    return hay.includes(q);
  });
  document.getElementById("list").innerHTML = filtered.map((c) => {
    const n = notes[c.id] || {};
    return `<div class="item${c.id === selected ? " active" : ""}" data-id="${esc(c.id)}"><div class="id">${n.heard ? "✓ " : ""}${esc(c.id)}</div><div class="sub">${SCEN[c.scenario] || ""} · ${esc(c.topic || "")} · ${esc(c.turn_design || "")}</div></div>`;
  }).join("");
  document.querySelectorAll(".item").forEach((el) => el.onclick = () => selectCase(el.getAttribute("data-id")));
  renderProgress();
}

function renderObjective(c) {
  const objs = c.objective || {};
  const rows = Object.keys(SHORT).map((s) => {
    const o = objs[s];
    if (!o) return "";
    const t = o.tool || {}, pr = o.probe || {};
    const f1 = t.field_f1 != null ? t.field_f1 : "-";
    return `<tr><td>${SHORT[s]}</td><td>${t.select_correct || 0}/${t.expected || 0}</td><td>${f1}</td><td>${t.missed || 0}</td><td>${t.spurious || 0}</td><td>${pr.hits || 0}/${pr.total || 0}</td></tr>`;
  }).join("");
  return `<div class="objective"><b>客观指标</b>（工具：正确/应有 · 参数F1 · 漏调 · 乱调；探针：命中/总题）<table style="width:100%;font-size:12.5px;margin-top:6px"><tr><th>系统</th><th>工具正确</th><th>F1</th><th>漏调</th><th>乱调</th><th>探针</th></tr>${rows}</table></div>`;
}

function renderCase() {
  const c = DATA.cases.find((x) => x.id === selected);
  if (!c) return;
  const n = notes[c.id] || (notes[c.id] = { note: "", heard: false, review: false, agreeJudge: false });
  document.getElementById("noteText").value = n.note || "";
  document.getElementById("heard").checked = !!n.heard;
  document.getElementById("review").checked = !!n.review;
  document.getElementById("agreeJudge").checked = !!n.agreeJudge;

  document.getElementById("meta").innerHTML = `<h2>${esc(c.id)}</h2><div class="tags">
    <span>${SCEN[c.scenario] || c.scenario}</span><span>${esc(c.topic || "")}</span>
    <span>${esc(c.tool_mode || "")}</span>${c.age_band ? `<span>${esc(c.age_band)}</span>` : ""}
    <span>${esc(c.turn_design || "")}</span></div>`;
  document.getElementById("objective").innerHTML = renderObjective(c);

  document.getElementById("turns").innerHTML = c.turns.map((t) => {
    const rows = Object.keys(SHORT).map((s) => {
      const d = (t.systems && t.systems[s]) || {};
      const a = avg(d.scores);
      const dims = d.scores ? Object.entries(d.scores).map(([k, v]) => `<span>${k} ${v}</span>`).join("") : "";
      const viol = (d.violations || []).length ? `<div class="viol">违规：${esc((d.violations || []).map((v) => v.type || JSON.stringify(v)).join("; "))}</div>` : "";
      const src = audioSrc(d.audio);
      const audio = src ? `<audio controls preload="none" src="${esc(src)}"></audio>` : '<div class="muted">无样例音频（完整音频见本地包）</div>';
      const score = t.checkpoint ? (a == null ? "NA" : a.toFixed(2)) : "—";
      const judgeTag = t.checkpoint
        ? (d.scores ? "" : '<div class="muted">未判（无音频或模型失败）</div>')
        : '<div class="muted">非检查点，不评分（仅保留上下文）</div>';
      const answer = d.text ? esc(d.text) : "（无回答文本）";
      return `<div class="sys"><div class="sysname"><span>${SHORT[s]}</span><span class="score">${score}</span></div>
        <div class="dims">${dims}</div><div class="answer">${answer}</div>${judgeTag}
        ${d.note ? `<div class="note">判官理由：${esc(d.note)}</div>` : ""}${viol}${audio}</div>`;
    }).join("");
    const exp = t.tool_expect ? `<div class="expect">期望工具：${esc(JSON.stringify(t.tool_expect))}</div>` : "";
    const probe = t.probe ? `<div class="expect">探针标准答案：${esc(JSON.stringify(t.probe.expected || []))}</div>` : "";
    const badge = t.checkpoint ? '<span class="checkpoint">检查点·评分</span>' : '<span class="checkpoint gray">非检查点·仅上下文</span>';
    return `<div class="turn"><div class="user">R${t.turn} 用户：${esc(t.user)} ${badge}</div>${exp}${probe}<div class="systems">${rows}</div></div>`;
  }).join("");
}

function selectCase(id) { selected = id; renderList(); renderCase(); }
function bindNote(key, value) {
  if (!notes[selected]) notes[selected] = {};
  notes[selected][key] = value;
  notes[selected].updated = new Date().toISOString();
  saveNotes();
}
document.getElementById("noteText").addEventListener("input", (e) => bindNote("note", e.target.value));
["heard", "review", "agreeJudge"].forEach((k) => document.getElementById(k).addEventListener("change", (e) => { bindNote(k, e.target.checked); renderList(); }));

function download(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/octet-stream" }));
  a.download = name; a.click();
}
document.getElementById("exportJson").onclick = () => download("hvmt-rubric-review.json", JSON.stringify({ version: 1, notes }, null, 2));
document.getElementById("exportCsv").onclick = () => {
  const rows = [["case_id", "scenario", "topic", "note", "heard", "review", "agree_judge", "updated"]];
  for (const c of DATA.cases) {
    const n = notes[c.id] || {};
    rows.push([c.id, c.scenario, c.topic || "", n.note || "", !!n.heard, !!n.review, !!n.agreeJudge, n.updated || ""]);
  }
  const csv = rows.map((r) => r.map((x) => '"' + String(x).replace(/"/g, '""') + '"').join(",")).join("\n");
  download("hvmt-rubric-review.csv", "\ufeff" + csv);
};
document.getElementById("search").addEventListener("input", renderList);
document.getElementById("scenario").addEventListener("change", renderList);
document.getElementById("onlyTodo").addEventListener("change", renderList);
document.addEventListener("keydown", (e) => {
  if (!e.altKey) return;
  const i = filtered.findIndex((c) => c.id === selected);
  if (i < 0) return;
  if (e.key === "ArrowRight" && i < filtered.length - 1) selectCase(filtered[i + 1].id);
  if (e.key === "ArrowLeft" && i > 0) selectCase(filtered[i - 1].id);
});

loadNotes();
fetch("data.json").then((r) => r.json()).then((d) => {
  DATA = d; renderList(); if (filtered.length) selectCase(filtered[0].id);
});
