import $ from 'jquery';

function handleerror(xhr, status, error) {
  console.log("Ajax Failure");
  console.log(xhr.responseText);
  console.log(status);
  console.log(error);
}

function ajaxWrapper(type, url, data, returnFunc){
    if (type === "POST") {
        data["csrfmiddlewaretoken"] = window.secretReactVars["csrfmiddlewaretoken"];
        console.log("CSRF", data['csrfmiddlewaretoken']);
    }

    var auth_token = '';
    var beforeSend = null;
    if (localStorage.getItem('token')) {
        auth_token = 'Bearer ' + localStorage.getItem('token');
        beforeSend = function(request) {
            request.setRequestHeader('Authorization', auth_token);
        }
    }

    $.ajax({
        type: type,
        url: url,
        beforeSend: beforeSend,
        data: data,
        statusCode: {
            200: function(value) {
                if (typeof(value) === "object" && "redirect" in value) {
                    window.location = value['redirect'] + "?redirect=" + window.secretReactVars["BASE_URL"];
                }
                returnFunc(value);
            },
            400: function(value) {
                value = {'error': 'Bad Request'};
                returnFunc(value);
            },
            401: function(xhr) {
                refreshToken(type,url,data,returnFunc);
            }
        },
    });



}

function refreshToken(type, url, data, returnFunc){
      var refreshData = {};
      refreshData["csrfmiddlewaretoken"] = window.secretReactVars["csrfmiddlewaretoken"];
      var refresh_token = localStorage.getItem('refresh_token')

      refreshData['refresh'] = '';
      if (localStorage.getItem('refresh_token')) {
        refreshData['refresh'] = localStorage.getItem('refresh_token')
      }

      $.ajax({
          type: 'POST',
          url: '/users/token/refresh/',
          data: refreshData,
          statusCode: {
            401: function(xhr) {
              console.log('Refresh Token Expired');
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
            }
          },
          success: function (value) {
              localStorage.setItem('token',value['access'])
              ajaxWrapper(type, url, data, returnFunc)
          },
          error: function(xhr, status, error) {
            handleerror(xhr,status,error);
            console.log('Refresh Token Expired');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            //window.location.href = window.location.href;
          }
      });

}


export default ajaxWrapper;
