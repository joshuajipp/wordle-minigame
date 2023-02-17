const gameState = {
    row: 0,
    col: 0,
    wordContent: Array(4).fill().map(() => Array(4).fill('')),
    word: "",
    hint: ""
}

const startOver = document.getElementById("start-over")


async function fetchData() {
    return fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv"
      }
    })
      .then(res => res.json())
      .then(data => data.dictionary)
      .then(selection => {return selection[Math.floor(Math.random()*selection.length)]})

      .catch(error => {
        console.error(error);
      });
  }



// async function fetchData() {
//     const res = await fetch("https://api.masoudkf.com/v1/wordle", {
//       headers: {
//         "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv"
//       }
//     });
  
//     const data = await res.json();
  
//     return data;
//   }
  
// const gameData = await fetchData();
    // console.log(res)
    // let data = await res.json()
    // console.log(data)
    // data = data.dictionary

    // let wordInfo = data[Math.floor(Math.random()*data.length)]
    // wordState.word = wordInfo.word
    // wordState.hint = wordInfo.hint
    


function countOccurrences(arr) {
    const counts = {};
    for (const item of arr) {
        counts[item] = counts[item] ? counts[item] + 1 : 1;
    }
    return counts;
}
      
function isLetter(input) {
    return /^[a-zA-Z]$/.test(input);
    }
      

function createGrid(parent){
    let gridElement = document.createElement("div");

    gridElement.className = "grid-container";

    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            createBox(gridElement, i, j);
        }
    }
    parent.appendChild(gridElement);

}

function clearGrid(parent){
    parent.innerHTML = "";
}

function winScreen(parent){
    clearGrid(parent)
    let imgElement = document.createElement("img")
    imgElement.src = "congratulations-gif-6.gif"
    parent.appendChild(imgElement)

}



function displayGrid(){

    for (let i = 0; i < gameState.wordContent.length; i++){
        for (let j = 0; j < gameState.wordContent[i].length; j++){   
            let box = document.getElementById(`${i}${j}`)         

            if ((j==gameState.col) && (i==gameState.row)){
                document.getElementById(`${i}${j}`).classList.add("is-hovered")
            }
            else{
                document.getElementById(`${i}${j}`).classList.remove("is-hovered")
            }


            
            box.textContent = gameState.wordContent[i][j]
        }
    }
}
function createBox(parent, row, col, char = ''){
    let boxElement = document.createElement("div");
    boxElement.className = "box";
    if ((row == 0) && (col == 0)){
        boxElement.classList.add("is-hovered")
    }
    boxElement.id = `${row}${col}`;
    boxElement.textContent = char;

    parent.appendChild(boxElement);
}

function colourBoxes(word){
    word = word.toLowerCase();
    let letterCount = countOccurrences(word); 
    
    for (let i = 0; i < gameState.col; i++){
        let box = document.getElementById(`${gameState.row}${i}`)
        if ((gameState.wordContent[gameState.row][i]).toLowerCase() === word[i]){
            box.classList.add("correct")
            letterCount[`${gameState.wordContent[gameState.row][i]}`] -= 1;

        }
    }
    for (i = 0; i < gameState.col; i++){
        let box = document.getElementById(`${gameState.row}${i}`)
        if (!(box.classList.contains("correct"))){
            if ((letterCount[`${gameState.wordContent[gameState.row][i]}`] != 0) && 
            (word.includes((gameState.wordContent[gameState.row][i]).toLowerCase()))){
                box.classList.add("partial");
                letterCount[`${gameState.wordContent[gameState.row][i]}`] -= 1
                }
            else{
                box.classList.add("incorrect");
            }
        }
    }

    for (i = 0; i < word.length; i++){
        if (gameState.wordContent[gameState.row][i].toLowerCase() != word[i]){
            return false;
        }
    }
    return true;   
}

// function manageInputs(wordData){
//     let canManageEvents = true;

//     const delayManageEvents = () => {
//       canManageEvents = true;
//     };
    const manageInputs = (ev) => {
        let key = ev.key;
        if (key === "Enter"){
            if (gameState.col == 4){
                let isCorrect = colourBoxes(gameState.word);
                if (isCorrect){
                    winScreen(document.getElementById("board"))
                    document.getElementById("tag-div").className = "correct-tag"
                    document.getElementById("hint").innerHTML = `You guessed <b>${gameState.word.toUpperCase()}</b> correctly!`
                    document.body.onkeydown = null;
                    document.getElementById("hint-button").onclick = null;
                    return;
                    
                }
                if (gameState.row == 3){
                    document.getElementById("tag-div").className = "incorrect-tag"
                    document.getElementById("hint").innerHTML = `You missed the word <b>${gameState.word.toUpperCase()}</b> and lost!`
                    document.body.onkeydown = null;
                    document.getElementById("hint-button").onclick = null;
                    return;
                }
                gameState.col = 0;
                gameState.row++;
            }
            else{
                window.alert("You must complete the word first!");
            }
        }
        if ((key === "Backspace") && (gameState.col != 0)){
            gameState.col--;
            gameState.wordContent[gameState.row][gameState.col] = '';
            
        }
        if (isLetter(key) && (gameState.col < (gameState.wordContent[gameState.row].length))){
            gameState.wordContent[gameState.row][gameState.col] = key;
            gameState.col++;
        }
        displayGrid();
        


    }
    // document.body.onkeydown = handleKeyDown
    // console.log("END FUCN")



function run(){
    const run = document.getElementById("board");
    createGrid(run);
    fetchData().then(wordData =>{
        gameState.word = wordData.word;
        gameState.hint = wordData.hint;
        document.getElementById("hint-button").onclick = function() {
            let element = document.getElementById("tag-div")
            element.classList.toggle("tags")
            element.classList.toggle("is-hidden")
        }

        document.body.onkeydown = manageInputs
        let element = document.getElementById("hint")
        element.innerHTML = `<i>Hint</i>: ${gameState.hint}`
    });
    //     console.log(gameState.isWinner)
    //     if (gameState.isWinner){
    //         window.alert("You won")
    //     }
    // ;
    



    

    // console.log(wordState.word)
    // const run = document.getElementById("board");
    // createGrid(run);
    // manageInputs();
}


startOver.addEventListener('click', () => {

    gameState.row = 0
    gameState.col= 0
    gameState.wordContent= Array(4).fill().map(() => Array(4).fill(''))

    clearGrid(document.getElementById("board"))
    document.getElementById("tag-div").className = "is-hidden"
    run();
    // displayGrid()
});

document.getElementById("dark-button").onclick = function(){
    document.querySelector("body").classList.toggle("is-black");
}
document.getElementById("rules-button").onclick = function(){
    document.getElementById("instr").classList.toggle("game-item")
    document.getElementById("instr").classList.toggle("is-hidden")
    
}



run();