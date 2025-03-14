const registerButton = document.querySelector("#register__button");

if (registerButton) {
  registerButton.onclick = async () => {
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;

    console.log({ login, password })

    const response = await fetch("/users/register", {
      method: "POST",
      body: JSON.stringify({ login, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else {
      // window.location.href = "/users/register";
    }

    const responseData = await response.json();
    console.log({
      responseData
    });
  }
}
