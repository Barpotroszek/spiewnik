const PROHIBITED_FILES = /(\/_cacheOverride)/,
  fonts = [
    "https://fonts.googleapis.com/css2?family=Nerko+One&display=swap",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDd5RA.woff2",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDeZRAVmo.woff2",
    "./",
    './registerSW.js',
    './sw.js',
    "./404.html",
    './manifest.json'
  ];

const cacheResources = async (resources) => {
  const cache = await caches.open("v1");
  cache.addAll(resources);
};

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.add(resources);
};

const checkIfDownloaded = (url) => caches.match(url);

self.addEventListener("install", (event) => {
  const resources = [];
  resources.push(fonts);
  event.waitUntil(cacheResources(resources.flat()));
});

const notFoundPage = (res) => {
  caches.match("./404.html").then(res);
};

const getFromCache = (url) =>
  new Promise((res, rej) => {
    caches.match(url).then((resp) => {
      if (resp) {
        if (/\.html$/.test(url)) console.debug("[sw] Matched: " + url);
        res(resp);
      } else rej();
    });
  });

const fetchFirst = (url) =>
  //   Ensuring we have the latest versions and we do it's backup
  fetch(url).then((response) => {
    if (response.ok) {
      if (!PROHIBITED_FILES.test(url))
        // save in case of working offline
        addResourcesToCache(url);
    //   console.log("Fetched", response);
      return response;
    } else return getFromCache(url);
  }).catch(()=>getFromCache(url));

self.addEventListener("fetch", (e) => {
  const req = e.request,
    url = req.url;

  const chain = new Promise((res, rej) => {
    fetchFirst(url).then(res).catch(()=>notFoundPage(res));
  });

  e.respondWith(chain);
});
