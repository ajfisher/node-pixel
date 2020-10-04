/* Jake & Bobby Pearse 2018.

j.t.pearse@gmail.com

Using a string of lights as a 2d Array

A single strip can be treated as a serpentine array.

We can treat a single strip of lights as a serpentine array by correcting the address of pixels on odd numbered columns

Regular 2d array              serpentine array

 |0|5|10|                         |0|9|10|
 |1|6|11|                         |1|8|11|
 |2|7|12|        Need to          |2|7|12|
 |3|8|13|  === correct odd ===>   |3|6|13|
 |4|9|14|   numbered columns      |4|5|14|

NOTE: if for some mad reason you want to start with pixel 0 at the bottom, you should reverse EVEN numbered rows :)

As we can see in a sane world, column 1 is reversed. As are all odd-numbered columns.
address will calculate the corrected value for pixels.

examples
========

  get a corrected pixel number
  ============================

  const NUM_ROWS = 5

  address(6,NUM_ROWS)
    => 8


  light up all pixels on row 1 of strip
  =====================================

  for (const p = 0; p < strip.length; p++){
    if (rowNum(p,NUM_ROWS) === 1){
      strip.pixel(address(p,ROW_NUM)).color('white')
    }
  }

*/
const abs = Math.abs
const floor = Math.floor

// return the uncorrected row number of pixel p
const rowNum = (p, rows) => p % rows

// return the uncorrected column number of pixel p
const columnNum = (p, rows) => floor(p/rows)

// find the corrected pixel number at the top of a reversed column
const rowZeroVal = (p,rows) => {

   const columnHalf = floor(columnNum(p,rows)/2)+1
   const doubleRows = rows * 2
   return (columnHalf * doubleRows) - 1
}

// pixel p is in an odd numbered column => true || false
const columnIsOdd = (p, rows) => columnNum(p, rows) % 2 > 0

//corrected value of pixel p, for odd numbered columns
const address = (p, rows) => {

  if (columnIsOdd(p, rows)) {
    return p + abs( p - rowZeroVal(p,rows)) - rowNum(p,rows)
  }
  return p
}


// check if a pixel is inside a bounding rectangle
function inRange(p,first,last,rows){
    return (
    rowNum(p,rows) >= rowNum(first,rows) &&
    rowNum(p,rows) <= rowNum(last,rows) &&
    columnNum(p,rows) >= columnNum(first,rows) &&
    columnNum(p,rows) <= columnNum(last,rows)
    )
}

// reduce a 2d array with a bounding rectangle
const rectRange = (first, last, rows, pixelArray) => pixelArray.filter(p => inRange(p, first, last, rows))

module.exports = {
  address,
  columnNum,
  rowZeroVal,
  columnIsOdd,
  rowNum,
  inRange,
  rectRange
}
