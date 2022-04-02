const pianoEl = document.querySelector('#piano');
const key = ['C', 'D', 'E', 'F', 'G', 'A', 'B',]
const form = document.querySelector('#form');
const blackKeyAfter = ['C', 'D', 'F', 'G', 'A']
const convert = (note) => (key[key.indexOf(note) - 1]);
const sharp = 'S';
const flat = 'F'
let intervalId = 0;

const init = () => {

   // createPiano();
   // manageForm();
}

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

const manageForm = () => {

   clearInterval(intervalId);


   form.addEventListener('submit', (e) => {
      clearInterval(intervalId);
      e.preventDefault();

      let s = form[0].value.toUpperCase().replaceAll('#', sharp);

      const notes = convertToArr(s)
      let i = 0

      console.log(notes)


      intervalId = setInterval(function () {
         try {
            let keys = document.querySelectorAll('.key');
            for (let key of keys) key.classList.remove('bg-success');
            i++

            let keyId = notes[i % notes.length];
            let key = document.getElementById(keyId);
            key.classList.add('bg-success')

         } catch (e) {
            console.log(e);
            clearInterval(intervalId);
         }
      }, 1000)



   })


   form[2].addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      clearInterval(intervalId);

      let keys = document.querySelectorAll('.key');
      for (let key of keys) key.classList.remove('bg-success');
   })

}

const createWhite = (n, id) => (
   `<div id="${id}${n}" class="key white">  
   ${id} 
   </div>`
)


const createWhiteBlack = (n, id) => (
   `<div id="${id}${n}" class="key white">  
      ${id}
      <div id="${id}${sharp}${n}" class="key black">  
      ${id} 
      </div>
   </div>`
)

const createPiano = () => {
   let j = 3
   for (let i = 1; i <= 35; ++i) {

      let id = key[(j - 3) % key.length]
      let n = Math.floor(j / key.length) + 1

      if (blackKeyAfter.indexOf(id) != -1)
         pianoEl.innerHTML += createWhiteBlack(n, id);
      else
         pianoEl.innerHTML += createWhite(n, id)
      ++j;
   }
}


init();