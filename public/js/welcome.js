document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".button");
    const registerBtn = document.querySelector(".button1");
  
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "loginpage.html";
    });
  
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "signup.html";
    });
  });
  