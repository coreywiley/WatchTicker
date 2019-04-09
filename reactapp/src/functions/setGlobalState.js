window.cmState = {}

function setGlobalState(name, state) {
  window.cmState[name] = state;
  return true
}

function getGlobalState(name) {
  return window.cmState[name]
}

window.cmState['setGlobalState'] = setGlobalState;
window.cmState['getGlobalState'] = getGlobalState;

export default setGlobalState;
