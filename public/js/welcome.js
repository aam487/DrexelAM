// public/js/welcome.js
// event listener for login/register form
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".button");
    const registerBtn = document.querySelector(".button1");

    // event listener for login button, got to login page
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "loginpage.html";
    });

    // event listener for register button, got to sign up page
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "signup.html";
    });
  });
  
