import { createBasicStore } from "../store/basicStore";
import utils from "./utils";

/*
  TODO
  add emitters for add/remove and store events
  add id to selector string by default
  allow to pass dom element instead of selector
  Create back-up plugin (upload inamodb) - Should only remove when file was uploaded
 */
export default function initiate(opts = {}) {
  // TODO define
  const defaultSettings = { store: createBasicStore, storeArgs: [] };
  const settings = Object.assign(defaultSettings, opts);

  // Could initialize store for back ups from innodb.
  const store = settings.store(...settings.storeArgs);
  const modifiers = { upload: [] };

  function addModifier(type, modifier) {
    modifiers[type].push(modifier);
    return () => {
      const i = modifiers[type].indexOf(modifier);
      if (i > 0) {
        throw new Error(`Tried to remove non existant modifier at ${type}`);
      }
      modifiers[type].splice(i, 1);
    };
  }

  function addFile(file) {
    // TODO checks for basic meta requirements.
    const fileId = utils.createFileId(file);
    // Makes it easier for later retrieval
    store.update(fileId, Object.assign({}, file, { id: fileId, stored: file }));
    return fileId;
  }

  function addFiles(files) {
    const uploadModifiers = utils.promiseSeq(modifiers.upload);
    const actions = files.map(file => uploadModifiers(file).then(addFile));
    return Promise.all(actions);
  }

  function getState() {
    return {
      store: store.getState(),
      modifiers
    };
  }

  return {
    addModifier,

    getState, // File management.
    addFiles,
    removeFile: store.remove,
    getFile: store.getValue
  };
}
