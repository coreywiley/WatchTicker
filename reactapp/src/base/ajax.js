import $ from 'jquery';

function handleerror(xhr, status, erro) {
  console.log("Ajax Failure")
  console.log(xhr.responseText);
  console.log(status)
  console.log(erro)
}

function ajaxWrapper(type, url, data, returnFunc){
    if (type === "POST"){
        data["csrfmiddlewaretoken"] = window.secretReactVars["csrfmiddlewaretoken"];
        console.log("CSRF", data['csrfmiddlewaretoken'])
    }
    console.log("Url",url);
      $.ajax({
          type: type,
          url: url,
          data: data,
          success: function (value) {
              if (typeof(value) === "object" && "redirect" in value) {
                  window.location = value['redirect'] + "?redirect=" + window.secretReactVars["BASE_URL"];
              }
              returnFunc(value);
          },
          error: function(xhr, status, error) {
              handleerror(xhr,status,error)
          }
      });

}


export default ajaxWrapper;
