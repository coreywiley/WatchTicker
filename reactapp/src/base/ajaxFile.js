import $ from 'jquery';

function ajaxWrapperFile(type, url, data, returnFunc){
    if (type === "POST"){
        data.append('csrfmiddlewaretoken', window.secretReactVars["csrfmiddlewaretoken"]);
    }

    //url = "http://localhost:8000" + url;
    var SUCCESS = false;
    var AJAXING = true;

    $.ajax({
        type: type,
        url: url,
        data: data,

        dataType: 'json',
        processData: false,
        contentType: false,

        success: function (value) {
            AJAXING = false;
            SUCCESS = true;
            returnFunc(value);
        },
        error: function(xhr, status, error) {
            AJAXING = false;
            console.log(xhr.responseText);
        }
    });
}


export default ajaxWrapperFile;
