const pianoModule = (() => {
   'use strict';
   const helpers = [
      { name: 'A', isSharp: true },
      { name: 'B', isSharp: false },
      { name: 'C', isSharp: true },
      { name: 'D', isSharp: true },
      { name: 'E', isSharp: false },
      { name: 'F', isSharp: true },
      { name: 'G', isSharp: true },
   ]

   class Key {
      constructor(id, oktawa) {
         this.id = id.toUpperCase();
         this.oktawa = oktawa;
         this.key = document.getElementById(this.id + this.oktawa);
      }
      activate() { if (this.key != undefined) this.key.classList.add('bg-success'); }
      deactivate() { if (this.key != undefined) this.key.classList.remove('bg-success'); }
   }
   const createKey = (id, oktawa) => (new Key(id, oktawa));

   const convertToArr = (text) => {
      text += ' '
      let arr = []
      for (let i = 0; i < text.length; ++i)
         if (text[i] != ' ')
            for (let j = i + 1; j < text.length; ++j)
               if (text[j] == ' ') {
                  arr.push(text.substr(i, j - i))
                  i = j;
                  break;
               }
      return arr;
   }

   class Piano {
      constructor(pianoId, a, b) {
         this.pianoId = pianoId;
         this.lowest = a;
         this.highest = b;
         this.keys = {};
         this.intervalId = 0;
         this.form = document.querySelector(`#${this.pianoId} form`)
         this.progressBar = document.querySelector(`#${this.pianoId} form #progressBar`)

         for (let i = this.lowest; i <= this.highest; ++i)
            for (let h of helpers)
               if (h.isSharp) {
                  this.keys[`${h.name}${i}`] = createKey(h.name, i);
                  this.keys[`${h.name}S${i}`] = createKey(h.name + 'S', i);
               } else
                  this.keys[`${h.name}${i}`] = createKey(h.name, i);
      }
      deactivateAll() {
         for (let key in this.keys)
            this.keys[key].deactivate()
      }
      setupFormListener(delay = 750) {
         this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearInterval(this.intervalId);

            const data = this.form[0].value.toUpperCase().replaceAll('#', 'S');
            const notes = convertToArr(data);

            // MAY WISH TO CHANGE TO PROMISES IN THE FUTURE
            let progress = 0
            this.intervalId = setInterval(() => {
               if (progress == notes.length) progress = 0;
               this.deactivateAll();
               this.keys[notes[progress++]].activate();
               this.progressBar.style.width = `${progress * 100 / notes.length}%`;
            }, delay);
         })

         this.form[2].addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            clearInterval(this.intervalId);
            this.deactivateAll();
            this.form[0].value = '';
         })
      }
   }
   const createPiano = (pianoId, a = 1, b = 4) => (new Piano(pianoId, a, b));


   const createWhiteKey = (name, oktawa) => (
      `<div id="${name}${oktawa}" class="key white">${name}${oktawa}</div>`
   )
   const createWhiteBlackKey = (name, oktawa) => (
      `
      <div id="${name}${oktawa}" class="key white">
         ${name}${oktawa}
         <div id="${name}S${oktawa}" class="key black">${name}</div>
      </div>
      `
   )
   const buyPiano = (id, a = 1, b = 4) => {
      const myPiano = document.getElementById(id);
      myPiano.classList.add('d-flex', 'flex-column', 'align-items-center')
      let content = '<div id="keys" class="d-flex flex-row">'
      for (let i = a; i <= b; ++i)
         for (let h of helpers)
            if (h.isSharp)
               content += createWhiteBlackKey(h.name, i)
            else
               content += createWhiteKey(h.name, i);

      content += '</div>'

      content += `
      <form id="form" class="mt-5 mb-3 px-0 d-flex flex-column container">
         <div id="progressBarTrack" class="bar d-flex bg-dark">
            <div id="progressBar" class="bar bg-danger" style="width:0%;"></div>  
         </div>
         <div class="input-group mb-2">
            <input type="text" class="form-control" placeholder="Notes" aria-label="Notes">
         </div>
         <div class="d-flex">
            <button class="btn btn-success d-flex col-10 justify-content-center">Convert </button>
            <button class="btn btn-warning text-white d-flex col-2 justify-content-center">Stop </button>
         </div>
      </form>
      `

      myPiano.innerHTML = content;
   }

   return { buyPiano, createPiano };
})();

pianoModule.buyPiano('piano', 1, 4);
const piano = pianoModule.createPiano('piano', 1, 4);
piano.setupFormListener();

