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