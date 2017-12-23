/*
 * Create a list that holds all of your cards
 */
var cards = ["fa fa-diamond" , "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o",
            
             "fa fa-anchor" , "fa fa-anchor" , "fa fa-bolt" , "fa fa-bolt",
             
             "fa fa-cube" , "fa fa-cube" , "fa fa-leaf", "fa fa-leaf",
            
             "fa fa-bicycle" , "fa fa-bicycle" , "fa fa-bomb" , "fa fa-bomb", 
            ];
var count = 0;

var openedCards = [];

var moves = 0;

var moveText = document.getElementsByClassName("moves");

var timerText = document.getElementById("time");

var isFirstTime = true;

var t = null;

var stars = document.getElementsByClassName("stars").item(0);

var time = null;

var tempCards = [];

/*
 * Modal on successful completion of game
 */

/*
 * Remove any whitespace as text in childnode list
 */
clean(stars);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
var showCards = function(item){
    var handler = function(event){
        if(isFirstTime){
            isFirstTime = false;
            startTimer(timerText);
        }
        item.setAttribute("class" , "card open show");
        addOpenedCard(item);
        item.removeEventListener("click" , handler);
    };
    return handler;
};

createCards(cards);


function createCards(array){
    for(var i  = 0; i < array.length; i++){
        var symbol = document.createElement("i");
        symbol.setAttribute("class" , array[i]);
        var li = document.createElement("li");
        li.appendChild(symbol);
        li.setAttribute("class" , "card");
        document.getElementById("deck").appendChild(li);
    }
    setListener();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function setListener(){
    var listItems = document.getElementById("deck").getElementsByTagName("li");
    for(var i = 0; i < listItems.length; i++){
        listItems[i].addEventListener("click" , showCards(listItems[i]));
        
    }
    
    document.getElementsByClassName("restart").item(0).addEventListener("click" , resetGame);
}



function addOpenedCard(card){
    isMatched = false;
    tempCards.push(card);
    console.log(tempCards);
    if(tempCards.length === 2){
        isMatched = match();
        incrementMoves(isFirstTime);
    }
}


function match(){
    console.log(tempCards[0].firstChild.getAttribute("class"));
    console.log(tempCards[1].firstChild.getAttribute("class"));
    if(tempCards[0].firstChild.getAttribute("class") === tempCards[1].firstChild.getAttribute("class")){
        lockCards(tempCards[0],tempCards[1]);
        return true;
    }else{
        setTimeout(function(){
            closeOpenedCards(tempCards[0],tempCards[1]);
        },500);
        return false;
    }
}


function lockCards(firstCard,secondCard){
    firstCard.setAttribute("class" , "card match");
    secondCard.setAttribute("class" , "card match");
    openedCards.push(firstCard);
    openedCards.push(secondCard);
    tempCards = [];
    console.log(tempCards);
}


function closeOpenedCards(firstCard,secondCard){
    firstCard.setAttribute("class" , "card");
    secondCard.setAttribute("class" , "card");
    console.log("first card",firstCard.firstChild.getAttribute("class"));
    console.log("second card", secondCard.firstChild.getAttribute("class"));
    tempCards = [];
    console.log(tempCards);
    //setListener();
}

function incrementMoves(isMatched){
    if(!isMatched){
        moves++;
        moveText.item(0).innerHTML = moves;
    }
    controlStarCount();
    checkGameOver();
}

function resetGame(){
    resetStars();
    document.getElementById("deck").innerHTML = "";
    createCards(shuffle(cards));
    openedCards = [];
    moves = 0;
    moveText.item(0).innerHTML = 0;
    clearInterval(t);
    isFirstTime = true;
    timerText.textContent = "";
}


function startTimer(display) {
    var hours = 0 , seconds = 0 , minutes = 0; 
      t = setInterval(function(){
            seconds++;
            if (seconds >= 60) {
            seconds = 0;
            minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        
            time =  (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
            display.textContent = time;
            
        }, 1000);
        
}

function controlStarCount(){
    if(moves === 10){
        stars.removeChild(stars.childNodes[0]);
    }
    if(moves === 16){
       stars.removeChild(stars.childNodes[0]);  
    }
}
 
function checkGameOver(){
    if(openedCards.length === 16){
        clearInterval(t);
        triggerModal(moves,time)
    }
}


function triggerModal(moves,time){
    var modal = document.getElementById("success-modal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    document.getElementById("totalTimeTaken").textContent = time;
    document.getElementById("totalMoves").textContent = moves;
    span.onclick = function(){
        modal.style.display = "none";
        resetGame();
    }
}

function resetStars(){
    var list = document.getElementsByClassName("stars").item(0);
    list.innerHTML = "";
    for(var i = 0; i < 3; i++){
        var star = document.createElement("i");
        star.setAttribute("class" , "fa fa-star");
        var li = document.createElement("li");
        li.appendChild(star);
        list.appendChild(li);
    }
}


function clean(node){
    
  for(var n = 0; n < node.childNodes.length; n ++){
      
    var child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    ){
        
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1){
      clean(child);
    }
  }
}
