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

  const email = document.querySelector(
    ".sign-up-form input[type='email']"
  ).value;
  const password = document.querySelector(
    ".sign-up-form input[type='password']"
  ).value;
  const jobRole = document.getElementById("jobRole").value;

  if (!jobRole) {
    alert("Please select a job role.");
    return;
  }

  // Use FormData to handle multipart form data
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", jobRole);

  // Debug: Log form data entries
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Send AJAX request
  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/auth/signup", // Replace with your backend endpoint
    type: "POST",
    processData: false, // Prevent jQuery from processing the data
    contentType: false, // Let the browser set the Content-Type header
    data: formData,
    success: function (response) {
      const token = response.token; // Assuming your backend returns a JWT token
      localStorage.setItem("jwtToken", token); // Store token in localStorage
      alert("Sign up successful!");
      window.location.href = "/pages/dashboard.html"; // Redirect to the dashboard
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

  const email = document.querySelector(
    ".sign-in-form input[type='email']"
  ).value;
  const password = document.querySelector(
    ".sign-in-form input[type='password']"
  ).value;

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
      window.location.href = "/pages/dashboard.html"; // Redirect to the dashboard
    },
    error: function (xhr) {
      console.error("Sign in failed:", xhr.responseText);
      alert("Sign in failed: " + xhr.responseText);
    },
  });
});
