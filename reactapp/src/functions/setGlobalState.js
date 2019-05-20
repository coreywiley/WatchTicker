window.cmState = {'completed':'False'}

function setGlobalState(name, state) {
    console.log("Setting Global State", name, state)
  window.cmState[name] = state;
  if (window.cmState.subscribers) {
    for (var index in window.cmState.subscribers) {
      var component = window.cmState.subscribers[index];
      if (component.constructor.name == 'ListWithChildren') {
        component.refreshData();
      }
      else {
        component.forceUpdate();
      }
    }
  }
  return true
}

function subscribe(component) {
  if (!window.cmState['subscribers']) {
    window.cmState['subscribers'] = [];
  }

  if (window.cmState.subscribers.indexOf(component) == -1) {
    window.cmState['subscribers'].push(component)
  }
}

function getGlobalState(component) {
    if (component) {
      subscribe(component);
    }

    return window.cmState;
}

window.cmState['setGlobalState'] = setGlobalState;
window.cmState['getGlobalState'] = getGlobalState;

export default setGlobalState;
