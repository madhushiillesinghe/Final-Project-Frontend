let fieldData = [
  {
    fieldCode: "F001",
    fieldName: "Field A",
    fieldLocation: "40.7128, -74.0060",
    extentSize: 10.5,
    fieldImage1: "https://via.placeholder.com/100",
    fieldImage2: "https://via.placeholder.com/100",
  },
];
export function getFieldData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/fields/allfields", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      console.log("Field data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}
export function addFieldData(newField, callback) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();
  formData.append("fieldCode", newField.fieldCode);
  formData.append("fieldName", newField.fieldName);
  formData.append("fieldLocation", newField.fieldLocation); // Send JSON string
  formData.append("extentSize", newField.extentSize);
  formData.append("fieldImage1", newField.fieldImage1); // Append file object
  formData.append("fieldImage2", newField.fieldImage2); // Append file object

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log all form data to debug
  }

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/fields", // Backend URL
    type: "POST",
    contentType: false, // Let jQuery handle the content type
    processData: false, // Ensure FormData is not converted into a query string
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in Authorization header
    },
    success: function (response) {
      console.log("Field added successfully:", response);
      alert("Field added successfully!");
      callback(true); // Indicate success
    },
    error: function (xhr, status, error) {
      console.error("Error adding Field:", xhr.responseText || error);
      console.error("Status Code:", xhr.status); // Log the status code
      alert(`Error adding Field: ${xhr.responseText || error}`);
      callback(false); // Indicate failure
    },
  });
}

export function updateField(fieldCode, updatedFieldData, callback) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();
  formData.append("fieldCode", updatedFieldData.fieldCode);
  formData.append("fieldName", updatedFieldData.fieldName);
  formData.append("fieldLocation", updatedFieldData.fieldLocation); // Send JSON string
  formData.append("extentSize", updatedFieldData.extentSize);
  formData.append("fieldImage1", updatedFieldData.fieldImage1); // Append file object
  formData.append("fieldImage2", updatedFieldData.fieldImage2); // Append file object

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log all form data to debug
  }

  $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/fields/${fieldCode}`, // Endpoint URL
    type: "PUT", // HTTP method
    contentType: false, // Let jQuery handle the content type
    processData: false, // Ensure FormData is not converted into a query string
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in Authorization header
    },
    success: function () {
      alert("Field updated successfully!");
      callback(true);
    },
    error: function (xhr) {
      callback(false);
      console.error("Error updating field:", xhr.responseText);
    },
  });
}

export function deleteField(fieldCode, cardElement, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!fieldCode) {
    console.error("Field Code is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/fields/${fieldCode}`, // API endpoint to delete staff by ID
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      cardElement.remove();
      callback(true);
      alert("Field deleted successfully.");
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error("There was an error with the AJAX request:", error);
      alert("An error occurred while deleting the field.");
    },
  });
}
