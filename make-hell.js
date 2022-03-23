async function submitHell(password, feedback) {
    let url = `https://api.passwordpurgatory.com/make-hell?password=${encodeURIComponent(password)}`;
    let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    let params = {
        headers,
        mode: 'cors'
    };
    let response = await fetch(url, params);
    let json = await response.json();
    feedback.innerHTML = json.message;
}