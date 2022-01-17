let container = document.querySelector('#container');
let startBtn = document.querySelector('#startBtn');
let restartBtn = document.querySelector('#restartBtn');
let score = document.querySelector('#score');
let winner = document.querySelector('#win')
let topScore = document.querySelector('#topScore')
let prevClick = {};
let tries = 0;
let matches = [];
let bestScore = localStorage.getItem('bestScore');

//symbols from w3schools UTF-8 code
let symbols = ['&#9818;', '&#9818;', '&#9819;', '&#9819;', '&#9820;', '&#9820;', '&#9821;', '&#9821;', '&#9822;', '&#9822;']

//fisher-yates shuffle function from Springboard starter code
function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

function startGame() {
    if(bestScore){
        topScore.innerText = `Your Best Score: ${bestScore}`;
    }
    let tagId = 0;
    let shuffled = shuffle(symbols);
    if(container.childElementCount === 0){
        for(let symbol of shuffled){
            let tile = document.createElement('div');
            tile.innerHTML = symbol
            container.append(tile);
            tile.setAttribute('data-id', tagId)
            tagId++
        }
    tileReset()    
    }
}  

function tileReset(){
    //disable click events for 1 second on the tile's parent element after two clicks have been made
    container.className = 'mouseTimeOut'
    setTimeout(() => {
        let tiles = container.children
        for(let tile of tiles){
            if(!tile.className){
            tile.className = 'hidden'
            }
        }
         container.className = ''
    }, 1000)
}

//matching and clicking logic
container.addEventListener('click', function(e){
    //if there is no previous click, reveal (remove hidden class) the tile and capture the id and innerHTML in a variable
    if(e.target.tagName === 'DIV' && !prevClick.id){
        e.target.className = '';
        prevClick.id = e.target.dataset.id;
        prevClick.symbol = e.target.innerHTML;
        tries++;
    //if there is a previous click, reveal the tile then...
    }else if (e.target.tagName === 'DIV'  && prevClick.id){
        e.target.className = '';
        //if the symbols match but the ids are different, add the class of matched, clear the previous click, check for win condition and reset
        if(e.target.innerHTML === prevClick.symbol && e.target.dataset.id !== prevClick.id){
             let tiles = container.children
             for(let tile of tiles){
                if(!tile.className){
                    tile.className = 'matched'
                    matches.push(tile);
                }
            }
            tries++;
            prevClick = {};
            gameOver()
            tileReset();
        //if not a match, clear the previous click and reset the tiles
         }else{
            tries++;
            prevClick = {};
            tileReset();   
         }
    }
    score.innerText = `Score: ${tries}`;
})

function restart() {
    container.innerHTML='';
    tries = 0;
    matches = []
    score.innerText = '';
    winner.innerText = '';
    startGame()
}

function gameOver() {
    if(matches.length === 10){
        winner.innerText = 'YOU WIN!'
        if(!bestScore || tries < bestScore)
        localStorage.setItem('bestScore', tries)
        bestScore = localStorage.getItem('bestScore');
        topScore.innerText = `Your Best Score: ${bestScore}`
    }
}


startBtn.addEventListener('click', startGame)
restartBtn.addEventListener('click', restart)
