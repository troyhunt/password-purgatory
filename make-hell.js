/*
ToDo: async request to https://api.passwordpurgatory.com/make-hell?password=foo on form submit
This script should be embedable in an external page on another site (such as troyhunt.com!) so it's
an easy drop-in solution.
*/

function submit(password) {
    var urlEncodedPassword = encodeURIComponent(password)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
            alert(xhr.response);
        }
    }
    xhr.open('post', `https://api.passwordpurgatory.com/make-hell?password=${urlEncodedPassword}`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send();
}