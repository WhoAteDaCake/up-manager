export function createBasicStore() {
  let state = {};

  function getState() {
    return Object.assign({}, state);
  }

  return {
    getState,
    getValue(id) {
      const item = state[id];
      if (item === undefined) {
        throw new Error(`Tried to get non existing item of id: '${id}'`);
      }
      return Object.assign({}, item);
    },
    update(id, value) {
      state[id] = value;
      // TODO add emitters (should be passed from uppy)
    },
    remove(id) {
      if (state[id] === undefined) {
        throw new Error(`Tried to delete non existing item of id: '${id}'`);
      }
      const newState = getState();
      delete newState[id];
      state = newState;
      return getState();
    }
  };
}
