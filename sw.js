const PROHIBITED_FILES = /(\/_cacheOverride)/,
  fonts = [
    "https://fonts.googleapis.com/css2?family=Nerko+One&display=swap",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDd5RA.woff2",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDeZRAVmo.woff2",
    "./",
    "./404.html"
  ];

const cacheResources = async (resources)=>{
  const cache = await caches.open("v1");
    cache.addAll(resources)
}

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  console.log({resources})
  await cache.add(resources);
};

const checkIfDownloaded = (url) => caches.match(url);

self.addEventListener("install", (event) => {
  const resources = [];
  resources.push(fonts);
  event.waitUntil(cacheResources(resources.flat()));
});

const cacheFirst = (url, res) => {
  caches.match(url).then((resp) => {
    if (resp) {
      if (/\.html$/.test(url)) console.debug("[sw] Matched: " + url);
      res(resp);
    } else
      fetch(url)
        .then((result) => {
          if (result.ok && !PROHIBITED_FILES.test(url)) {
            addResourcesToCache(url);
          }
          else
          return caches.match('./404.html').then(res)

          res(result);
        })
        .catch((err) => {
            console.log("Failed to fetch", err)
            caches.match('./404.html').then(res)
        });
  });
};

self.addEventListener("fetch", (e) => {
  const req = e.request,
    url = req.url;

  const chain = new Promise((res, rej) => {
    cacheFirst(url, res);
  });
  e.respondWith(chain);
});
