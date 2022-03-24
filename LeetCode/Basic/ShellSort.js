function sortFunction(array) {
  let step = parseInt(array.length / 2)
  while (step > 0) {
    for (let index = step; index < array.length; index++) {
      const val = array[index]
      let j = index
      while (j >= step && array[j - step] > val) {
        array[j] = array[j - step]
        j = j - step
      }
      array[j] = val
    }
    step = parseInt(step / 2)
  }
}
let array = [1, 7, 2, 3, 4, 5, 6]
sortFunction(array)
console.log(array)
