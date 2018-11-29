import { AsyncStorage } from 'react-native';

let ajaxWrapper = async(type, url, data, returnFunc) => {
  if (type == 'GET') {
    var config = {method:'GET'}
  }
  else if (type == 'POST') {
    var csrfmiddlewaretoken = await loadToken()
    var user_token = await loadUserToken()
    console.log("User Token", user_token)
    var formData = new FormData();
    for (item in data) {
       if (typeof(data[item]) == 'object') {
          formData.append(item,JSON.stringify(data[item]));
       } else {
          formData.append(item,data[item]);
       }

     }

      formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken)
      //console.log(data);
      //console.log(formData);


      var headers = {'Accept': 'application/json','Content-Type': 'multipart/form-data;'}
      if (user_token) {
        headers['Authorization'] = 'Bearer ' + user_token;
      }
      //console.log("Headers", headers)

      var config = {method:'POST', body:formData, headers:headers}
  }

  url = "http://norma.jthiesen1.webfactional.com" + url;
  //console.log(url);
  fetch(url,config)
    .then(response => response.json().then(data => data))
    .then(result => {
        returnFunc(result);
    })
    .catch(error => returnFunc(error));
}

let refreshToken = async(type, url, data, returnFunc) => {
      var refreshData = {};
      var csrfmiddlewaretoken = await loadToken()
      var refresh_token = await loadRefreshToken()
      refreshData["csrfmiddlewaretoken"] = csrfmiddlewaretoken;

      refreshData['refresh'] = '';
      if (refresh_token) {
        refreshData['refresh'] = refresh_token
      }

      var formData = new FormData();
      formData.append("csrfmiddlewaretoken",csrfmiddlewaretoken);
      formData.append("refresh",refresh_token);

      var headers = {'Accept': 'application/json','Content-Type': 'multipart/form-data;'}

      var config = {method:'POST', body:formData, headers:headers}

    url = "http://norma.jthiesen1.webfactional.com" + url;
    console.log(url);
    fetch(url,config)
      .then(response => response.json().then(data => data))
      .then(result => {
        setToken();
        ajaxWrapper(type, url, data, returnFunc)
      })
      .catch(error => returnFunc(error));
  }

let setToken = async(result) => {
    await AsyncStorage.setItem('token', result['access'])
  }

let loadToken = async() => {
  var csrfmiddlewaretoken = await AsyncStorage.getItem('csrfmiddlewaretoken')
  return csrfmiddlewaretoken;
}

let loadUserToken = async() => {
  var user_token = await AsyncStorage.getItem('token')
  return user_token;
}

let loadRefreshToken = async() => {
  var refresh_token = await AsyncStorage.getItem('refresh_token')
  return refresh_token;
}

export default ajaxWrapper;
