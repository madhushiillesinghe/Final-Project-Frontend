const signInBtn = document.querySelector("#sign-in-btn");
const signUpBtn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});



signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// AJAX for Sign Up
document.querySelector(".sign-up-form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const email = document.querySelector(".sign-up-form input[type='email']").value;
  const password = document.querySelector(".sign-up-form input[type='password']").value;
  const jobRole = document.getElementById("jobRole").value;

  if (!jobRole) {
    alert("Please select a job role.");
    return;
  }

  const data = {
    email: email,
    password: password,
    role: jobRole,
  };

 

  $.ajax({
    url: "http://localhost:8080/api/v1/auth/signup", // Replace with your backend endpoint
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      alert("Sign up successful! Please log in.");
      document.querySelector(".sign-up-form").reset(); // Reset the form
    },
    error: function (xhr) {
      console.error("Sign up failed:", xhr.responseText);
      alert("Sign up failed: " + xhr.responseText);
    },
  });
});

// AJAX for Sign In
document.querySelector(".sign-in-form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  const email = document.querySelector(".sign-in-form input[type='email']").value;
  const password = document.querySelector(".sign-in-form input[type='password']").value;

  const data = {
    email: email,
    password: password,
  };
  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/auth/signin", // Replace with your backend endpoint
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      const token = response.token; // Assuming your backend returns a JWT token
      localStorage.setItem("jwtToken", token); // Store token in localStorage
      alert("Sign in successful!");
      window.location.href = "/pages/staff.html"; // Redirect to the dashboard
    },
    error: function (xhr) {
      console.error("Sign in failed:", xhr.responseText);
      alert("Sign in failed: " + xhr.responseText);
    },
  });
});