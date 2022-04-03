const utility = (() => {
   'use strict';
   const keys = [
      { name: 'A', isSharp: true },
      { name: 'B', isSharp: false },
      { name: 'C', isSharp: true },
      { name: 'D', isSharp: true },
      { name: 'E', isSharp: false },
      { name: 'F', isSharp: true },
      { name: 'G', isSharp: true },
   ];


   const delay = (time) => {
      return new Promise((resolve, reject) => {
         setTimeout(() => {
            resolve();
         }, time)
      })
   }


   const convertToArr = (text) => {
      text = (text + ' ').toUpperCase().replaceAll('#', 'S')

      const arr = []
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



   const createWhiteKey = (pianoId, name, oktawa) => (
      `<div id="${pianoId}${name}${oktawa}" class="key white">${name}${oktawa}</div>`
   )
   const createWhiteBlackKey = (pianoId, name, oktawa) => (
      `
      <div id="${pianoId}${name}${oktawa}" class="key white">
         ${name}${oktawa}
         <div id="${pianoId}${name}S${oktawa}" class="key black">${name}</div>
      </div>
      `
   )

   const form = `
      <form id="form" class="mt-5 mb-3 px-0 d-flex flex-column container">
         <div id="progressBarTrack" class="bar d-flex bg-dark">
            <div id="progressBar" class="bar bg-danger" style="width:0%;"></div>  
         </div>
         <div class="input-group mb-2">
            <input type="text" class="form-control" placeholder="Notes" aria-label="Notes">
         </div>
         <div class="d-flex">
            <button class="btn btn-success d-flex col-10 justify-content-center">Start </button>
            <button class="btn btn-warning text-white d-flex col-2 justify-content-center">Stop </button>
         </div>
         <div class="d-flex row">
            <div class="d-flex col-6 flex-column">
               <label for="rangeMin" class="form-label">Min range</label>
               <input type="range" class="form-range" id="rangeMin" step="1" min="1" max="1">
            </div>   
            <div class="d-flex col-6 flex-column">
               <label for="rangeMax" class="form-label">Max range</label>
               <input type="range" class="form-range" id="rangeMax" step="1" min="1" max="1">
            </div>
         </div>  
      </form>
   `

   return { keys, delay, convertToArr, createWhiteKey, createWhiteBlackKey, form };
})();