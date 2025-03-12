// public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-box form");
  const usernameInput = form.querySelector('input[placeholder="Username"]');
  const passwordInput = form.querySelector('input[placeholder="Password"]');
  const loginButton = document.querySelector(".signup-box .button");
  const cancelButton = document.querySelector(".signup-box .button1");

// Event listener for login button
  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    // get username and password
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
	// try to login with credentials
	try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',  // Ensures cookies (for sessions) are sent
            body: JSON.stringify({ username, password })
        });
        // report error
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Login failed.");
        }

        const data = await response.json();
	// if the user is an author send them to author dashboard, if reader go to reader dashboard
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
  // event listener for cancel button, return to welcome page
  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "welcomepage.html";
  });
});
