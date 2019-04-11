
function setGlobalState(name, state) {
  window.cmState[name] = state;
  if (window.cmState.subscribers) {
    for (var index in window.cmState.subscribers) {
      var component = window.cmState.subscribers[index];
      console.log(component.constructor.name)
      component.forceUpdate();
    }
  }

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

function subscribe(component) {
  if (!window.cmState['subscribers']) {
    window.cmState['subscribers'] = [];
  }
  window.cmState['subscribers'].push(component)
}

/*
Put the following in your react component constructor or really anywhere that runs
window.cmState.subscribe(this);
*/
window.cmState = {};
window.cmState['subscribe'] = subscribe;

window.cmState['setGlobalState'] = setGlobalState;
window.cmState['getGlobalState'] = getGlobalState;

export default setGlobalState;
