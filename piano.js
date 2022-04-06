const pianoModule = (() => {
   'use strict';

   class Key {
      constructor(pianoId, keyId, oktawa) {
         this.id = keyId.toUpperCase();
         this.oktawa = oktawa;
         this.key = document.getElementById(pianoId + this.id + this.oktawa);
         this.sound = new Audio(`/sounds/${(this.id + oktawa).toLowerCase().replace('s', '-')}.mp3`)
      }
      activate(className = 'bg-success') {
         if (this.key != undefined) { this.key.classList.add(className); this.key.classList.add('text-white') }
         this.sound.play();

      }
      deactivate(className = 'bg-success', stopSound = true) {
         if (this.key != undefined) { this.key.classList.remove(className); this.key.classList.remove('text-white') }
         if (stopSound) {
            this.sound.pause();
            this.sound.currentTime = 0;
         }
      }
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
         this.progressBarCounterEl = document.querySelector(`#${this.pianoId} form #progressBarCounter`)
         this.rangeMinEl = document.querySelector(`#${this.pianoId} form #rangeMin`)
         this.rangeMaxEl = document.querySelector(`#${this.pianoId} form #rangeMax`)
         this.rangeDelay = document.querySelector(`#${this.pianoId} form #rangeDelay`)
         this.timeDelay = 750
         this.start = 1
         this.stop = 1
         this.notes = []
         this.keyboard = ''
      }

      setupKeys() {
         for (let i = this.lowest; i <= this.highest; ++i)
            for (let key of utility.keys)
               if (key.isSharp) {
                  this.keys[`${key.name}${i}`] = createKey(this.pianoId, key.name, i);
                  this.keys[`${key.name}S${i}`] = createKey(this.pianoId, key.name + 'S', i);
               } else
                  this.keys[`${key.name}${i}`] = createKey(this.pianoId, key.name, i);
      }
      deactivateAll(className, stopSound = true) {
         for (let key in this.keys)
            this.keys[key].deactivate(className, stopSound)
      }
      resetRange(a = 1, b = 1) {
         this.deactivateAll();
         this.isPlaying = false
         this.updateProgress(a)
         this.start = a
         this.stop = b

         this.rangeMinEl.setAttribute('min', this.start)
         this.rangeMinEl.setAttribute('max', this.stop)

         this.rangeMaxEl.setAttribute('min', this.start)
         this.rangeMaxEl.setAttribute('max', this.stop)

         this.rangeMinEl.value = this.start;
         this.rangeMaxEl.value = this.stop;

         if (this.notes.length) {
            this.progressBar.style.width = '1%';
            // this.progressBar.style.width = `${(this.progress) * 100 / this.notes.length}%`;
            this.rangeMinEl.parentElement.children[0].innerText = `Min range : ${this.start}`
            this.rangeMaxEl.parentElement.children[0].innerText = `Max range : ${this.stop}`
         }
         else {
            this.progressBar.style.width = '1%';
            this.rangeMinEl.parentElement.children[0].innerText = `Min range`
            this.rangeMaxEl.parentElement.children[0].innerText = `Max range`
         }
      }
      updateProgress(value) {
         this.progress = value
         this.progressBarCounterEl.innerText = this.progress
      }
      async loop() {
         this.deactivateAll();

         if (this.progress > this.stop) {
            this.updateProgress(this.start)
            this.progressBar.style.width = `${(this.progress - 1) * 100 / this.notes.length}%`;
            await utility.delay(2 * this.timeDelay);
            if (!this.isPlaying) return;
         }

         for (let keyId of this.notes[this.progress - 1])
            this.keys[keyId].activate();
         // this.keys[this.notes[this.progress - 1]].activate();
         this.progressBar.style.width = `${(this.progress) * 100 / this.notes.length}%`;
         await utility.delay(this.timeDelay);
         this.updateProgress(this.progress + 1);

      }
      async playThePiano(data) {
         if (this.isPlaying) {
            this.deactivateAll()
            this.isPlaying = false
            await utility.delay(2 * this.timeDelay)
         } else
            await utility.delay(this.timeDelay)

         this.notes = utility.convertToArr(data)
         if (!this.notes[0].length) {
            utility.appendAlert('You either need to provide some notes in the form field or choose a track to play...', 7000, 500);
            return
         }

         this.resetRange(1, this.notes.length)

         try {
            this.isPlaying = true;
            while (this.isPlaying)
               await this.loop();
         } catch (e) {
            alert(e)
            this.resetRange(1, 1)
         }
      }
      updateRange() {
         this.start = Number(this.rangeMinEl.value);
         this.stop = Number(this.rangeMaxEl.value);

         this.rangeMinEl.setAttribute('max', this.stop - 1)
         this.rangeMaxEl.setAttribute('min', this.start + 1)

         this.rangeMinEl.parentElement.children[0].innerText = `Min range : ${this.start}`
         this.rangeMaxEl.parentElement.children[0].innerText = `Max range : ${this.stop}`
         this.updateProgress(this.start)
      }
      async recordKey(keyId) {
         try {
            document.querySelector('#records .rec').innerHTML += ' ' + keyId + ' ';
         } catch (e) {
            console.log(e)
         }

         this.deactivateAll('bg-danger', true);
         this.keys[keyId].activate('bg-danger');
         await utility.delay(this.timeDelay);
         this.keys[keyId].deactivate('bg-danger');
      }
      recordMultipleKeys(keyId) {
         try {
            document.querySelector('#records .rec').innerHTML += keyId + '&';
         } catch (e) {
            console.log(e)
         }
         this.keys[keyId].activate('bg-danger');
      }
      setupEventListeners() {

         this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.playThePiano(this.form[0].value)
         })
         this.rangeMinEl.addEventListener('input', () => {
            this.updateRange();
         })
         this.rangeMaxEl.addEventListener('input', () => {
            this.updateRange();
         })
         this.rangeDelay.addEventListener('input', () => {
            this.timeDelay = Number(this.rangeDelay.value);
            this.rangeDelay.parentElement.children[0].innerText = `Delay : ${this.timeDelay}`
         })
         this.form[2].addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.form[0].value = '';
            this.notes = [];
            this.resetRange();
            try {
               document.querySelector('#records .rec').innerHTML = '';
            } catch (e) {
               console.log(e)
            }
         })

         const playlistsText = document.querySelectorAll('#playlists .song')
         for (let song of playlistsText) {
            let notes = song.querySelector('.notes')
            let btn = song.querySelector('button')
            btn.addEventListener('click', () => {
               this.playThePiano(notes.innerText)
            })
         }

         document.addEventListener('keydown', (e) => {
            this.keyboard = e.key
         })
         document.addEventListener('keyup', (e) => {
            if (this.keyboard == e.key) {
               this.keyboard = null
               try {
                  document.querySelector('#records .rec').innerHTML += '&nbsp;';
                  this.deactivateAll('bg-danger')
               } catch (e) {
                  console.log(e);
               }
            }
         })
         for (let keyId in this.keys) {
            this.keys[keyId].key.addEventListener('click', async (e) => {
               if (this.isPlaying) this.resetRange();
               e.stopPropagation();
               console.log(this.keyboard)

               if (this.keyboard == 'Alt') this.recordMultipleKeys(keyId)
               else await this.recordKey(keyId)

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

      content += '</div>' + utility.form;

      myPiano.innerHTML = content;
   }

   return { buyPiano, createPiano };
})();


