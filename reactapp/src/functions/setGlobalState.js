window.cmState = {}

function setGlobalState(name, state) {
  window.cmState[name] = state;
  return true
}

function getGlobalState(name) {
  if (name) {
    return window.cmState[name]
  }
  else {
    return window.cmState
  }
}

window.cmState['setGlobalState'] = setGlobalState;
window.cmState['getGlobalState'] = getGlobalState;

export default setGlobalState;
