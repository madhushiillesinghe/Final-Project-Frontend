let staffData = [
  {
    id: "S01",
    name: {
      firstName: "Amindu",
      lastName: "Dushan",
    },
    designation: "Galle",
    gender: "MALE",
    joinedDate: "2002-10-23",
    dob: "2002-11-27",
    address: {
      roadNo: "No1",
      street: "Mahamodara",
      city: "Colombo",
      district: "Diyagam",
      province: "Homagam",
    },
    contactNo: "0776210846",
    email: "ami@2704",
    role: "OTHER",
  },
  {
    id: "S02",
    name: {
      firstName: "Amindu",
      lastName: "Dushan",
    },
    designation: "Galle",
    gender: "MALE",
    joinedDate: "2002-10-23",
    dob: "2002-11-27",
    address: {
      roadNo: "No1",
      street: "Mahamodara",
      city: "Colombo",
      district: "Diyagam",
      province: "Homagam",
    },
    contactNo: "0776210846",
    email: "ami@2704",
    role: "OTHER",
  },
];

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
      console.log("Staff data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
  // return staffData;
}
export function addStaffData(newStaff,callback) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: 'http://localhost:8080/agriculture/api/v1/staff', // Replace with your actual backend URL
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(newStaff), // Send the form data as JSON
    success: function (response) {
      console.log('Staff added successfully:', response);
      // After successful submission, update the UI
      alert("Staff member added successfully!");
      callback(true)


    },
    error: function (xhr, status, error) {
      callback(true)
      console.error("Error adding staff:", error);
      alert("Error adding staff. Please try again.");
    }
  });
}
export function updateStaff(staffId, updatedStaffData, callback) {
  $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/staff/${staffId}`, // Endpoint URL
    type: 'PUT',             // HTTP method
    contentType: 'application/json', // Content type for JSON
    data: JSON.stringify(updatedStaffData), // Convert data to JSON string
    success: function () {
      alert("Staff member updated successfully!");
      callback(true)
    },
    error: function (xhr) {
      callback(false)
      console.error("Error updating staff:", xhr.responseText);
    },
  });
}



export function deleteStaff(staffId, cardElement) {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("You must be logged in to perform this action.");
    return;
  }

  if (!staffId) {
    console.error("Staff ID is missing");
    return;
  }

  return $.ajax({
    url: `http://localhost:8080/agriculture/api/v1/staff/${staffId}`, // API endpoint to delete staff by ID
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`, // Include the JWT token (use backticks for template literals)
    },
    success: function (data) {
      cardElement.remove();
      alert("Staff member deleted successfully.");
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
      alert("An error occurred while deleting the staff member.");
    },
  });
}
