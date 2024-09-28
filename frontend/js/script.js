document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const profileButton = document.getElementById("profile-button");
    const responseMessage = document.getElementById("response-message");

    const backend = 'http://backend:8000'; // Replace with your actual backend URL

    // General function to handle form submissions
    async function handleFormSubmission(url, data, redirectUrl) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            responseMessage.textContent = result.msg;
            responseMessage.className = result.status === 200 ? "success" : "error";

            if (result.status === 200) {
                localStorage.setItem("token", result.token); // Store token in local storage
                window.location.href = redirectUrl; // Redirect on success
            }
        } catch (error) {
            responseMessage.textContent = "An error occurred. Please try again.";
            responseMessage.className = "error";
        }
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;

            handleFormSubmission(`http://${backend}:8000/login`, { username, password }, "/profile.html");
        });
    }

    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;

            handleFormSubmission(`http://${backend}:8000/register`, { username, password }, "/login.html");
        });
    }

    // Profile button click
    if (profileButton) {
        profileButton.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            const responseMessage = document.getElementById("response-message");

            try {
                const response = await fetch(`http://${backend}:8000/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                responseMessage.textContent = result.msg;
                responseMessage.className = result.status === 200 ? "success" : "error";
            } catch (error) {
                responseMessage.textContent = "An error occurred. Please try again.";
                responseMessage.className = "error";
            }
        });
    }
});
