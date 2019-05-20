import {resolveVariables, ajaxWrapper} from 'functions';


function run_functions(functions, setState, setGlobalState) {
  for (var index in functions) {
      console.log("Running Function", functions[index])
    var temp_function = functions[index];
    var values = resolveVariables(temp_function[1], window.cmState.getGlobalState())

    if (temp_function[0] == 'ajaxWrapper') {
      ajaxWrapper(values['type'],values['url'], values['data'], console.log)
      setTimeout(console.log("Ajax Call Made"), 3000)
    }
    else if (temp_function[0] == 'setState') {
      setState(values)
    }
    else if (temp_function[0] == 'setGlobalState') {
      for (var index in values) {
          window.cmState.setGlobalState(index, values[index])
      }
    }
    else if (temp_function[0] == 'redirect') {
      window.location = values;
    }
  }
}

export default run_functions;
