/* global chrome, browser */
const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULT_URL = "https://bittab.lovable.app/";

function isUsable(url) {
  // Preview/dev addresses require login and answer "Forbidden" inside a new tab.
  return /^https?:\/\//i.test(url) && !/project--|id-preview--|-dev\.lovable\.app/i.test(url);
}

function showFallback(url) {
  const frame = document.getElementById("frame");
  const msg = document.getElementById("msg");
  const open = document.getElementById("open");
  if (frame) frame.remove();
  if (open) {
    open.href = url;
    open.textContent = url;
  }
  msg.classList.add("show");
}

function load(url) {
  const frame = document.getElementById("frame");
  const timeout = setTimeout(() => {
    if (!frame.dataset.loaded) showFallback(url);
  }, 8000);
  frame.addEventListener("load", () => {
    frame.dataset.loaded = "1";
    clearTimeout(timeout);
  });
  frame.addEventListener("error", () => {
    clearTimeout(timeout);
    showFallback(url);
  });
  frame.src = url;
}

api.storage.local.get({ url: DEFAULT_URL }, (data) => {
  let url = (data && data.url) || DEFAULT_URL;
  if (!isUsable(url)) {
    url = DEFAULT_URL;
    api.storage.local.set({ url });
  }
  load(url);
});
