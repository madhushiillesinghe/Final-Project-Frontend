let equipmentData = [
  {
    id: "E001",
    name: "Tractor",
    type: "Heavy",
    status: "ACTIVE",
    fieldCode: "F001",
    staffId: "S001",
  },
  // Add more initial equipment records here if needed
];

export function getEquipmentData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  return $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/equipments/allequipment", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (data) {
      console.log("Equipment data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
}
export function addEquipmentData(newEquipment, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/equipments", // Replace with your actual backend URL
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(newEquipment), // Send the form data as JSON
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (response) {
      console.log("Equipment added successfully:", response);
      alert("Equipment added successfully!");
      callback(true);
    },
    error: function (xhr, status, error) {
      callback(true);
      console.error("Error adding Equipment:", error);
      alert("Error adding Equipment. Please try again.");
    },
  });
}
export function updateEquipmentData(
  equipmentCode,
  updatedEquipmentData,
  callback
) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/equipments/${equipmentCode}`, // Endpoint URL
    type: "PUT", // HTTP method
    contentType: "application/json", // Content type for JSON
    data: JSON.stringify(updatedEquipmentData), // Convert data to JSON string
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function () {
      alert("Equipment updated successfully!");
      callback(true);
    },
    error: function (xhr) {
      callback(false);
      console.error("Error updating Equipment:", xhr.responseText);
    },
  });
}

export function deleteEquipment(equipmentCode, cardElement, callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!equipmentCode) {
    console.error("Equipment Code is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/equipments/${equipmentCode}`, // API endpoint to delete staff by ID
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (data) {
      cardElement.remove();
      callback(true);
      alert("Equipment deleted successfully.");
    },
    error: function (xhr, status, error) {
      callback(false);
      console.error("There was an error with the AJAX request:", error);
      alert("An error occurred while deleting the Equipment");
    },
  });
}
