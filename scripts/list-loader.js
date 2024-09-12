const combineTitles = (a, b) => {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return -1;
  return 0;
};

fetch("texts/data.json").then(async (e) => {
  e.json().then((data) => {
    const main = document.getElementsByTagName("main")[0];

    // Sorting

    // Adding links to page

    const url = new URL(window.location);
    url.pathname = "./song.html";

    let even = false;
    let ul = document.createElement("ul");
    console.log({ data });
    data.forEach((item) => {
      // let t = document.createElement("h3");
      // t.textContent = item;
      // main.append(t);
      // TODO: Make it work because it is not
      // TODO: Rewrite the whole method
      even = !even;
      let li = document.createElement("li"),
        a = document.createElement("a");
      a.textContent = `${item["title"]} - ${item['artist']}`;

      url.searchParams.set("artist", item["artist"]);
      url.searchParams.set("title", item["title"]);
      a.setAttribute(
        "href",
        "song.html?artist=" + item['artist'] + "&title=" + item["title"] + ".md"
      );
      a.setAttribute("class", "link")
      even ? li.classList.add("even") : null;
      li.append(a);
      ul.append(li);
    });
    main.append(ul);
  });
});
