function type(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, "");
}

function isArray(list) {
  return type(list) === "Array";
}

function isObject(obj) {
  return type(obj) === "Object";
}

function isString(str) {
  return type(str) === "String";
}

function isNotEmptyObj(obj) {
  return isObject(obj) && JSON.stringify(obj) != "{}";
}

function objForEach(obj, fn) {
  isNotEmptyObj(obj) && Object.keys(obj).forEach(fn);
}

function aryForEach(ary, fn) {
  ary.length && ary.forEach(fn);
}

function setAttr(node, key, value) {
  switch (key) {
    case "style":
      node.style.cssText = value;
      break;
    case "value":
      var tagName = node.tagName || "";
      tagName = tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") {
        node.value = value;
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value);
      }
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}

function toArray(data) {
  if (!data) {
    return [];
  }
  const ary = [];
  aryForEach(data, item => {
    ary.push(item);
  });

  return ary;
}

export {
  isArray,
  isObject,
  isString,
  isNotEmptyObj,
  objForEach,
  aryForEach,
  setAttr,
  toArray,
};
