window.addEventListener("load", function () {
  document
    .getElementById("passwordPurgatory")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

      let kvKey = params.kvKey;
      let criteria = document.getElementById("response").innerHTML;
      let password = document.getElementById("password").value;

      logHell(kvKey, criteria, password);

      return false;
    });
});

async function logHell(kvKey, criteria, password) {
  (async () => {
    const rawResponse = await fetch(
      "https://api.passwordpurgatory.com/log-hell",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kvKey: kvKey,
          criteria: criteria,
          password: password,
        }),
      }
    );
  })();
}
