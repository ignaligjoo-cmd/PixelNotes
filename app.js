/* PixelNotes - Minimal UI Notes App */

const STORAGE_KEY = "pixelnotes-v1";

// DOM
const noteListEl = document.getElementById("noteList");
const emptyListEl = document.getElementById("emptyList");
const searchEl = document.getElementById("search");
const newBtn = document.getElementById("newBtn");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

let notes = [];
let activeId = null;

/* Load & Save */
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/* New Note */
function newNote() {
  activeId = null;
  titleEl.value = "";
  bodyEl.value = "";
}

/* Load note into editor */
function loadNote(id) {
  const n = notes.find(x => x.id === id);
  if (!n) return;

  activeId = id;
  titleEl.value = n.title;
  bodyEl.value = n.body;
}

/* Save note */
function saveNote() {
  const title = titleEl.value.trim();
  const body = bodyEl.value.trim();
  const time = Date.now();

  if (!title && !body) {
    alert("Cannot save empty note.");
    return;
  }

  if (activeId) {
    const n = notes.find(x => x.id === activeId);
    n.title = title;
    n.body = body;
    n.updated = time;
  } else {
    notes.push({
      id: "n" + time,
      title,
      body,
      updated: time
    });
  }

  saveNotes();
  renderList();
}

/* Delete note */
function deleteNote() {
  if (!activeId) return alert("No note selected.");

  notes = notes.filter(n => n.id !== activeId);
  activeId = null;
  newNote();
  saveNotes();
  renderList();
}

/* Render notes */
function renderList() {
  noteListEl.innerHTML = "";

  const search = searchEl.value.toLowerCase();

  const filtered = notes.filter(n =>
    (n.title + " " + n.body).toLowerCase().includes(search)
  );

  emptyListEl.style.display = filtered.length ? "none" : "block";

  filtered
    .sort((a, b) => b.updated - a.updated)
    .forEach(n => {
      const item = document.createElement("div");
      item.className = "note-item";
      item.onclick = () => loadNote(n.id);

      const date = new Date(n.updated).toLocaleString();

      item.innerHTML = `
        <div class="note-title">${n.title || "(untitled)"}</div>
        <div class="note-date">${date}</div>
      `;

      noteListEl.appendChild(item);
    });
}

/* Init */
function init() {
  notes = loadNotes();
  renderList();

  newBtn.onclick = newNote;
  saveBtn.onclick = saveNote;
  deleteBtn.onclick = deleteNote;
  searchEl.oninput = renderList;

  // Ctrl+S save shortcut
  window.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveNote();
    }
  });
}

init();
