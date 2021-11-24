export function objectToSnakeCase(obj) {
  const converted = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key]

      if (value == null) continue

      if (
        value instanceof Array ||
        (value !== null && value.constructor === Object)
      ) {
        value = objectToSnakeCase(value)
      }
      converted[camelToSnakeCase(key)] = value
    }
  }
  return converted
}

/**
 * Given camelCase string, returns snake_case version
 */
function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
