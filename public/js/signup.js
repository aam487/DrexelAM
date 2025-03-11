// public/js/signup.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-box form");
  const usernameInput = form.querySelector('input[placeholder="Username"]');
  const emailInput = form.querySelector('input[placeholder="Email"]');
  const roleSelect = form.querySelector("select");
  const passwordInput = form.querySelector('input[placeholder="Password"]');
  const registerButton = document.querySelector(".signup-box .button");
  const cancelButton = document.querySelector(".signup-box .button1");

  registerButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    let role = roleSelect.value;
    const password = passwordInput.value;

    // Validate username
    if (!username) {
      alert("Username cannot be empty.");
      return;
    }
    // Validate email using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Validate role: if empty or invalid, do not proceed
    if (!role) {
      alert("Please select a role.");
      return;
    }
    // Map role values: "user" becomes "reader" and "admin" becomes "author"
    const roleMapping = {
      user: "reader",
      admin: "author"
    };
    if (role === "moderator" || !roleMapping[role]) {
      alert("Invalid role selected. Please choose either Reader or Author.");
      return;
    }
    role = roleMapping[role];

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin',
        body: JSON.stringify({ username, email, password, role })
      });
      if (response.ok) {
        window.location.href = "/";
      } else {
        const errorText = await response.text();
        alert("Registration failed: " + errorText);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  });

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "welcomepage.html";
  });
});
