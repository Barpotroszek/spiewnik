const PROHIBITED_FILES = /(\/_cacheOverride)|(song\.html\?)/,
  files = [
    "https://fonts.googleapis.com/css2?family=Nerko+One&display=swap",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDd5RA.woff2",
    "https://fonts.gstatic.com/s/nerkoone/v16/m8JQjfZSc7OXlB3ZMOjDeZRAVmo.woff2",
    "./",
    "./registerSW.js",
    "./sw.js",
    "./404.html",
    "./manifest.json",
    // "./song.html"
  ];

const cacheResources = async (resources) => {
  const cache = await caches.open("v1.1");
  return Promise.allSettled(resources.map((url)=>{
    return cache.add(url)
      .catch("Failed to cache:", url)
  }))
};

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1.1");
  await cache.add(resources);
};

const checkIfDownloaded = (url) => caches.match(url);

self.addEventListener("install", (event) => {
  event.waitUntil(cacheResources(files).catch(console.error));
});

const notFoundPage = (res) => {
  caches.match("./404.html").then(res);
};

const songPage = (res) => {
  caches.match("./song.html").then(res);
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

const fetchAllSongs = (clientId) => {
  // NOT FETCHING BUT IT MAY BE CLOSE
  fetch("./texts/data.json")
    .then((d) => d.json())
    .then((data) => {
      
      const resources = new Array();
      Array.from(data).forEach((elem) => {
        resources.push(
          new Promise(async (res, rej) => {
            url = ["./texts", elem.artist, elem.title + ".md"].join("/");
            resources.push(encodeURI(url));
            try {
              await addResourcesToCache(url);
              elem.downloaded = true;
              res();
            } catch {
              // console.error("Error was thrown with:", url);
              rej(url);
            }
          })
        );
      });
      
      Promise.allSettled(resources).then(()=>{
        console.log("Data downloaded :>")
        channel.postMessage("downloading-done")
      })
      // alert("Data fetched");
    });
};

const fetchFirst = (url) => {
  //   Ensuring we have the latest versions and we do it's backup
  if (/song\.html/.test(url)) url = "song.html";
  // console.debug({url})
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        if (!PROHIBITED_FILES.test(url))
          // save in case of working offline
          addResourcesToCache(url);
        //   console.log("Fetched", response);
        return response;
      } else return getFromCache(url);
    })
    .catch(() => getFromCache(url));
};

const channel = new BroadcastChannel("fancy-channel");

channel.onmessage = (e) => {
  if (e.data !== "download-all") return;
  fetchAllSongs(e.clientId);
};

self.addEventListener("fetch", (e) => {
  const req = e.request,
    url = req.url;

  const chain = new Promise((res, rej) => {
    fetchFirst(url)
      .then(res)
      .catch(() => notFoundPage(res));
  });

  e.respondWith(chain);
});
