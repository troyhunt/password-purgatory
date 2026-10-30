window.addEventListener("load", function () {
  document
    .getElementById("passwordPurgatory")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      let password = document.getElementById("password").value;
      let feedback = document.getElementById("response");

      submitHell(password, feedback);

      return false;
    });
});

async function submitHell(password, feedback) {
  // Hide the existing response
  feedback.style.display = "none";

  let url = `https://api.passwordpurgatory.com/make-hell?password=${encodeURIComponent(
    password
  )}`;

  let headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  });

  let params = {
    headers,
    mode: "cors",
  };

  let response = await fetch(url, params);
  let json = await response.json();

  // Add a visible delay before showing the response
  setTimeout(function () {
    feedback.textContent = json.message;
    feedback.style.display = "block";
  }, 900);
}
