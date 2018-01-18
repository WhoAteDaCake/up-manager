import { createBasicStore } from "../store/basicStore";
import utils from "./utils";

// TODO add emitters for add/remove and store events
export default function create(opts = {}) {
  // TODO define
  const defaultSettings = { store: createBasicStore, storeArgs: [] };
  const settings = Object.assign(defaultSettings, opts);

  // Could initialize store for back ups from innodb.
  const store = settings.store(...settings.storeArgs);

  function addFile(file) {
    // TODO checks for basic meta requirements.
    const fileId = utils.createId(file);
    store.update(fileId, file);
    return fileId;
  }

  function getState() {
    return {
      store: store.getState()
    };
  }

  return {
    getState,

    addFile,
    removeFile: store.remove,
    getFile: store.getValue
  };
}
