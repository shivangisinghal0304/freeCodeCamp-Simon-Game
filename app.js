const el = {
  1: document.getElementById('red'),
  2: document.getElementById('green'),
  3: document.getElementById('blue'),
  4: document.getElementById('yellow'),
  sound: document.getElementById('sound'),
  turn: document.getElementById('turn'),
  turn_on: document.getElementById('on'),
  turn_off: document.getElementById('off'),
  start: document.getElementById('start-btn'),
  strict: document.getElementById('strict-btn'),
  strict_ind: document.querySelector('.strict-ind'),
  count: document.getElementById('count-table')
}

const sounds = {
  1: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
  2: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
  3: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
  4: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
}

let state, chain, timeout, audio;

function enterButton(btn) {
  
  el[btn].addEventListener('mousedown', function () {
    if (state.start && state.turnUser) {
  
      if (state.n < chain.length) {
          audio = new Audio();
          audio.src = sounds[btn];
          el[btn].classList.add('active');
          audio.play();

        if (chain[state.n] === Number(btn)) {
          state.n++;         
        } else {
          state.n = 0;
          el.count.textContent = '!!';
         
          setTimeout(function() {
            el.count.textContent = chain.length;
            if (state.strict) {
              chain = [];
              gameComp();
            } else {
              playChain();    
            }
          }, 1000);
        } 
      }

    }
  });

  el[btn].addEventListener('mouseup', function () {
    if (state.n === 20) {
      init();
      el.turn_off.classList.toggle('active');
      el.turn_on.classList.toggle('active');
      el.count.textContent = 'Win';
      el.count.classList.add('win');

    } else if (state.start && state.turnUser) {
      this.classList.remove('active');
      if (state.n === chain.length){
        state.turnUser = 0;
        gameComp();
      }
    }
  });
}

function gamePlayer() {
  for (let key in sounds) {
      enterButton(key);
  }
}



el.turn.addEventListener('click', function () {
  state.begin = 1 - state.begin;
  if (!state.begin) {
    init();
  }
  el.count.textContent = '--';
  el.count.classList.remove('win');

  el.turn_off.classList.toggle('active');
  el.turn_on.classList.toggle('active');
});

el.start.addEventListener('click', function () {
  if (state.begin && !state.start) {
    state.start = 1;
    this.classList.add('active');
    gameComp();
  }
});

el.strict.addEventListener('click', function () {
  if (state.begin) {
    state.strict = 1 - state.strict;
    el.strict_ind.classList.toggle('active');
  }
});

function gameComp() {
  state.n = 0;
  let newSound = Math.floor(Math.random() * 4) + 1;

  chain.push(newSound);

  playChain();
}

function playChain() {
  audio = new Audio();
  let n = chain.length;
  el.count.textContent = n;
  
  if (n > 0) {
    audio.src = sounds[chain[0]];
    timeout.push(setTimeout(function () {
      el[chain[0]].classList.add('active');
      audio.play();
    }, 1000));

    timeout.push(setTimeout(function () {
      el[chain[0]].classList.remove('active');
    }, 2000));

  }

  let i = 0;

  audio.addEventListener('ended', function () {
    i++;

    if (i < n) {

      timeout.push(setTimeout((function (N) {
        return function () {

          audio.src = sounds[chain[N]];
          el[chain[N]].classList.add('active');
          audio.play();
        }
      })(i), 1000));

      timeout.push(setTimeout((function (N) {
        return function () {
          el[chain[N]].classList.remove('active');
        }
      })(i), 2000));

    } else if (i === n) {
      timeout.push(setTimeout((function (N) {
        return function () {
          state.turnUser = 1;
          initTimeout();
          
        }
      })(i), 0));
    }
  }, false);
}

function init() {
  state = {
    begin: 0,
    start: 0,
    turnUser: 0,
    n: 0,
    strict: 0
  };

  el.start.classList.remove('active');
  el.strict_ind.classList.remove('active');
  el.count.textContent = '--';
  el.count.classList.remove('win');

  chain = [];
  
  initTimeout();
}

function initTimeout() {
  if (timeout && timeout.length > 0){
    audio.pause();
    for(let i=1; i <= 4; i++){
      el[i].classList.remove('active');
    }
    timeout.forEach(function(item) {
      clearTimeout(item);
    });
  }
  timeout = [];
}

gamePlayer();
init();