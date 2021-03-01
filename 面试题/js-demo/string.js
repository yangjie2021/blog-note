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
 * 字符串转驼峰
 * 1. 单词分组后拼接
 * 2. 单个字母分组后拼接
 * 3. 使用正则表达式
 */
function transformStr2Hump1(str) {
  if (str == null) {
    return ''
  }
  var strArr = str.split('-')
  for (var i = 1; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1)
  }
  return strArr.join('')
}

function transformStr2Hump2(str) {
  if(str == null) {
    return ''
  }
  var strArr = str.split('')
  for(var i = 0; i < strArr.length; i++) {
    if(strArr[i] == '-'){
      // 删除-
      strArr.splice(i, 1)
      // 将该处改为大写
      if(i < strArr.length) {
        strArr[i] = strArr[i].toUpperCase()
      }
    }
  }
  return strArr.join('')
}

function transformStr2Hump3(str) {
  if (str == null) {
    return ''
  }
  var reg = /-(\w)/g
  return str.replace(reg, function($0, $1) {
    return $1.toUpperCase()
  })
}

/**
 * 实现千位分隔符
 * ?= 正向预查，匹配的是?=表达式左边的表达式
 * (\d)(?=(\d{3})+) 匹配符合右边有3的倍数个数字以上的左边一个数字的字符串
 * (\d)(?=(\d{3})+$) 3的的倍数个数字结尾
 * /g 匹配完第一次后，继续匹配剩下的
 */
function toThousands1(number) {
  return (number + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

function toThousands2(number) {
  if(!Number(number)) {
    throw TypeError('arugment must be number or can be transfer into number');
  }
  var numberStr = '' + number,
    len = numberStr.length
  // 第一步：最高位不足3的情况，用0补上
  switch(len % 3) {
    case 1: numberStr = '00' + numberStr; break;
    case 2: numberStr = '0' + numberStr; break;
  }
  // 第二步：每隔三个数字添加一个","，并将头部多于的0和尾部多于的","去掉
  return numberStr.replace(/(\d{3})/g, '$1,').replace(/(^0+)/g, '');
}

function toThousands3(number) {
  if(!Number(number)) {
    throw TypeError('arugment must be number or can be transfer into number');
  }
  var numberStr = '' + number,
    len = numberStr.length,
    index = - 3

  // 第一步：最高位不足3的情况，用0补上
  switch(len % 3) {
    case 1:
      numberStr = '00' + numberStr
    break;
    case 2:
      numberStr = '0' + numberStr
    break;
  }
  var result = '';
  len = numberStr.length;
  // 第二步：从右往做，每隔三个位置打一个","
  while(-index <= len) {
    result = numberStr.substr(index, 3) + ',' + result
    index -= 3
  }
  // 第三步：将第一步在前面添加的0去掉以及尾部多于的","也去掉
  return result.replace(/(^0+|,$)/g, '')
}