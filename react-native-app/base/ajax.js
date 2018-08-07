import { AsyncStorage } from 'react-native';

let ajaxWrapper = async(type, url, data, returnFunc) => {
  if (type == 'GET') {
    var config = {method:'GET'}
  }
  else if (type == 'POST') {
    var csrfmiddlewaretoken = await loadToken()
    var formData = new FormData();
    for (item in data) {
       if (typeof(data[item]) == 'object') {
          formData.append(item,JSON.stringify(data[item]));
       } else {
          formData.append(item,data[item]);
       }

     }

      formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken)
      console.log(data);
      console.log(formData);
      var headers = {'Accept': 'application/json','Content-Type': 'multipart/form-data;'}

      var config = {method:'POST', body:formData, headers:headers}
  }

  url = "http://golf.jthiesen1.webfactional.com" + url;
  console.log(url);
  fetch(url,config)
    .then(response => response.json().then(data => data))
    .then(result => {
        returnFunc(result);
    })
    .catch(error => returnFunc(error));
}

let loadToken = async() => {
  var csrfmiddlewaretoken = await AsyncStorage.getItem('csrfmiddlewaretoken')
  return csrfmiddlewaretoken;
}

export default ajaxWrapper;
