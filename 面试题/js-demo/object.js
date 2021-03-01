/**
 * 对象深度冻结
 */
function deepFreeze(object) {
  let propNames = Object.getOwnPropertyNames(object);
  for (let name of propNames) {
    let value = object[name];
    object[name] = value && typeof value === "object" ? deepFreeze(value) : value;
  }
  return Object.freeze(object);
}

/* let person = {
  name: "Leonardo",
  profession: {
    name: "developer"
  }
}
deepFreeze(person)
person.profession.name = "doctor" // TypeError: Cannot assign to read only property 'name' of object */


/**
 * 创建代理对象，通过代理对象访问属性时抛出错误
 */
const man = {
	name: 'jscoder',
	age: 22
}

const pMan = new Proxy(man, {
	get(target, key){
		if (key in target) {
			return target[key]
		} else {
			throw new Error(`Property "${key}" does not exist`)
		}
	}
})

/**
 * 根据对象字符串key获取值
 */
const getValue = (origin, path) => {
  let keys = path.split(/[[\].]/g)
    .filter(item => item.length)
    .map(item => item.replace(/"/g, ''))

  let res = origin
  for (key of keys) {
    res = res[key]
    if (!res) return
  }
  return res
}

/* 
const studentInfo = {
  name: '小明',
  age: 12,
  favoriteFoods: [
    'apple',
    'dumpling'
  ],
  habits: [
    { name: 'skating', 'zh-CN': '滑冰' }
  ],
  parents: {
    0: {
      relationShip: 'Dad',
      name: '小明他爸',
    },
    Mom: '小明他妈'
  }
}

console.log(getValue(studentInfo, 'name'))
console.log(getValue(studentInfo, 'favoriteFoods[0]'))
console.log(getValue(studentInfo, 'habits[0]["zh-CN"]'))
console.log(getValue(studentInfo, 'habbits[1].name')) // undefined
console.log(getValue(studentInfo, 'parents.Mom'))
console.log(getValue(studentInfo, 'parents[0].name'))
 */