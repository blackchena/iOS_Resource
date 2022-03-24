// function sortFunction(array, left, right) {
//   // console.log('res = ', array)
//   if (left >= right) {
//     return
//   }
//   let refer = array[left]
//   let i = left
//   let j = right
//   while (i < j) {
//     while (array[i] < refer) i++
//     while (array[j] > refer) j--
//     if (i < j) {
//       const tmp = array[i]
//       array[i] = array[j]
//       array[j] = tmp
//       i++
//       j--
//     }
//   }
//   if (refer > array[i]) {
//     i = i
//   } else {
//     i = i - 1 < left ? left : i - 1
//   }
//   sortFunction(array, left, i)
//   sortFunction(array, i + 1, right)
// }

// function sortFunction(array, left, right) {
//   if (left >= right) {
//     return
//   }
//   let refer = array[left]
//   let i = left
//   let j = right
//   while (i < j) {
//     while (array[i] < refer) i++
//     while (array[j] > refer) j--
//     if (i < j) {
//       const tmp = array[i]
//       array[i] = array[j]
//       array[j] = tmp
//       i++
//       j--
//     }
//   }
//   if (array[j] > refer) {
//     j -= 1
//   }
//   sortFunction(array, left, j)
//   sortFunction(array, j + 1, right)
// }

var sortArray = function (nums) {
  sortFunction(nums, 0, nums.length - 1)
  return nums
}

// function sortFunction(array, left, right) {
//   if (left >= right) {
//     return
//   }
//   let refer = array[left]
//   let i = left - 1
//   let j = right + 1
//   while (i < j) {
//     while (array[++i] < refer);
//     while (array[--j] > refer);
//     if (i < j) {
//       const tmp = array[i]
//       array[i] = array[j]
//       array[j] = tmp
//     }
//   }
//   sortFunction(array, left, j)
//   sortFunction(array, j + 1, right)
// }

// console.log(sortArray([5, 2, 3]))

function sortFunction(array, left, right) {
  if (left >= right) {
    return
  }
  let pos = findPosAndPartition(array, left, right)
  sortFunction(array, left, pos - 1)
  sortFunction(array, pos + 1, right)
}

// function findPosAndPartition(array, left, right) {
//   let val = array[left]
//   let i = left + 1
//   let j = i
//   while (j <= right) {
//     if (array[j] < val) {
//       let tmp = array[j]
//       array[j] = array[i]
//       array[i] = tmp
//       i++
//     }
//     j++
//   }
//   let tmp = array[left]
//   array[left] = array[--i]
//   array[i] = tmp
//   return i
// }

function findPosAndPartition(array, left, right) {
  let val = array[right]
  let i = left
  let j = left
  while (j < right) {
    if (array[j] < val) {
      let tmp = array[j]
      array[j] = array[i]
      array[i] = tmp
      i++
    }
    j++
  }
  let tmp = array[right]
  array[right] = array[i]
  array[i] = tmp
  return i
}

console.log(sortArray([5, 2, 3]))
