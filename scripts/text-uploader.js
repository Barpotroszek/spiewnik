const rgxs = {
  chord: /\[([\w\d ]{1,3}|(\wsus\d))\]/g, // chord in text
  chord_alone: /\B\[([\w\d ]{1,3}|(\wsus\d))\]\B/g, // chord NOT in text, standing alone
  title: /^#\s([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\d\\.,]+)$/gm,
  subtitle: /^##\s([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\d\\.,]+)\s$/gm,
  comment: /^> ?([\w\dĄĆĘŁŃÓŚŹŻąćęłńóśźż;:\., ]+)$/gm,
  bold: /\*(\w+)\*/g,
  spaces: /\]( ?)\[/g,
};

const url = new URLSearchParams(window.location.search);

fetch("texts/" + url.get("artist") + "/" + url.get("title")).then(async (r) => {
  const main = document.querySelector("main");
  let txt = await r.text();
  const br = document.createElement("br"),
    chord_pattern = '<code class="chord" data-chord="$1">$1</code>';
  txt = txt
    .replace(rgxs.bold, "<b>$1:</b>")
    .replace(rgxs.spaces, "]&nbsp;&nbsp;&nbsp;&nbsp;[");

  lines = txt.split(/\r?\n\r?\n/);

  let title = url.get("title").replace(".md", ""),
    subtitle = url.get("artist"),
    // subtitle = rgxs.exec(txt)[1];
    comment = null;
  document.getElementById("title").textContent = title;
  document.getElementById("subtitle").textContent = subtitle;
  try {
    comment = rgxs.comment.exec(txt)[1];
    document.getElementById("comment").textContent = comment;
  } catch (error) {
    document.getElementById("comment").remove();
  }

  lines.forEach((parag) => {
    if (
      rgxs.title.test(parag) ||
      rgxs.subtitle.test(parag) ||
      parag.includes(comment)
    ) {
      console.log(
        { parag },
        parag.includes(title) ||
          parag.includes(subtitle) ||
          parag.includes(comment)
      );
      return;
    }
    if (parag === "") {
      document.body.append(br);
      return;
    }
    const p = document.createElement("p");
    parag.split("\r\n").forEach((line, idx) => {
      // console.log({idx, line})
      const span = document.createElement("span");
      if (rgxs.chord_alone.test(line)) {
        line = line.replace(rgxs.chord_alone, chord_pattern);
      }
      if (rgxs.chord.test(line)) {
        span.setAttribute("class", "with-chords");
        line = line.replace(rgxs.chord_in_txt, chord_pattern);
      }
      span.innerHTML = line.replace(rgxs.chord, chord_pattern);
      p.append(span);
    });
    main.append(p);
  });
  // txt = txt.replace(/(\r\n){2}/g, "\n");
});
