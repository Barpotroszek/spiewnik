const chords = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "B",
    "H",
  ],
  chords_amount = chords.length;

const isLowerCase = (letter) => {
  // 97 -> a
  return letter.charCodeAt(0) >= 97;
};

const transposition = (value) => {
  document.querySelectorAll("code.chord").forEach((chord) => {
    let temp = chord.textContent.replace('is', '#'),
      idx = chords.findIndex((v) => v === temp.toUpperCase());
    if(idx<0){
      chord.textContent = '?';
      return;
    }
    let new_idx = (idx + value) % chords_amount;
    console.log(JSON.stringify({ temp, idx, value, new_idx }));
    if (new_idx < 0) new_idx += chords_amount;
    new_chord = isLowerCase(temp)
      ? chords[new_idx].toLowerCase()
      : chords[new_idx];
    chord.textContent = new_chord.replace('#', 'is')
  });
};

const transposeUp = () => transposition(1);

const transposeDown = () => transposition(-1);
