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
    // Specify your own domain using the apiDomain varaible. If nothing defined, then stick to the default
    let domain = typeof loggerDomain !== 'undefined' ? loggerDomain : "https://api.passwordpurgatory.com";
    const rawResponse = await fetch(
      domain + "/log-hell",
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
