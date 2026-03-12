//Adjective: Ominous

/* --- NOTES ---
14" MacbookPro Window Width: 1512px
14" MacbookPro Window Height: 982px
*/

let movement = 0; //gradient line progression

let counter = 0; //counts the time in between before each flicker
let flickerTime = 70; //everytime the counter reaches this number, the screen flickers
let blinkTime = 30; //determines how long the flicker/blinks lasts (based on the increments)
//the specific numbers produced above are chosen through trial and error, tested until my liking

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() { 
  background(255); //white

  gradient(); //for the background
  flicker(); //pulsating effect
}

function gradient() { //note: had to test a lot of trial and error math to make it work the way I imagined it to be
  stroke(0); //black
  
  for(let i = 0; i < windowHeight; i++) {
    let n = (i - movement % 400 + 400) % 400; //moves the gradient shift from top to bottom
    //first %400: cycles between 0-399 because I want it to show that many pixels per cycle on screen, so it should fit about 2 sets of gradient per computer screen
    //the +400: makes sure it stays a positive value (on screen)
    //last %400: brings it back into the 0-399 range for when it goes over 400 (when being added to it)

    let col; //variable for color of the line
    if (n < 200) { //middle value, half of 400, to determine the top or bottom of gradient color generation
      col = 150 - 150 * (n/200); //generates top half of gradient, makes it start from the top as gray making it darker to black as it decreases in value (as black is 0)
    } else {
      col = 150 * ((n-200)/200) //generates bottom half of gradient, makes it start from black to grey as it gains value making it lighter
      //starts from 150 instead of 255, because I do not want the white value
    }
    stroke(col); //line color
    line(0, i, windowWidth, i); //draws a line after each loop
  }
  movement += 5; //continous increment loop, can control speed 
}

function flicker() {
  counter ++;
  if (counter % flickerTime < blinkTime) {
    background(0); //black
  } else {} //nothing needs to happen, so nothing will be in the else statment (as it goes back to its original default form)
}

// NOTE TO SELF: FOR THE MOVING LIGHT, IT CAN BE LIKE CHASING THE CURSOR AS IT MOVES, EXAMPLE IN CLASS WITH THE m.disaply one is good to reference