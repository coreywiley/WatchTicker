import $ from 'jquery';

function ajaxWrapper(type, url, data, returnFunc){
    if (type === "POST"){
        data["csrfmiddlewaretoken"] = window.secretReactVars["csrfmiddlewaretoken"];
    }


    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function (value) {
            console.log(url);
            console.log(value);

            if (typeof(value) === "object" && "redirect" in value) {
                window.location = value['redirect'] + "?redirect=" + window.secretReactVars["BASE_URL"];
            }

            returnFunc(value);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}


export default ajaxWrapper;
