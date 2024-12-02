let cropData = [
  {
    cropCode: "C001",
    commonName: "Wheat",
    scientificName: "Triticum aestivum",
    category: "Grain",
    season: "Winter",
    cropImage: "https://via.placeholder.com/100",
  },
];
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
      console.log("Crop data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}
export function addCropData(newCrop, callback) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  // Create a FormData object to handle multipart/form-data
  const formData = new FormData();
  formData.append("code", newCrop.code);
  formData.append("commonName", newCrop.commonName);
  formData.append("scientificName", newCrop.scientificName); // Send JSON string
  formData.append("cropImage", newCrop.cropImage);
  formData.append("category", newCrop.category); // Append file object
  formData.append("season", newCrop.season); // Append file object
  formData.append("fieldCode", newCrop.fieldCode); // Append file object

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log all form data to debug
  }

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/crops", // Backend URL
    type: "POST",
    contentType: false, // Let jQuery handle the content type
    processData: false, // Ensure FormData is not converted into a query string
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token in Authorization header
    },
    success: function (response) {
      console.log("crop added successfully:", response);
      alert("Crop added successfully!");
      callback(true); // Indicate success
    },
    error: function (xhr, status, error) {
      console.error("Error adding crop:", xhr.responseText || error);
      console.error("Status Code:", xhr.status); // Log the status code
      alert(`Error adding Field: ${xhr.responseText || error}`);
      callback(false); // Indicate failure
    },
  });
}

export function updateCrop(cropCode, updatedCropData, callback) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("Authentication token is missing. Please log in again.");
    return;
  }

  const formData = new FormData();
  formData.append("code", updatedCropData.code);
  formData.append("commonName", updatedCropData.commonName);
  formData.append("scientificName", updatedCropData.scientificName);
  formData.append("cropImage", updatedCropData.cropImage); // File object
  formData.append("category", updatedCropData.category);
  formData.append("season", updatedCropData.season);
  formData.append("fieldCode", updatedCropData.fieldCode);

  console.log("FormData Entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/crops/${cropCode}`,
    type: "PUT",
    contentType: false,
    processData: false,
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function () {
      alert("Crop updated successfully!");
      callback(true);
    },
    error: function (xhr) {
      console.error("Error updating Crop:", xhr.responseText);
      alert(`Failed to update crop. Server response: ${xhr.responseText}`);
      callback(false);
    },
  });
}

export function deleteCrop(cropCode, cardElement, callback) {
  console.log(cropCode, "cropcode is");
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!cropCode) {
    console.error("Crop Code is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/crops/${cropCode}`, // API endpoint to delete staff by ID
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
      alert("An error occurred while deleting the crop");
    },
  });
}
