const pianoModule = (() => {
   'use strict';

   class Key {
      constructor(pianoId, id, oktawa) {
         this.id = id.toUpperCase();
         this.oktawa = oktawa;
         this.key = document.getElementById(pianoId + this.id + this.oktawa);
      }
      activate(className = 'bg-success') { if (this.key != undefined) { this.key.classList.add(className); this.key.classList.add('text-white') } }
      deactivate(className = 'bg-success') { if (this.key != undefined) { this.key.classList.remove(className); this.key.classList.remove('text-white') } }

   }
   const createKey = (pianoId, id, oktawa) => (new Key(pianoId, id, oktawa));


   class Piano {
      constructor(pianoId, a, b) {
         this.pianoId = pianoId;
         this.isPlaying = false;
         this.lowest = a;
         this.progress = 0;
         this.highest = b;
         this.keys = {};
         this.form = document.querySelector(`#${this.pianoId} form`)
         this.progressBar = document.querySelector(`#${this.pianoId} form #progressBar`)
         this.rangeMinEl = document.querySelector(`#${this.pianoId} form #rangeMin`)
         this.rangeMaxEl = document.querySelector(`#${this.pianoId} form #rangeMax`)
         this.rangeMin = 1
         this.rangeMax = 1
         this.notes = []

         for (let i = this.lowest; i <= this.highest; ++i)
            for (let key of utility.keys)
               if (key.isSharp) {
                  this.keys[`${key.name}${i}`] = createKey(this.pianoId, key.name, i);
                  this.keys[`${key.name}S${i}`] = createKey(this.pianoId, key.name + 'S', i);
               } else
                  this.keys[`${key.name}${i}`] = createKey(this.pianoId, key.name, i);
      }
      deactivateAll(className = 'bg-success') {
         for (let key in this.keys)
            this.keys[key].deactivate(className)
      }
      setupRange() {
         this.progress = 0
         this.rangeMax = this.notes.length
         this.rangeMinEl.setAttribute('max', this.rangeMax)
         this.rangeMaxEl.setAttribute('max', this.rangeMax)
         this.rangeMaxEl.value = this.rangeMax;
         this.rangeMinEl.parentElement.children[0].innerText = `Min range : ${this.rangeMin}`
         this.rangeMaxEl.parentElement.children[0].innerText = `Max range : ${this.rangeMax}`
      }

      async playThePiano(data, timeDelay) {
         this.notes = utility.convertToArr(data)
         this.setupRange()
         //if there are no notes 
         if (!this.notes.length) return;

         try {

            this.isPlaying = true;
            while (this.isPlaying) {
               this.deactivateAll();

               if (this.progress == this.rangeMax) {
                  this.progress = this.rangeMin - 1;
                  this.progressBar.style.width = `${(this.progress) * 100 / this.notes.length}%`;
                  await utility.delay(2 * timeDelay);
               }


               this.keys[this.notes[this.progress++]].activate();
               this.progressBar.style.width = `${(this.progress) * 100 / this.notes.length}%`;
               await utility.delay(timeDelay);
            }
         } catch (e) {
            alert(e)
            this.isPlaying = false;
            this.progress = 0;
            this.rangeMax = 1;
            this.rangeMin = 1;
         }
      }

      setupEventListeners(timeDelay = 750) {
         this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.playThePiano(this.form[0].value, timeDelay)
         })
         this.rangeMinEl.addEventListener('input', () => {
            this.rangeMin = this.rangeMinEl.value;
            this.rangeMaxEl.setAttribute('min', Number(this.rangeMin) + 1)
            this.rangeMinEl.parentElement.children[0].innerText = `Min range : ${this.rangeMin}`
            this.progress = this.rangeMin;
         })
         this.rangeMaxEl.addEventListener('input', () => {
            this.rangeMax = this.rangeMaxEl.value;
            this.rangeMinEl.setAttribute('max', Number(this.rangeMax) - 1)
            this.rangeMaxEl.parentElement.children[0].innerText = `Max range : ${this.rangeMax}`
            this.progress = this.rangeMin;
         })
         this.form[2].addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.deactivateAll();
            this.form[0].value = '';
            this.isPlaying = false;
            this.progress = 0;
            this.rangeMin = 1
            this.rangeMax = 1

            this.rangeMinEl.setAttribute('min', 1)
            this.rangeMinEl.setAttribute('max', 1)
            this.rangeMinEl.setAttribute('value', 1)
            this.rangeMinEl.parentElement.children[0].innerText = `Min range`

            this.rangeMaxEl.setAttribute('min', 1)
            this.rangeMaxEl.setAttribute('max', 1)
            this.rangeMaxEl.setAttribute('value', 1)
            this.rangeMaxEl.parentElement.children[0].innerText = `Max range`
         })

         const playlistsText = document.querySelectorAll('#playlists .song')
         for (let song of playlistsText) {
            let notes = song.querySelector('.notes')
            let btn = song.querySelector('button')

            btn.addEventListener('click', () => {
               this.playThePiano(notes.innerText, timeDelay)
            })
         }
      }

   }
   const createPiano = (pianoId, a = 1, b = 4) => (new Piano(pianoId, a, b));


   const buyPiano = (id, a = 1, b = 4) => {
      const myPiano = document.getElementById(id);
      myPiano.classList.add('d-flex', 'flex-column', 'align-items-center')
      let content = '<div id="keys" class="d-flex flex-row">'
      for (let i = a; i <= b; ++i)
         for (let key of utility.keys)
            if (key.isSharp)
               content += utility.createWhiteBlackKey(id, key.name, i)
            else
               content += utility.createWhiteKey(id, key.name, i);

      content += '</div>'

      content += utility.form;

      myPiano.innerHTML = content;
   }

   return { buyPiano, createPiano };
})();


