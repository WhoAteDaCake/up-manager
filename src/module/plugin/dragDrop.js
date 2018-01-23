import Joi from "joi-browser";
import dragDrop from "drag-drop";
import {
  validateSchema,
  parentError,
  toIsoDate,
  fileType
} from "../core/utils";

const optionSchema = Joi.object().keys({
  selectors: Joi.object()
    .keys({
      area: Joi.string()
        .error(() => "selectors:'area' selector string is required")
        .required(),
      browse: Joi.string()
        .error(() => "selectors:'browse' selector string is required")
        .required()
    })
    .error(parentError("selectors:'selectors' key is required"))
    .required()
});

function elementFromSelector(selector) {
  if (selector instanceof Element) {
    return selector;
  }
  return document.querySelector(selector);
}

async function extractLocalFileData(file) {
  if (file.source !== "Local") {
    return file;
  }
  const { data } = file;
  const  type = await fileType(data);
  const res = {
    name: data.name,
    lastModified: toIsoDate(data.lastModified),
    type,
    size: data.size
  };
  return res;
}

export default function createDragDrop(core, options = {}) {
  const validation = validateSchema(optionSchema, options);
  if (validation.error) {
    throw new Error(JSON.stringify(validation.error));
  }
  const selectors = {
    area: elementFromSelector(options.selectors.area),
    browse: elementFromSelector(options.selectors.browse)
  };
  const modifiers = [extractLocalFileData];
  const modieferSubs = modifiers.map(fn => core.addModifier("upload", fn));

  function handleUpload(files) {
    core.addFiles(files.map(file => ({ data: file, source: "Local" })))
      .then(() => console.log(core.getState()));
  }

  const removeDragDropListener = dragDrop(selectors.area, files => {
    handleUpload(files);
  });

  selectors.area.onchange = e => {
    handleUpload(Array.from(e.target.files));
  };

  selectors.browse.onclick = e => {
    e.preventDefault();
    selectors.area.click();
  };

  function unmount() {
    // Just me being extra secure about memory leaks
    selectors.area.onchange = "";
    selectors.browse.onchange = "";
    removeDragDropListener();
    modieferSubs.map(unsub => unsub());
  }

  return { unmount };
}
