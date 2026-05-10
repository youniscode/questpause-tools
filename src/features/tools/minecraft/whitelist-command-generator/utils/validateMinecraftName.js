export function isEmpty(name) {
  return name.trim().length === 0;
}

export function hasSpaces(name) {
  return name.includes(" ");
}

export function isJavaNameValid(name) {
  return !isEmpty(name) && !hasSpaces(name);
}
