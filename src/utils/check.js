const expInt = /^[0-9]+$/
const expFloat = /^[0-9]+\.[0-9]+$/

export const checkConfig = (value, type, typeInner) => {
  console.log("checkConfig", value, type, typeInner)
  if (!value) {
    return true
  }

  switch (type) {
    case "int":
      return expInt.test(value)
    case "float":
      return expFloat.test(value) || expInt.test(value)
    case "bool":
      return typeof value === "boolean" || ["true", "false"].includes(value)
    case "tuple":
      return checkTuple(value, typeInner)
    case "list":
      return checkList(value, typeInner[0])
  }
  return true
}

function checkList(value, type) {
  if (!value) {
    return true
  }
  if (!Array.isArray(value)) {
    value = value.split(",")
  }
  for (let i = 0; i < value.length; i++) {
    const result = checkConfig(value[i], type)
    if (!result) {
      return false
    }
  }
  return true
}

function checkTuple(value, typeInner) {
  if (!value) {
    return true
  }
  if (!Array.isArray(value)) {
    value = value.split(",")
  }
  for (let i = 0; i < value.length; i++) {
    const result = checkConfig(value[i], typeInner[i])
    if (!result) {
      return false
    }
  }
  return true
}
