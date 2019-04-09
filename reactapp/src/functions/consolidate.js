import {resolveVariables, format_date_string} from 'functions';
import {ajaxWrapper} from 'functions';


function compare(a, b) {
  if (a[0] > b[0]) return 1;
  if (b[0] > a[0]) return -1;
  return 0;
}

function compare_reverse(a, b) {
  if (a[0] > b[0]) return -1;
  if (b[0] > a[0]) return 1;
  return 0;
}


function consolidate(data, dataMapping, order) {
  var sum = {}
  for (var index in data) {
    console.log("Data",data, data[index])
    var values = resolveVariables(dataMapping, data[index])
    console.log("Values", values)
    var group_by = format_date_string(values['group_by'], 'mm/dd/yy')
    console.log("Group By", group_by)
    if (!sum[group_by]) {
      sum[group_by] = 0;
    }
    console.log("Add", values['add'], sum[group_by])
    sum[group_by] += values['add']
  }

  var dataList = []
  for (var index in sum) {
    dataList.push([index, sum[index]])
  }

  if (order) {
    return dataList.sort(compare)
  }
  else {
    return dataList.sort(compare_reverse)
  }
}


export default consolidate;
