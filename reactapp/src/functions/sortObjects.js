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

function sort_objects(array, key, order=false) {
  if (order) {
    return sort_by_key(array, key)
  }
  else {
    return sort_by_key_reverse(array, key)
  }
}


export default sort_objects;
