/**
 * 冒泡排序
 */
function BubbleSort(arr) {
  if(arr == null || arr.length <= 0){
    return []
  }
  var len = arr.length
  for(var end = len - 1; end > 0; end--){
    for(var i = 0; i < end; i++) {
      if(arr[i] > arr[i + 1]){
        var temp = arr[i]
        arr[i] = arr[i+1]
        arr[i+1] = temp
      }
    }
  }
  return arr
}

/**
 * 选择排序
 * 1. 两层for循环，第二层负责将最小元素的索引找到
 * 2. 第一层用来比较当前索引的元素和最小元素的索引是否相同
 * 3. 如果不同，互换位置，将最小的元素放在数组头部
 * 4. 如果相同循环结束
 */
function selectionSort(arr) {
  if(arr == null || arr.length < 0) {
    return []
  }
  for(var i = 0; i < arr.length - 1; i++) {
    var minIndex = i
    for(var j = i + 1; j < arr.length; j++) {
      minIndex = arr[j] < arr[minIndex] ? j : minIndex;
    }
    if (i === minIndex) {
      return
    }
    var temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  return arr
}

/**
 * 插入排序
 * 1. 第一层递增循环，确定置换元素的开始位置
 * 2. 从最后一个位置逐次向前比较，如果后>前，置换位置
 */
function insertSort (arr) {
  if (arr == null  || arr.length <= 0){
    return []
  }
  debugger
  var len = arr.length
  for(var i = 1; i < len; i++) {
    for(var j = i - 1; j >= 0 && arr[j] > arr[j + 1]; j--) {
      var temp = arr[j]
      arr[j] = arr[j + 1]
      arr[j + 1] = temp
    }
  }
  return arr;
}

/**
 * 归并排序
 * 1. 
 */
function mergeSort(arr){
  if(arr ==null || arr.length <= 0){
    return []
  }
  var len = arr.length
  //i每次乘2，是因为每次合并以后小组元素就变成两倍个了
  for(var i = 1; i < len; i *= 2) {
    var index = 0;//第一组的起始索引
    while( 2 * i  + index <= len){
        index += 2 * i
        merge(arr, index - 2 * i, index - i, index)
    }
    //说明剩余两个小组，但其中一个小组数据的数量已经不足2的幂次方个
    if(index + i < len){
        merge(arr, index, index + i, len)
    }
  }
  return arr
}

function merge(arr, start, mid, end){
  //新建一个辅助数组
  var help = [];
  var l = start, r = mid;
  var i = 0;
  while(l < mid && r < end){
      help[i++] = arr[l] < arr[r] ? arr[l++] : arr[r++];
  }
  while(l < mid){
      help[i++] = arr[l++];
  }
  while(r < end){
      help[i++] = arr[r++];
  }
  for(var j = 0; j < help.length; j++){
      arr[start + j] = help[j];
  }
}

/**
 * 快速排序
 */
function quickSort(arr) {
  if(arr == null || arr.length <= 0){
    return []
  }
  quick(arr, 0, arr.length - 1)
}

function quick(arr, L, R){
  //递归结束条件是L >= R
  if (L < R) {
    //随机找一个值，然后和最后一个值进行交换，将经典排序变为快速排序
    // swap(arr, L + Math.floor(Math.random() * (R - L + 1)), R)
    L = L + Math.floor(Math.random() * (R - L + 1))
    let num = arr[R]

    var less = L - 1
    var more = R + 1
    var cur = L
    while(cur < more) {
      if (arr[cur] < num){
        swap(arr, ++less, cur++)
      } else if(arr[cur] > num) {
        swap(arr, --more, cur)
      } else{
        cur++
      }
    }

    var tempArr = [less, more]
    quick(arr, L, tempArr[0])
    quick(arr, tempArr[1], R)
  }
}

function swap(arr, i, j){
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

/**
 * 堆排序
 */
function heapSort(arr) {
  if(arr == null || arr.length <= 0) {
      return [];
  }

  //首先是建立大顶堆的过程
  for(var i = 0; i < arr.length; i++) {
    heapInsert(arr, i);
  }
  var size = arr.length //这个值用来指定多少个数组成堆，当得到一个排序的值后这个值减一
  //将堆顶和最后一个位置交换
  /**
   * 当大顶堆建立完成后，然后不断将最后一个位置和堆顶交换；
   * 这样最大值就到了最后，则剩下部分做heapify，重新调整为大根堆，则堆顶位置和倒数第二个位置交换，重复进行，直到全部排序完毕*/
  //由于前面已经是大顶堆，所以直接交换
  swap(arr, 0, --size);
  while(size > 0) {
      //重新变成大顶堆
      heapify(arr, 0, size);
      //进行交换
      swap(arr, 0, --size);
  }
}

// 加堆过程中
function heapInsert(arr, index) {
  //比较当前位置和其父位置，若大于其父位置，则进行交换，并将索引移动到其父位置进行循环，否则跳过
  //结束条件是比父位置小或者到达根节点处
  while(arr[index] > arr[parseInt((index - 1) / 2)]){
      //进行交换
      swap(arr, index, parseInt((index - 1) / 2));
      index = parseInt((index - 1) / 2);
  }
}
// 减堆过程
/**
* size指的是这个数组前多少个数构成一个堆
* 如果你想把堆顶弹出，则把堆顶和最后一个数交换，把size减1，然后从0位置经历一次heapify，调整一下，剩余部分变成大顶堆*/
function heapify(arr, index, size) {
  var left = 2 * index + 1;
  while(left < size) {
    var largest = (left + 1 < size && arr[left] < arr[left + 1]) ? left + 1 : left;
    largest = arr[index] > arr[largest] ? index : largest;

    //如果最大值索引和传进来索引一样，则该值到达指定位置，直接结束循环
    if(index == largest) {
        break;
    }

    //进行交换，并改变索引和其左子节点
    swap(arr, index, largest);
    index = largest;
    left = 2 * index + 1;
  }
}

/**
 * 桶排序
 */
function maxGap(arr) {
  if(arr == null || arr.length <= 0) {
      return 0;
  }
  var len = arr.length;
  var max = -Infinity, min = Infinity;
  //遍历一遍数组,找到最大值max和最小值min
  for(var i = 0; i < len; i++) {
    max = max > arr[i] ? max : arr[i]
    min = min > arr[i] ? arr[i] : min
  }

  //若min = max,则差值为0;
  if(min == max) {
      return 0;
  }

  var hasNum = new Array(len + 1);
  var mins = new Array(len + 1);
  var maxs = new Array(len + 1);

  var bid = 0;//指定桶的编号

  for(var i = 0; i < len; i++) {
      bid = bucket(arr[i], min, max, len);//获得该值是在哪个桶//由于有N+1个桶，所以间隔就是N个，所以此处除以的是len，然后通过这个函数得到应该放到哪个桶里
      maxs[bid] = hasNum[bid] ? Math.max(arr[i], maxs[bid]) : arr[i];
      mins[bid] = hasNum[bid] ? Math.min(arr[i], mins[bid]) : arr[i];
      hasNum[bid] = true;
  }

  var res = 0;
  var lastMax = maxs[0];

  for(var i = 0; i < len + 1; i++) {
      if(hasNum[i]) {
          res = Math.max(mins[i] - lastMax, res);
          lastMax = maxs[i];
      }
  }
  return res;
}

//获得桶号
//这个函数用于判断在哪个桶中，参数分别为值、最小值、最大值、桶间隔
function bucket(value, min, max, len) {
  return parseInt((value - min) / ((max - min) / len));
}

/**
 * 九九乘法表
 */
let sum = 0
let wite
// for (let i = 1; i < 10; i++) {
//   let div = $('<div class="class' + i + '"></div>')
//   $('body').append(div)
//   for (let j = i; j > 0; j--) {
//     sum = j * i;
//     wite = j + 'x' + i + '=' + sum;
//     div.prepend($('<span style="padding-right:10px">' + wite + '</span>'))
//   }
// }

/**
 * 实现大数相加
 */
function add(a, b) {
  var temp = 0
  var res = ''
  a = a.split('')
  b = b.split('')
  while (a.length || b.length || temp) {
    temp += ~~(a.pop()) + ~~(b.pop())
    res = (temp % 10) + res
    temp = temp > 9
  }
  return res
}

// const a = '123456789'
// const b = '11111111111111111111111111'
// console.log(add(a, b))