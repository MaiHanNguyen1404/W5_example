document.body.style.margin   = 0
document.body.style.overflow = `hidden`

import { PixelSorter } from "/pixel_sort_class.js"

const cnv  = document.getElementById (`pixelsort_portrait3`)
cnv.width  = innerWidth
cnv.height = innerHeight/-2

const ctx = cnv.getContext (`2d`)

// Creates an instance of a PixelSorter class with context as a parameter
const sorter = new PixelSorter (ctx) 

// Create a new image element
const img = new Image () 

// Define a function to run new image once the image has loaded its data
img.onload = () => {

    // Adjusts the canvas height 
    // based on the image's aspect ratio
    cnv.height = cnv.width * (img.height / img.width)

    // Call the draw function with the new image as the argument 
    // draw the image to the canvas
    ctx.drawImage (img, 0, 0, cnv.width, cnv.height)

    // Call the innit fuction of the sorter
    sorter.init ()

    // Call the draw_frame function
    draw_frame ()
}

// The image source
img.src = `glitch_hw.jpg` 

let frame_count = 0

// Define a draw_frame function
const draw_frame = () => {

    // Draw the image 
    //(image, dx, dy, dWidth, dHeight)
    ctx.drawImage (img, 0, 0, cnv.width, cnv.height) 

    // Math.cos returns a value oscillates between -1 and 1
    // Oscillates back and forth as the frame_count increases, creating a wave-like pattern
    // Create a sig value for shimmering (wave) effect
    let sig = Math.cos (frame_count * 2 * Math.PI / 500)

    // Variable to indicate the center of the canvas
    const mid = {
        x: cnv.width/5,
        y: cnv.height/5
    }

          // Dimesions of the pixel sorting area
      // based on the sig value and the canvas size
      const dim = {
        x: Math.floor ((sig + 3) * (cnv.width)) + 1,
        y: Math.floor ((sig + 1) * (cnv.height / 6)) + 1
     }

     // Position of the pixel sorting area
     // relative to the center of the canvas 
     const pos = {
        x: Math.floor (mid.x - (dim.x / 2)),
        y: Math.floor (mid.y - (dim.y / 2))
     }

     // Call the glitch function of the sorter
     sorter.glitch (pos, dim)

     // Increments the frame counter for animation
     frame_count++
     requestAnimationFrame (draw_frame)
}



    