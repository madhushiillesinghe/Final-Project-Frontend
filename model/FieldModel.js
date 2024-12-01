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
    const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage
  
    $.ajax({
      url: "http://localhost:8080/agriculture/api/v1/fields", // Replace with your actual backend URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newField), // Send the form data as JSON
      success: function (response) {
        console.log("Field added successfully:", response);
        // After successful submission, update the UI
        alert("Field added successfully!");
        callback(true);
      },
      error: function (xhr, status, error) {
        callback(true);
        console.error("Error adding Field:", error);
        alert("Error adding Field. Please try again.");
      },
    });
  }
  export function updateField(fieldCode, updatedFieldData, callback) {
    $.ajax({
      url: `http://localhost:8080/agriculture/api/v1/fields/${fieldCode}`, // Endpoint URL
      type: "PUT", // HTTP method
      contentType: "application/json", // Content type for JSON
      data: JSON.stringify(updatedFieldData), // Convert data to JSON string
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
        Authorization: `Bearer ${token}`, // Include the JWT token (use backticks for template literals)
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