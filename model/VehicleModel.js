let vehicleData = [
  {
    vehicleCode: "V001",
    licensePlateNo: "ABC1234",
    vehicleCategory: "Sedan",
    fuelType: "PETROL",
    status: "ACTIVE",
    remarks: "No issues",
    StaffId: "S001",
  },
  // Other vehicle records
];
export function getVehicleData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/vehicles/allvehicles", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      console.log("Vehicle data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}
export function addVehicleData(newVehicle, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/vehicles", // Replace with your actual backend URL
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(newVehicle), // Send the form data as JSON
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (response) {
      console.log("Vehicleadded successfully:", response);
      alert("Vehicle added successfully!");
      callback(true);
    },
    error: function (xhr, status, error) {
      callback(true);
      console.error("Error adding vehicle:", error);
      alert("Error adding staff. This user cannot access vehicle");
    },
  });
}
export function updateVehicleData(vehicleCode, updatedVehicleData, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/vehicles/${vehicleCode}`, // Endpoint URL
    type: "PUT", // HTTP method
    contentType: "application/json", // Content type for JSON
    data: JSON.stringify(updatedVehicleData), // Convert data to JSON string
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function () {
      alert("Vehicle updated successfully!");
      callback(true);
    },
    error: function (xhr) {
      callback(false);
      console.error("Error updating vehicle:", xhr.responseText);
      alert("Error updateing staff. This user cannot access vehicle");

    },
  });
}

export function deleteVehicle(vehicleCode, cardElement, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!vehicleCode) {
    console.error("Vehicle code is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/vehicles/${vehicleCode}`, // API endpoint to delete staff by ID
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      cardElement.remove();
      callback(true);
      alert("Vehicler deleted successfully.");
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error("There was an error with the AJAX request:", error);
      alert("Error deleting vehicle. This user cannot access vehicle");
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
      const staffSelector = $("#staffId"); // Select the dropdown
      staffSelector.empty();
      console.log(data, "Staff data");
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
