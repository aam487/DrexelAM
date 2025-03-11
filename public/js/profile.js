// public/js/profile.js
document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleSelect = document.querySelector("select"); // or use getElementById("role") if available
    const saveProfileBtn = document.getElementById("saveProfile");
    const logoutBtn = document.getElementById("logout");
  
    saveProfileBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      let role = roleSelect.value;
      const password = passwordInput.value; // optional; if empty, backend ignores password change
  
      // Validate username
      if (!username) {
        alert("Username cannot be empty.");
        return;
      }
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      // Validate role
      if (!role) {
        alert("Please select a role.");
        return;
      }
      const roleMapping = {
        user: "reader",
        admin: "author"
      };
      if (role === "moderator" || !roleMapping[role]) {
        alert("Invalid role selected. Please choose either Reader or Author.");
        return;
      }
      role = roleMapping[role];
  
      // If a new password is provided, check its length
      if (password && password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
  
      try {
        const response = await fetch("/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'same-origin',
          body: JSON.stringify({ username, email, password, role })
        });
        if (response.ok) {
          alert("Profile updated successfully.");
          window.location.href = "/";
        } else {
          const errorText = await response.text();
          alert("Profile update failed: " + errorText);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile.");
      }
    });
  
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/auth/logout";
    });
  });
  