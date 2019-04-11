import {resolveVariables, ajaxWrapper} from 'functions';


function run_functions(functions, setState, setGlobalState) {
  for (var index in this.props.functions) {
    var temp_function = this.props.functions[index];

    var values = resolveVariables(temp_function[1], window.cmState.getGlobalState())
    if (temp_function[0] == 'ajaxWrapper') {
      ajaxWrapper(temp_function[1]['type'],temp_function[1]['url'], temp_function[1]['data'], console.log)
    }
    else if (temp_function[0] == 'setState') {
      setState(temp_function[1])
    }
    else if (temp_function[0] == 'setGlobalState') {
      setGlobalState(temp_function[1])
    }
  }
}
