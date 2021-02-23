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