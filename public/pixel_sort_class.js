const quicksort = a => {

    // If array 'a' length reaches 1, return the original array length
    if (a.length <= 1) return a
 
    // Take the first element of the array 'a' as the pivot element 
    let pivot = a[0]
 
    // Create an empty left array
    let left = []
 
    // Create an empty right array
    let right = []
 
    // Iterate through the remaining elements of the array 
    // exclude the first element
    for (let i = 1; i < a.length; i++) {
 
       // If the current element's brightness (a[i].br) is less than the pivot's, 
       // push the element to the left array
       if (a[i].br < pivot.br) left.push (a[i])
 
       // Otherwise, push the element to the right array
       else right.push (a[i])
    }

    // ()... means Spread Operators to to spread array values or iterables into an array)
   // Create a sorted array 
   // with result of recursively sorting the left array, 
   // the original pivot element (a[0]),
   // and result of recursively sorting the right array 
   const sorted = [ ...quicksort (left), pivot, ...quicksort (right) ]

   // Return the sorted array 
   // in descending order based on the brightness value
   return sorted
}

export class PixelSorter {
    // PixelSorter class with context as a parameter
    constructor (ctx) {
       this.ctx = ctx
    }
 
    // Define function for initialize
    init () {
 
       // Set the initial size
       // based on the canvas size
       this.width = this.ctx.canvas.width
       this.height = this.ctx.canvas.height
 
       // Method getImageData() returns an ImageData object 
       // representing the underlying pixel data for a specified portion of the canvas
       // Store the image data on the canvas in img_data
       this.img_data = this.ctx.getImageData (0, 0, this.width, this.height).data
    }

    // Define function for the glitch effect 
   // using position and dimesion as the arguments 
   // defining the area within the image to be sorted
   glitch (pos, dim) {

    // Define find_i function with c as the argument
    // to calculate the corresponding index in the image data array,
    // based on the x and y coordinates of a pixel within the canvas
    const find_i = c => ((c.y * this.ctx.canvas.width) + c.x) * 4 
    // 4 represent red, green, blue, and alpha

    // Iterate through each horizontal line (x) within the dimesion (in the argument)
    for (let x_off = 0; x_off < dim.x; x_off++) {

       // Create an empty positions array
       const positions = []

       // Iterate through each vertical line (y) within the dimesion (in the argument)
       for (let y_pos = pos.y; y_pos < pos.y + dim.y; y_pos++) {

          // Use the find_i function 
          // to calculate the index of the pixel at the current position  
          // then push to the positions array 
          positions.push (find_i ({ x: pos.x + x_off, y: y_pos }))
       }

        // Create an empty unsorted array
        const unsorted = []

        // Iterate through the positions array 
        positions.forEach (p => {

            // Red value 
            const r = this.img_data[p]

            // Green value
            const g = this.img_data[p + 1]

            // Blue value
            const b = this.img_data[p + 2]

            // Alpha value
            const a = this.img_data[p + 3]

            // Brightness value
            const br = r * g * b

            // Push RGBA and Brightness value to the unsorted array
            unsorted.push ({ r, g, b, a, br })
        })

        // Using the quicksort funtcion to sort the unsorted array
        // then reverses the order of elements
        const sorted = quicksort (unsorted).reverse ()

        // Create an empty rgba array
        let rgba = []

        // Iterate over each element (e) in the sorted array
        sorted.forEach (e => {
            // Push these extracted values (from e) 
            // in correct order red, green, blue, alpha to the rgba array
            rgba.push (e.r)
            rgba.push (e.g)
            rgba.push (e.b)
            rgba.push (e.a)
         })

        // Uint8ClampedArray: Each element in the typed array 
        // represents a single color channel value (red, green, blue, or alpha) 
        // and is clamped to a valid range (0-255
        // Convert the rgba array into a proper image data storing array
        rgba = new Uint8ClampedArray (rgba)

        // Create new image data using the canvas context
        // width = 1px, 
        // height = dim.y
        // Create a blank image buffer within the specified dimensions
        const new_data = this.ctx.createImageData (1, dim.y)
         
        // Set the data property of new_data
        // using the set method to copy the content of rgba into the new_data
        new_data.data.set (rgba)

        // Draw the new_data object
        this.ctx.putImageData (new_data, pos.x + x_off, pos.y)
        }
    }
 }
 
 


