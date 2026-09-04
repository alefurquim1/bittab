/* global chrome, browser */
const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULT_URL = "https://project--c8b1d36e-a356-4ee0-8000-7c6e1721d5c5.lovable.app/";

function load(url) {
  const frame = document.getElementById("frame");
  const msg = document.getElementById("msg");
  const timeout = setTimeout(() => {
    if (!frame.dataset.loaded) {
      frame.remove();
      msg.classList.add("show");
    }
  }, 8000);
  frame.addEventListener("load", () => {
    frame.dataset.loaded = "1";
    clearTimeout(timeout);
  });
  frame.src = url;
}

api.storage.local.get({ url: DEFAULT_URL }, (data) => {
  load(data && data.url ? data.url : DEFAULT_URL);
});
