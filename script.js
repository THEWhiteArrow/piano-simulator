pianoModule.buyPiano('piano', 3, 5);
const piano = pianoModule.createPiano('piano', 3, 5);
piano.setupEventListeners();

// pianoModule.buyPiano('piano2', 1, 4);
// const piano2 = pianoModule.createPiano('piano2', 1, 4);
// piano2.setupEventListeners();

let s = `E3 ds3 E3 ds3 E3
B3 D3 C3 A3
c2 e2 a3 B3
e2 gs2 b3 c3

E3 ds3 E3 ds3 E3
B3 D3 C3 A3
c2 e2 a3 B3
e2 c3 b3 a3

b3 c3 d3 e3
f3 e3 d3 
e3 d3 c3
d3 c3 b3`

let ans = '';
for (let i = 0; i < s.length; ++i)
   if (s.charCodeAt(i) >= 48 && s.charCodeAt(i) <= 57)
      ans += (Number(s[i]) + 1);
   else
      ans += s[i];

console.log(ans)