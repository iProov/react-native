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
  // the certificates were getting converted to a dictionary instead of an array
  converted['certificates'] = obj['certificates']
  return converted
}

export function convertColorsToARGB(obj) {
  Object.keys(obj).forEach(key => {

    if (key.endsWith('color')) {
      obj[key] = rgba2argb(obj[key])
    }

    // loop through nested objects
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      for (const nestedKey in obj[key]) {
        if (nestedKey.endsWith('color')) {
          obj[key][nestedKey] = rgba2argb(obj[key][nestedKey])
        }
      }
    }
  })

  return obj
}

/**
 * Given camelCase string, returns snake_case version
 */
function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function rgba2argb(hex) {
  if (hex == null) return null

  let color = hex.slice(1, 7)

  let alpha = (hex.length == 9) ? hex.slice(-2) : 'FF'

  return '#' + alpha + color
}