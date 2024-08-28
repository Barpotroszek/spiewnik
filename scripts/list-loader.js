
fetch("texts/data.json").then(async (e) => {
  e.json().then((e) => {
    const main = document.getElementsByTagName("main")[0];

    // Sorting
    const keys = Object.keys(e).sort();

    // Adding links to page
    
    const url = new URL(window.location)
    url.pathname='./song.html'

    let even = false;

    keys.forEach((key) => {
      const v = e[key].sort();
      let t = document.createElement("h3"),
        ul = document.createElement("ul");
      t.textContent = key;
      main.append(t);
      v.forEach((el) => {
        even = !even;
        let li = document.createElement("li"),
          a = document.createElement("a");
        a.textContent = el;

        url.searchParams.set("artist", key)
        url.searchParams.set("title", v)
        a.setAttribute(
          "href",
          "song.html?artist=" + key + "&title=" + el + ".md"
        );
        even ? li.classList.add('even'):null;
        li.append(a);
        ul.append(li);
      });
      main.append(ul);
    });
  });
});
