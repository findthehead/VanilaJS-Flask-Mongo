document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const profileButton = document.getElementById("profile-button");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const responseMessage = document.getElementById("response-message");

            try {
                const response = await fetch(
                    "https://localhost:3000/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    }
                );

                const result = await response.json();
                responseMessage.textContent = result.msg;
                responseMessage.className =
                    result.status === 200 ? "success" : "error";

                if (result.status === 200) {
                    localStorage.setItem("token", result.token); // Store token in local storage
                    // Redirect to profile page after successful login
                    window.location.href = "/profile.html";
                }
            } catch (error) {
                responseMessage.textContent =
                    "An error occurred. Please try again.";
                responseMessage.className = "error";
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const responseMessage = document.getElementById("response-message");

            try {
                const response = await fetch(
                    "https://localhost:3000/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    }
                );

                const result = await response.json();
                responseMessage.textContent = result.msg;
                responseMessage.className =
                    result.status === 200 ? "success" : "error";

                if (result.status === 200) {
                    localStorage.setItem("token", result.token); // Store token in local storage
                    // Redirect to login page after successful registration
                    window.location.href = "/login.html";
                }
            } catch (error) {
                responseMessage.textContent =
                    "An error occurred. Please try again.";
                responseMessage.className = "error";
            }
        });
    }

    if (profileButton) {
        profileButton.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            const responseMessage = document.getElementById("response-message");

            try {
                const response = await fetch(
                    "https://localhost:3000/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();
                responseMessage.textContent = result.msg;
                responseMessage.className =
                    result.status === 200 ? "success" : "error";
            } catch (error) {
                responseMessage.textContent =
                    "An error occurred. Please try again.";
                responseMessage.className = "error";
            }
        });
    }
});
