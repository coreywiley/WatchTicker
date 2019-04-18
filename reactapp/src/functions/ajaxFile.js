import $ from 'jquery';

function ajaxWrapperFile(type, url, data, returnFunc){
    if (type === "POST"){
        data.append('csrfmiddlewaretoken', window.secretReactVars["csrfmiddlewaretoken"]);
    }

    //url = "http://localhost:8000" + url;

    $.ajax({
        type: type,
        url: url,
        data: data,

        dataType: 'json',
        processData: false,
        contentType: false,

        success: function (value) {
            returnFunc(value);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}


export default ajaxWrapperFile;
