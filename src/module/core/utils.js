import Joi from "joi-browser";
import fileTypeFromBuffer from "file-type";

function getArrayBuffer(chunk) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.addEventListener("load", function(e) {
      // e.target.result is an ArrayBuffer
      resolve(e.target.result);
    });
    reader.addEventListener("error", function(err) {
      console.error("FileReader error" + err);
      reject(err);
    });
    // file-type only needs the first 4100 bytes
    reader.readAsArrayBuffer(chunk);
  });
}

async function fileType(file) {
  const buffer = await getArrayBuffer(file).then(fileTypeFromBuffer);
  return buffer ? buffer.mime : "unknown";
}

function toIsoDate(date) {
  const time = new Date(date);
  return time.toISOString();
}

function createFileId(file) {
  return [
    "key",
    file.name.split(15)[0].toLowerCase(),
    file.size,
    toIsoDate(file.lastModified)
  ].join("_");
}

function isObject(obj) {
  return obj instanceof Object && !Array.isArray(obj);
}

/**
 * Wrapper to improve joi schema validation
 * @param {Object} schema - Joi schema
 * @param {any} data - Data to be validated by the schema
 */
function validateSchema(schema, data) {
  const { error } = Joi.validate(data, schema);
  if (!error) {
    return {};
  }
  let message = "Unknown error";
  let key = "unknown";
  if (error.message.includes("child")) {
    [key, message] = error.message.match(/\[(.+)\]/)[1].split(":");
  } else {
    [key, message] = error.message.split(":");
  }
  return { error: { [key]: message } };
}

function parentError(message) {
  return ([error]) => {
    if (error.context.child) {
      return error.context.reason[0].message;
    }
    return message;
  };
}

function apply(fns) {
  if (fns.length === 0) {
    return val => val;
  }
  return val => fns.reduce((v, fn) => fn(v), val);
}

export default {
  createFileId,
  toIsoDate,
  isObject,
  validateSchema,
  parentError,
  apply,
  fileType
};

export {
  apply,
  createFileId,
  toIsoDate,
  isObject,
  validateSchema,
  parentError,
  fileType
};
