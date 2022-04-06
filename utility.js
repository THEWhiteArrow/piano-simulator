const utility = (() => {
   'use strict';
   const SHARP = '-';
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
      // ##### NEW CODE #####
      return [...text.toUpperCase().split(' ')].map((el) => ([...el.split('&').filter((item) => (item != ''))]))


      // ##### OLD CODE - I AM LEAVING IS AS IS JUST AS A PROOF THAT REFACTORING MAKES THE DIFFERENCE #####

      // text = (text + ' ').toUpperCase().replaceAll('#', 'S')
      // const arr = []
      // for (let i = 0; i < text.length; ++i)
      //    if (text[i] != ' ')
      //       for (let j = i + 1; j < text.length; ++j)
      //          if (text[j] == ' ') {
      //             arr.push(
      //                [...text.substr(i, j - i).split('&')].filter((el) => (el != ''))
      //             )
      //             i = j;
      //             break;
      //          }
      // return arr;
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
         <div id="progressBarCounter" class="fs-6 text-center">0</div>
         <div id="progressBarTrack" class="bar d-flex bg-dark">
            <div id="progressBar" class="bar bg-danger"></div>        
         </div>
         <div class="input-group mb-2">
            <input type="text" class="form-control" placeholder="Notes" aria-label="Notes">
         </div>
         <div class="d-flex">
            <button class="btn btn-success d-flex col-10 justify-content-center">Start </button>
            <button class="btn btn-warning text-white d-flex col-2 justify-content-center">Stop / Clear</button>
         </div>
         <div class="d-flex row">
            <div class="d-flex col-4 flex-column">
               <label for="rangeMin" class="form-label">Min range</label>
               <input type="range" class="form-range" id="rangeMin" step="1" min="1" max="1">
            </div>   
            <div class="d-flex col-4 flex-column">
               <label for="rangeMax" class="form-label">Max range</label>
               <input type="range" class="form-range" id="rangeMax" step="1" min="1" max="1">
            </div>
            <div class="d-flex col-4 flex-column">
               <label for="rangeDelay" class="form-label">Delay : 750</label>
               <input type="range" class="form-range" id="rangeDelay" step="1" min="100" max="2000" value="750">
            </div>
         </div>  
      </form>
   `
   const removeEl = async (el, animationspan) => {
      el.classList.add('fadeOut');
      await delay(animationspan);
      el.remove();
   }

   const appendAlert = async (text, timespan = 5000, animationspan = 500) => {
      window.scrollTo(0, 0);
      const alertSection = document.createElement('section');
      alertSection.classList.add('bg-danger', 'alert', 'rounded-0', 'position-absolute', 'fadeIn', 'w-100')
      alertSection.style.animationDuration = animationspan + 'ms';
      alertSection.innerHTML = `
         <div class="container">
            <div class="row">
         
               <div class="col-10 d-flex flex-column align-items-center">
                  <h5 class="mb-1 fs-4">ALERT!</h5>
                  <span class="fs-6">
                     ${text}
                  </span>
               </div>
               <button class="col-2 btn btn-danger fs-5 shadow">X</button>

            </div>
         </div>
      `
      document.body.prepend(alertSection);

      alertSection.querySelector('button').addEventListener('click', () => { removeEl(alertSection, animationspan) })
      await delay(timespan);
      removeEl(alertSection, timespan, animationspan)
   }


   return { keys, delay, convertToArr, createWhiteKey, createWhiteBlackKey, form, SHARP, appendAlert };
})();