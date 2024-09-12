const rgxs = {
  chord: /\[(\w(sus|is)?)(\d?)\]/g, // chord in text
  chord_alone: /\B\[(\w(sus|is)?)(\d?)\]\B/g, // chord NOT in text, standing alone
  title: /^#\s([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\d\\.,]+)$/gm,
  subtitle: /^##\s([A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s\d\\.,]+)\s$/gm,
  capo: /^> ?([\w\dĄĆĘŁŃÓŚŹŻąćęłńóśźż;:\., ]+)$/gm,
  comment: /{?([\w\dĄĆĘŁŃÓŚŹŻąćęłńóśźż;:\., ]+)}/gm,
  bold: /\*(\w+)\*/g,
  spaces: /\]( ?)\[/g,
};

const searchParams = new URLSearchParams(window.location.search);

fetch("texts/" + searchParams.get("artist") + "/" + searchParams.get("title"))
  .then(async (r) => {
    console.log("TEXTS:", r);
    // In case the data-file is not cached:
    if (/404\.html/.test(r.url)) {
      r.blob().then((v) => {
        v.text().then((v) => (document.body.innerHTML = v));
      });
      return;
    }
    const main = document.querySelector("main");
    let txt = await r.text();
    const br = document.createElement("br"),
      chord_pattern =
        '<code class="chord" data-ext="$3" data-chord="$1">$1</code>',
      comment_pattern = '<span class="comment">$1</span>';
    txt = txt
      .replace(rgxs.bold, "<b>$1:</b>")
      .replace(rgxs.spaces, "]&nbsp;&nbsp;&nbsp;&nbsp;[");

    lines = txt.split(/\r?\n\r?\n/);

    let title = searchParams.get("title").replace(".md", ""),
      subtitle = searchParams.get("artist"),
      // subtitle = rgxs.exec(txt)[1];
      capo = null;
    document.getElementById("title").textContent = title;
    document.getElementById("subtitle").textContent = subtitle;
    try {
      capo = rgxs.capo.exec(txt)[1];
      document.getElementById("capo").textContent = capo;
    } catch (error) {
      document.getElementById("capo").remove();
    }

    lines.forEach((parag, idx) => {
      if (
        rgxs.title.test(parag) ||
        rgxs.subtitle.test(parag) ||
        parag.includes(capo)
      )
        return;

      if (parag === "" && lines.length !== idx-1) {
        main.append(br);
        return;
      }
      const p = document.createElement("p");
      parag.split(/\r?\n/).forEach((line, idx) => {
        // console.log({idx, line})
        const span = document.createElement("span");
        if (rgxs.chord_alone.test(line)) {
          line = line.replace(rgxs.chord_alone, chord_pattern);
        }
        if (rgxs.chord.test(line)) {
          p.setAttribute("class", "with-chords");
          line = line.replace(rgxs.chord_in_txt, chord_pattern);
        }
        span.innerHTML = line
          .replace(rgxs.chord, chord_pattern)
          .replace(rgxs.comment, comment_pattern);
        p.append(span);
      });
      main.append(p);
    });
    // txt = txt.replace(/(\r\n){2}/g, "\n");
  })
  .catch((err) => {});
