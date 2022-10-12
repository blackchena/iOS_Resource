function sortFunction() {
  let sortedArray = [1, 2, 3, 4, 7, 5, 9, 6]
  for (let index = 0; index < sortedArray.length - 1; index++) {
    let minIndex = index
    for (let j = index; j < sortedArray.length; j++) {
      const element = sortedArray[j]
      if (element < sortedArray[minIndex]) {
        minIndex = j
      }
    }
    const tmp = sortedArray[index]
    sortedArray[index] = sortedArray[minIndex]
    sortedArray[minIndex] = tmp
  }
  return sortedArray
}

console.log(sortFunction())
