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
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',  // Ensures cookies (for sessions) are sent
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Login failed.");
        }

        const data = await response.json();

        if (data.success) {
            window.location.href = data.role === 'author' ? '/author_dash.html' : '/reader_dash.html';
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
