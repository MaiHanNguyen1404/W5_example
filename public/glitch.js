document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const cnv = document.getElementById (`glitch_portrait`)

// Setting canvas size
cnv.width = innerWidth/2
cnv.height = innerHeight

// Set canvas background to dark blue
cnv.style.backgroundColor = `dark blue`

// Getting canvas context
const ctx = cnv.getContext (`2d`)

// Instatiating variable for the image data
let img_data

// Define a function to draw an image to the canvas 
const draw = i => ctx.drawImage (i, 0, 0, cnv.width, cnv.height) 
//(image, dx, dy, dWidth, dHeight)

// Create a new image element 
const img = new Image () 

// Define a function to run new image once the image has loaded its data
img.onload = () => {

  // Adjusts the canvas height 
  // based on the image's aspect ratio
  cnv.height = cnv.width * (img.height / img.width) 

  // Draw the image to the canvas
  draw (img) 

  // Set the canvas data into a image data
  // Storing image data as string in img_data
  img_data = cnv.toDataURL ("image/jpeg") 

  // Call the add_glitch function 
  add_glitch () 
}

// The image source 
img.src = `/glitch.JPG` 

// Define a function to generate random integer 
// within the maximum range (0 to max, excluding max)
const rand_int = max => Math.floor (Math.random () * max)

// Define a recursive function 
const glitchify = (data, chunk_max, repeats) => {

    // Picks a random chunk size 
    // multiple of 4 between 0 and chunk max
    const chunk_size = rand_int (chunk_max / 4) * 4 

    // Select random position in image data 
    // between 24 and chunk size 
    // (excluding the first 24 bytes and the glitch chunk size)
    const i = rand_int (data.length - 24 - chunk_size) + 24

    // Remove the first part of the data to i
    // Grabing all the data before random position
    const front = data.slice (0, i) 

    // Leaving the gap the size of chunk size
    // Grabing the rest of the data
    const back = data.slice (i + chunk_size, data.length) 

    // Combining the front and back portions of the selected data
    // leaving out the chunk size
    const result = front + back 

    // Call the function recursively with repeats - 1
      // stops executing the function when repeats reach 0
      // ? ternary operator
      return repeats == 0 ? result : glitchify (result, chunk_max, repeats - 1) 
}

// Create an empty glitch array for glitched images  
const glitch_arr = []

// Define function to add multiple glitched image 
// to the glitch_arr array
const add_glitch = () => {

   // Create new image objects for each glitched version.
   const i = new Image () 

   // Define function that executes when image receives its data
   i.onload = () => { 

      // Push the glitched image object into the glitch array
      glitch_arr.push (i)

      // Recursively call the add_glitch function 
      // until there are 12 glitched images
      if (glitch_arr.length < 12) add_glitch () 

      // Stop animating once there are 12 images
      else draw_frame () 
   }

   // Give the new image some glitchtified image data
   i.src = glitchify (img_data, 96, 6)
}

 // Instatiate variable to keep track of glitch state
 let is_glitching = false 

 // Keep track of which glitched image from the array we are using
 let glitch_i = 0 

 // Define a draw_frame function
 const draw_frame = () => {

    // Continue to draw the first item of the glitch array if draw_frame is false 
    // Check to see if we are glitching
    // if so, draw the glitched image from the array
    if (is_glitching) draw (glitch_arr[glitch_i]) 

    // Otherwise draws the original image
    else draw (img) 

    //Probability if is_glitching is true: 5% - currently display the glitched image
    //Probability if is_glitching is false: 2% - currently display the original image
    const prob = is_glitching ? 0.05 : 0.02

    // If a random number between 0 to 1 (< 1) is less than the probability
    if (Math.random () < prob) {

        // Choose a random glitched image index
        glitch_i = rand_int (glitch_arr.length) 

        // Switch between displaying the glitched image and the original image
        is_glitching = !is_glitching 
    }
        
    // Call the next animation frame
    requestAnimationFrame (draw_frame)
}


