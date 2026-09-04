/* global chrome, browser */
const api = typeof browser !== "undefined" ? browser : chrome;

const DEFAULT_URL = "https://project--c8b1d36e-a356-4ee0-8000-7c6e1721d5c5.lovable.app/";

const input = document.getElementById("url");
const status = document.getElementById("status");

api.storage.local.get({ url: DEFAULT_URL }, (data) => {
  input.value = (data && data.url) || DEFAULT_URL;
});

document.getElementById("save").addEventListener("click", () => {
  const url = input.value.trim();
  if (!/^https?:\/\//i.test(url)) {
    status.style.color = "#ff9a9a";
    status.textContent = "Informe um endereço começando com https://";
    return;
  }
  api.storage.local.set({ url }, () => {
    status.style.color = "#7ef0b0";
    status.textContent = "Salvo! Abra uma nova guia para ver.";
  });
});
