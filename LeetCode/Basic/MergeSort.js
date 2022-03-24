function sortFunction(array, left, right) {
  if (left >= right) {
    return
  }
  let mid = (left + right) >> 1
  // console.log('mid = ' + mid + 'left = ' + left + 'right = ' + right)
  sortFunction(array, left, mid)
  sortFunction(array, mid + 1, right)
  let tmp = []
  let i = left
  let j = mid + 1

  while (i <= mid && j <= right) {
    if (array[i] < array[j]) {
      tmp.push(array[i])
      i++
    } else {
      tmp.push(array[j])
      j++
    }
  }
  if (i <= mid) {
    // console.log('i <= mid' + i + '-' + mid)
    tmp.push(...array.slice(i, mid + 1))
    // console.log('itmp = ' + tmp)
  }
  if (j <= right) {
    // console.log('j <= right' + j + '-' + right)
    tmp.push(...array.slice(j, right + 1))
    // console.log('jtmp = ' + tmp)
  }
  for (let i = left; i <= right; i++) {
    array[i] = tmp[i - left]
  }
  console.log(array)
}
let array = [1, 2, 3, 4, 6, 9, 7, 8]
sortFunction(array, 0, array.length - 1)
console.log('hello:' + array)
