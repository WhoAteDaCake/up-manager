function toIsoDate(date) {
  const time = new Date(date);
  return time.toISOString();
}

function createId(file) {
  return [
    "key",
    file.name.split(15)[0].toLowerCase(),
    file.meta.size,
    toIsoDate(file.meta.lastModified)
  ].join("_");
}

export default {
  createId,
  toIsoDate
};
