// public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-box form");
  const usernameInput = form.querySelector('input[placeholder="Username"]');
  const passwordInput = form.querySelector('input[placeholder="Password"]');
  const loginButton = document.querySelector(".signup-box .button");
  const cancelButton = document.querySelector(".signup-box .button1");

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: ensure credentials (cookies) are sent with the request
        credentials: 'same-origin',
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        // Redirect to blog page upon successful login.
        window.location.href = "/blog";
      } else {
        const errorText = await response.text();
        alert("Login failed: " + errorText);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  });

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "welcomepage.html";
  });
});
