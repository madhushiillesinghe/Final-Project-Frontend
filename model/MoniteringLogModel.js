let logs = [
  {
    logCode: "L001",
    logDate: "2024-11-25",
    observation: "Crop issue detected",
    fieldCode: "F01",
    cropCode: "C001",
    staffCode: "S001",
  },
  {
    logCode: "L002",
    logDate: "2024-11-24",
    observation: "No abnormalities",
    fieldCode: "F02",
    cropCode: "C002",
    staffCode: "S002",
  },
];

export function getMoniteringLogData() {
  const token = localStorage.getItem("jwtToken");

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/logs/alllogs", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (data) {
      console.log("Monitering Log data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
}
export function addMoniteringLogData(newMoniteringLog, callback) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();
  formData.append("logCode", newMoniteringLog.logCode);
  formData.append("logDate", newMoniteringLog.logDate);
  formData.append("observation", newMoniteringLog.observation); // Send JSON string
  formData.append("fieldCode", newMoniteringLog.fieldCode);
  formData.append("observedImage", newMoniteringLog.observedImage); // Append file object

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log all form data to debug
  }

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/logs", // Backend URL
    type: "POST",
    contentType: false, // Let jQuery handle the content type
    processData: false, // Ensure FormData is not converted into a query string
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in Authorization header
    },
    success: function (response) {
      console.log("Log added successfully:", response);
      alert("Log added successfully!");
      callback(true); // Indicate success
    },
    error: function (xhr, status, error) {
      console.error("Error adding Log:", xhr.responseText || error);
      console.error("Status Code:", xhr.status); // Log the status code
      alert(`Error adding Log: ${xhr.responseText || error}`);
      callback(false); // Indicate failure
    },
  });
}

export function updateMonitoringLog(
  logCode,
  updatedFieldData,
  crops,
  callback
) {
  console.log(crops, "crops");
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Validate the crops parameter
  if (!Array.isArray(crops)) {
    console.error("The 'crops' parameter is not an array:", crops);
    alert("Invalid crops data. Please try again.");
    callback(false);
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();

  // Append request parts
  formData.append("logCode", updatedFieldData.logCode);
  formData.append("logDate", updatedFieldData.logDate);
  formData.append("observation", updatedFieldData.observation);
  formData.append("fieldCode", updatedFieldData.fieldCode);

  // Append the observed image, if provided
  if (updatedFieldData.observedImage) {
    formData.append("observedImage", updatedFieldData.observedImage);
  }

  // Construct the URL with query parameters for crops
  const queryParams = crops
    .map((crop) => `crops=${encodeURIComponent(crop)}`)
    .join("&");
  console.log(queryParams, "crop id");
  const url = `http://localhost:8080/agriculture/api/v1/logcrop/${logCode}?${queryParams}`;

  // Debugging: Log FormData entries
  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  // Send the AJAX request
  $.ajax({
    url: url, // Endpoint with query parameters for crops
    type: "PUT", // HTTP method
    contentType: false, // Let jQuery handle the content type
    processData: false, // Prevent jQuery from transforming the FormData object
    data: formData, // FormData payload
    headers: {
      Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
    },
    success: function (response) {
      alert("Monitoring Log updated successfully!");
      callback(true);
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error(
        `Error updating Monitoring Log (Status: ${status}):`,
        error
      );
      console.error("Response:", xhr.responseText);
    },
  });
}

export function deleteMoniteringLog(logCode, cardElement, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!logCode) {
    console.error("Field logCode is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/logs/${logCode}`, // API endpoint to delete staff by ID
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      cardElement.remove();
      callback(true);
      alert("Monitering Log deleted successfully.");
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error("There was an error with the AJAX request:", error);
      alert("An error occurred while deleting the Monitering Log.");
    },
  });
}
export function getStaffData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/staff/allstaff", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      const staffSelector = $("#staffCode"); // Select the dropdown
      staffSelector.empty();
      data.forEach((staff) => {
        // Append each field name as an <option>
        staffSelector.append(
          `<option value="${staff.id}">${staff.name.firstName}</option>`
        );
      });
      console.log("Staff data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}

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
      const fieldSelector = $("#fieldCode"); // Select the dropdown
      fieldSelector.empty();
      console.log(data, "field data");
      data.forEach((field) => {
        // Append each field name as an <option>
        fieldSelector.append(
          `<option value="${field.fieldCode}">${field.fieldName}</option>`
        );
      });
      console.log("Field data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}
export function getCropData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/crops/allcrops", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (data) {
      const cropSelector = $("#cropCode"); // Select the dropdown
      cropSelector.empty();
      console.log(data, "crop data");
      data.forEach((crop) => {
        // Append each field name as an <option>
        cropSelector.append(
          `<option value="${crop.code}">${crop.commonName}</option>`
        );
      });
      console.log("Crop data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
}
export function updateMonitoringLogStaff(
  logCode,
  updatedFieldData,
  staff,
  callback
) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Validate the crops parameter
  if (!Array.isArray(staff)) {
    console.error("The 'crops' parameter is not an array:", staff);
    alert("Invalid crops data. Please try again.");
    callback(false);
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();

  // Append request parts
  formData.append("logCode", updatedFieldData.logCode);
  formData.append("logDate", updatedFieldData.logDate);
  formData.append("observation", updatedFieldData.observation);
  formData.append("fieldCode", updatedFieldData.fieldCode);

  // Append the observed image, if provided
  if (updatedFieldData.observedImage) {
    formData.append("observedImage", updatedFieldData.observedImage);
  }

  // Construct the URL with query parameters for crops
  const queryParams = staff
    .map((staffData) => `staff=${encodeURIComponent(staffData)}`)
    .join("&");
  console.log(queryParams, "staff id");
  const url = `http://localhost:8080/agriculture/api/v1/logstaff/${logCode}?${queryParams}`;

  // Debugging: Log FormData entries
  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  // Send the AJAX request
  $.ajax({
    url: url, // Endpoint with query parameters for crops
    type: "PUT", // HTTP method
    contentType: false, // Let jQuery handle the content type
    processData: false, // Prevent jQuery from transforming the FormData object
    data: formData, // FormData payload
    headers: {
      Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
    },
    success: function (response) {
      alert("Monitoring Log staff updated successfully!");
      callback(true);
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error(
        `Error updating Monitoring Log (Status: ${status}):`,
        error
      );
      console.error("Response:", xhr.responseText);
    },
  });
}
