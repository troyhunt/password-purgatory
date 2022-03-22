function submitHell(password) {
    var urlEncodedPassword = encodeURIComponent(password)
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.response);
            document.getElementById('response').innerHTML=json.message;
        }
    }
    xhr.open('post', 'https://api.passwordpurgatory.com/make-hell?password=' + urlEncodedPassword, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send();
}