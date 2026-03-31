//Adjective: Ominous

/* --- NOTES ---
14" MacbookPro Window Width: 1512px
14" MacbookPro Window Height: 982px
*/

let gradientSpeed = 5;
let movement = 0; //gradient line progression

let counter = 0; //counts the time in between before each flicker
let flickerTime = 70; //everytime the counter reaches this number, the screen flickers
let blinkTime = 30; //determines how long the flicker/blinks lasts (based on the increments)
//the specific numbers produced above are chosen through trial and error, tested until my liking

let x = 0; //circle starting x position
let y = 0; //circle starting y position

let num = 0; //used for the lines part; starting number to then allow it to increment and update the movement by frames
let lineSpeed = 0.2; //controls the speed of the moving lines

let screenSplatters = []; //keep a list/array of the current splatters on screen before it updates/changes
let splatterTime = 0; //going to be used to track the time through millis() (which we learned from class)
let splatterSize = 0; //starting point for the splatters to increase in size

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() { 
  background(255); // white

  let screenTime = millis() //no more loop, and just counting time

  if (screenTime < 7000) { //7 seconds
    flicker(); //pulsating effect
  } else if (screenTime < 12000) { //5 seconds
    gradient();
  } else if (screenTime <17000) { //5 seconds
    flickerTime = 50;
    blinkTime = 20;
    flicker();
  } else if (screenTime < 22000) { //5 seconds
    background(0); //black
    wavyLines();
  } else if (screenTime < 25000) { //3 seconds
    background(255); //white
    flickerTime = 30;
    blinkTime = 10;
    flicker() 
  } else if (screenTime < 400000) { //15 seconds
    background(0); //black
    splatter(); 
  } else { //remainder of the scene
    background(60, 6, 6); //blood crimson red
    splatter();
  }

  movingCircle(); //circle tailing cursor (like a light)
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
  gradientSpeed += 0.1;
  movement += gradientSpeed;
}

function flicker() { //simulating a blinking/flickering screen
  counter++; //frame increment
  if (counter % flickerTime < blinkTime) { //if it's within the increment time interval, it will blink for the blinkTime set amount of increment time
    background(0); //black
  } else {} //nothing needs to happen, so nothing will be in the else statment (as it goes back to its original default form)
}

function movingCircle() { //circle that follows the cursor around, similar to the vector examples learned in class
  //really helpful learning reference: https://www.geeksforgeeks.org/javascript/create-an-object-that-follows-the-mouse-pointer-using-p5-js/
  x += (mouseX - x) * 0.01; //inside the () is the distance from the cursor, as it gets closer; and the += is the constantly update the posiiton as it runs
  y += (mouseY - y) * 0.01; //the 0.01 refers to it being closing the gap by 1% each increment update as it continuously keeps looping; the smaller the percentage the slower the circle travels; this number was also chosen through trial and error
  noStroke();
  fill(200, 200); //light grey opaque "light"
  //note to self: opacity value is from 1-255
  ellipse(x, y, 100, 100);
}

function wavyLines() { //moving wiggly random generated lines in a semi diagonal pattern
  stroke(255); //white
  strokeWeight(1);
  noFill();

  lineSpeed = max(0.000000000000001, lineSpeed - 0.0007); //the smaller the value, the less movement, eventually making the movement almost stop
  num += lineSpeed; //adjusts the line movement for every frame/increment/update

  for (let i = 0; i < 200; i++) { //generates 200 lines displayed at a time
    beginShape(); //generates the start for each line
      for (let n = 0; n <= windowWidth; n += 10) { //marks a "turning" point for every 10px on screen moving horizontally (across the x axis)
        vertex(n, -900 + i*10 + n*0.3 + noise(n*0.002, i*0.5, num) * 200); //generates the points in between, going across the screen
        //note to self | vertex parameters: vertex (x, y) | noise parameters: noise(x, y, z); z: is (change in) time dimension
        /* --- HOW IT WORKS ---
        * it took so long to add and remix the variables and numbers to fit it perfectly to how I wanted it to drag across diagonally (from top left to bottom right)
        [Figuring out the how the y position works in the vertex]
        -900: is to push it (roughly 900px) off the screen (since the screen height is roughly 900px), so that the line can start from be generated diagonally and moving downwards from top left to bottom right
        i*10: each line is 10px lower than the precious line (in the y direction); without ut, all the lines would stack together
        n*0.3: makes sure that the y position moves down 0.4px in y direction (diagonally) for every 1px in x direction
        noise(): adds the "natural randomness"; without it would just be straight lines
        *200: makes sure that the vertical distance of each line remains within a 200px height

        * I discovered noise() through learning more about natural generation/movement methods 
        * note from LadyK: "noise gives you back a number that has some relation to the previous"
        * (instead of random, since they have no relation)
        [How the noise works]
        noise(n*0.002,  , ): subtle change in the x position every line
        noise( , 1*0.5, ): change in the y position of every line
        noise( , , z): movement over the frame/time it is updated
      */
      }
    endShape(); //generates the end for each line and connects all the points together
  }
}

function splatter() { //random paint-like objects appearing and dissapearing on screen
  if(millis() > splatterTime + max(100, 500 - splatterSize * 20)) { //making it move faster and faster
    splatterTime = millis(); //helps reset the time so it generates a new splatter when it reaches the proper incrementaiton time

    let splatterX = random(windowWidth); //random main paint dot X position
    let splatterY = random(windowHeight); //random main paint dot Y position
    let blobs = [] //for all the dots generated for a single splatter
    //these cannot be placed globally as it cannot run before the skecth starts

    //note to self: add the {} inside the push(); in order to add multiple variables at once
    blobs.push({ //adding the variables into the list (temporarily)
      splatterXPos: splatterX, //this part is creating the main center dot (then the smaller dots to create the splatter affect are generated around it)
      splatterYPos: splatterY,
      w: random(40, 80) * (1 + splatterSize * 0.1), //bigger each generation by 20%
      h: random(40, 80) * (1 + splatterSize * 0.1)
    }); 

    for (let i = 0; i < 8; i++) { //creates 8 small dots around each big splotch
      let position = random(TWO_PI); //random position around the blob center (any degree)
      let distance = random(10, 80) * (1 + splatterSize * 0.1); //random reasonable nearby distance from the center
      blobs.push ({ 
        splatterXPos: splatterX + sin(position) * distance, //from the center x position, adjust it in making a new random center and away and randomly around the original (main dot's) center
        splatterYPos: splatterY + cos(position) * distance, //same but for y position
        //note: sin and cos doesn't matter which one is where, but they cannot be the same for x and y or else it will make a diagonal, whereas I want it to be scattered
        w: random(5, 25) * (1 + splatterSize * 0.1), //these variables are added so that the dots generated are natural looking and not mostly just circular/round
        h: random(5, 25) * (1 + splatterSize * 0.1)
      }); 
    }
    screenSplatters.push({blobby: blobs, frameTime: 0}) //adds the generated splatter to the current list (temporarily, as it will be removed later)
    splatterSize++; //keeps increasing the size of the splatters
  }
  
  for(let i = 0; i < screenSplatters.length; i++) { //for the amount of splatters on screen
    let nextBlob = screenSplatters[i]; //grabbing the next splatter from the temporary list
    noStroke(); 
    fill(60, 6, 6); //blood crimson color

    for(let n = 0; n < nextBlob.blobby.length; n++){ //for the blob in the list, then moving on to the item after
      let specificBlob = nextBlob.blobby[n]; //labelling the specific blob for that instance in the loop to refer to
      ellipse(specificBlob.splatterXPos, specificBlob.splatterYPos, specificBlob.w, specificBlob.h); //create/draw the actual sploth (main dot) and surrounding dots
    }
    nextBlob.frameTime += 1; //increases/increments to the next frame
  }

  for(let i = screenSplatters.length - 1; i >= 0; i--) { //goes from the oldest (earliest) inserted splatter in the list
    if(screenSplatters[i].frameTime >= 120) { //for splatters older than 120 frames
      screenSplatters.splice(i, 1); //splice() is used to remove the item from that position in the array
    }
  }
}