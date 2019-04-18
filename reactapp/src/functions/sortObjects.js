function sort_by_key(array, key) {
  return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        if (x < y) return -1;
        if (y > x) return 1;
        return 0;
    });
}

function sort_by_key_reverse(array, key) {
  return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        if (x < y) return 1;
        if (y > x) return -1;
        return 0;
    });
}

function sort_by_keys(array, keys) {
  return array.sort(function(a, b) {
        var x = a;
        var y = b;
        for (var index in keys) {
          x = x[keys[index]]
          y = y[keys[index]]
        }
        if (x < y) return -1;
        if (y > x) return 1;
        return 0;
    });
}

function sort_objects(array, keys, order=false) {
    console.log("Array", array, keys)
  if (typeof(keys) != 'string') {
    return sort_by_keys(array, keys);
  }
  else {
    if (order) {
      return sort_by_key(array, keys)
    }
    else {
      return sort_by_key_reverse(array, keys)
    }
  }
}


export default sort_objects;
