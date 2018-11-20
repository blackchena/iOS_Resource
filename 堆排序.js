function generateMaxHeap(array) {
	// body...
	heapify(array, 0);
}

function heapify(array, idx) {
	// body...
	var leftidx = idx * 2 + 1;
	var rightidx = idx * 2 + 2;
	var leftValue, rightValue, curValue;
	if (leftidx < array.length) {
		heapify(array, leftidx);
		leftValue = array[leftidx];
		curValue = array[idx];
		if (leftValue > curValue) {
			swipArrayItem(array, leftidx, idx);
			heapify(array, leftidx);
		}
	}
	if (rightidx < array.length) {
		heapify(array, rightidx);
		rightValue = array[rightidx];
		curValue = array[idx];
		if (rightValue > curValue) {
			swipArrayItem(array, rightidx, idx);
			heapify(array, rightidx);
		}
	}
}



function printHeap(array) {
	// body...
	var totalStr = '';
	var lineNum = 0
	for (var i = 0; i < array.length - 1; i++) {
		if (i == Math.pow(2,lineNum) - 1) {
			lineNum++;
			totalStr += '\n';
		}
		totalStr += ' ' + array[i];
	}
	return totalStr;
}

function swipArrayItem(array, i, j) {
	// body...
	var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}


////////////方式二 

function heapify(array, length) {
	// body...
	if (length == 1) return;
	heapify(array, length - 1);
	var curIdx = length - 1;
	var fatherIdx = Math.floor((curIdx - 1) / 2);
	while(curIdx > 0) {
		var curValue, fatherValue;
		fatherValue = array[fatherIdx];
		curValue = array[curIdx];
		if (fatherValue < curValue) {

			swipArrayItem(array, fatherIdx, curIdx);
			curIdx = fatherIdx;
			fatherIdx = Math.floor((curIdx - 1) / 2);
			console.log('fatherIdx:'+fatherIdx + 'curIdx' + curIdx);
		} else {
			break;
		}

	}
}

function sortWithBigHeap(array, idx) {
	// body...
	// body...
	var leftidx = idx * 2 + 1;
	var rightidx = idx * 2 + 2;
	var leftValue, rightValue, curValue;
	if (leftidx < array.length) {
		// heapify(array, leftidx);
		leftValue = array[leftidx];
		curValue = array[idx];
		if (leftValue > curValue) {
			swipArrayItem(array, leftidx, idx);
		}
	}
	if (rightidx < array.length) {
		// heapify(array, rightidx);
		rightValue = array[rightidx];
		curValue = array[idx];
		if (rightValue > curValue) {
			swipArrayItem(array, rightidx, idx);
		}
	}
	

}

function swipArrayItem(array, i, j) {
	// body...
	var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}


///方式三

var len;    // 因为声明的多个函数都需要数据长度，所以把len设置成为全局变量
 
function buildMaxHeap(arr) {   // 建立大顶堆
    len = arr.length;
    for (var i = Math.floor(len/2); i >= 0; i--) {
        heapify(arr, i);
    }
}
 
function heapify(arr, i) {     // 堆调整 //前提为所有子树都是大堆树
    var left = 2 * i + 1,
        right = 2 * i + 2,
        largest = i;
 
    if (left < len && arr[left] > arr[largest]) {
        largest = left;
    }
 
    if (right < len && arr[right] > arr[largest]) {
        largest = right;
    }
 
    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, largest);
    }
}
 
function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
 
function heapSort(arr) {
    buildMaxHeap(arr);
 
    for (var i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        len--;
        heapify(arr, 0);
    }
    return arr;
}

// 方式4

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function heapify(arr, i) {     // 堆调整 //前提为所有子树都是大堆树
	var len = arr.length;
    var left = 2 * i + 1,
        right = 2 * i + 2,
        largest = i;
 
    if (left < len && arr[left] > arr[largest]) {
        largest = left;
    }
 
    if (right < len && arr[right] > arr[largest]) {
        largest = right;
    }
 
    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, largest);
    }
}

function buildMaxHeap (arr, i) {
	var len = arr.length;
    var left = 2 * i + 1,
    	right = 2 * i + 2;
    if (left < len) {
    	buildMaxHeap(arr, left);
    }
    if (right < len) {
    	buildMaxHeap(arr, right);
    }
    heapify(arr, i);
}
