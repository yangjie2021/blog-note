/**
 * RGB颜色转16进制
 * 1. 将()内的颜色转为数组
 * 2. 数组的每一项通过toString(16)转为16进制数
 * 3. 将3个十六进制数相加之和就是最终结果
 */
function colorHex (color) {
  var reg = /^(rgb|RGB)/

  if (reg.test(color)) {
    var strHex = '#'
    var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')

    for (var i = 0; i < colorArr.length; i++) {
      var hex = Number(colorArr[i]).toString(16)
      if (hex === '0') {
        hex += hex
      }
      strHex += hex
    }
    return strHex
  } else {
    return String(color)
  }
}

/**
 * 16进制转换为RGB
 * 1. 考虑16进制颜色值是3位还是6位
 * 2. 如果是3位的值，两两重复转为6位，例如 #fb0 => ffbb00
 * 3. 如何时候6位的值，通过parseInt()转为十进制数
 * 4. 6位颜色每2位前加0x就是一个十六进制数字，转为数字就是十进制，最后分成3组转为字符串
 */
function colorRgb (color) {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  color = color.toLowerCase();
  if (reg.test(color)) {

    if (color.length === 4) {
      var colorNew = '#';
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }

    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }
    return 'RGB(' + colorChange.join(',') + ')';
  } else {
    return color;
  }
}

/**
 * 比较版本号大小
 * 1. 将两个版本号拆成数组
 * 2. 依次比较版本号每一位大小
 * 3. 若前几位分隔相同，则按分隔数比较
 */
function compareVersion(v1, v2) {
  var arr1 = v1.split('.'), arr2 = v2.split('.')
  var minLength= Math.min(arr1.length,arr2.length)

  for (var i = 0; i < minLength; i++) {
    if (parseInt(arr1[i]) != parseInt(arr2[i])) {
      return (parseInt(arr1[i]) > parseInt(arr2[i])) ? 1 : -1
    }
  }

  if (arr1.length == arr2.length) {
    return 0
  } else {
    return (arr1.length > arr2.length) ? 1 : -1;
  }
}

// compareVersion('2.2.0','2.1.1')


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
      return [];
  }
  quick(arr, 0, arr.length - 1);
}

function quick(arr, L, R){
  //递归结束条件是L >= R
  if(L < R){
      //随机找一个值，然后和最后一个值进行交换，将经典排序变为快速排序
      swap(arr, L + Math.floor(Math.random() * (R - L + 1)), R);
      //利用荷兰国旗问题获得划分的边界，返回的值是小于区域的最大索引和大于区域的最小索引，在这利用荷兰国旗问题将等于区域部分就不用动了
      var tempArr = partition(arr, L, R, arr[R]);
      quick(arr, L, tempArr[0]);
      quick(arr, tempArr[1], R);
  }
}
//返回值是小于区域最后的索引和大于区域的第一个索引
function partition(arr, L, R, num){
  var less = L - 1
  var more = R + 1
  var cur = L
  while(cur < more) {
      if(arr[cur] < num){
        swap(arr, ++less, cur++)
      } else if(arr[cur] > num) {
        swap(arr, --more, cur)
      } else{
        cur++
      }
  }
  return [less, more]
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

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
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
      max = max > arr[i] ? max : arr[i];
      min = min > arr[i] ? arr[i] : min;
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