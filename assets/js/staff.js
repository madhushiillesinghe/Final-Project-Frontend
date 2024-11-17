// import {set} from '../js/staffaddform'
 let staffData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    designation: "Scientist",
    gender: "MALE",
    joinedDate: "2020-01-01",
    dob: "1990-05-15",
    roadNumber: "123",
    street: "Main St",
    city: "Galle",
    district: "Galle",
    province: "Southern",
    contactNo: "0771234567",
    email: "john.doe@example.com",
    role: "SCIENTIST",
  },
  // Other staff records
];
$(document).ready(() => {
  loadStaffTable(); // Initial table load
});

function loadStaffTable() {
  const tbody = $("#staff-table-body");
  tbody.empty(); // Clear existing rows
  staffData.forEach((staffData) => {
    tbody.append(`
        <tr>
          <td>${staffData.id}</td>
          <td>${staffData.firstName + " " + staffData.lastName}</td>
          <td>${staffData.street + " " + staffData.city + " " + staffData.district}</td>
          <td>${staffData.role}</td>
          <td>${staffData.contactNo}</td>
          <td>${staffData.email}</td>
          <td class="action-icons">
            <i class="fas fa-edit me-3" onclick="editStaff(${
              staffData.id
            })"></i>
            <i class="fas fa-trash-alt" onclick="deleteStaff(${
              staffData.id
            })"></i>
          </td>
        </tr>
      `);
  });

  // Ensure the icons are styled after they are added to the DOM
  $(".action-icons i").css("color", "black");
}


// Function to handle the edit icon click
function editStaff(id) {
  // Find the staff record by ID
  const staff = staffData.find((s) => s.id === id);

  if (staff) {
    // Populate the form with the staff data
    document.getElementById("id").value = staff.id;
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("contactNo").value = staff.contactNo;
    document.getElementById("email").value = staff.email;
    // Populate additional fields as needed

    // Show the modal
    const editStaffModal = new bootstrap.Modal(
      document.getElementById("editStaffModal")
    );
    editStaffModal.show();
  } else {
    alert("Staff not found!");
  }
}

// Function to save changes
function saveStaffChanges() {
  const updatedStaff = {
    id: document.getElementById("id").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    contactNo: document.getElementById("contactNo").value,
    email: document.getElementById("email").value,
    // Include other fields
  };

  // Update the staff data
  const index = staffData.findIndex((s) => s.id == updatedStaff.id);
  if (index !== -1) {
    staffData[index] = updatedStaff;
    alert("Staff details updated successfully!");
    // Refresh the table if necessary
  }

  // Close the modal
  const editStaffModal = bootstrap.Modal.getInstance(
    document.getElementById("editStaffModal")
  );
  editStaffModal.hide();
}

  

document.getElementById("actionButton").addEventListener("click", function () {
  const action = document.getElementById("staffForm").dataset.action;

  const newStaffData = {
    id: document.getElementById("id").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    designation: document.getElementById("designation").value,
    gender: document.getElementById("gender").value,
    joinedDate: document.getElementById("joinedDate").value,
    dob: document.getElementById("dob").value,
    roadNumber: document.getElementById("roadNumber").value,
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    district: document.getElementById("district").value,
    province: document.getElementById("province").value,
    contactNo: document.getElementById("contactNo").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
  };

  if (action === "edit") {
    // Update the staff data in the array
    const index = staffData.findIndex((s) => s.id == newStaffData.id);
    if (index !== -1) {
      staffData[index] = newStaffData;
      alert("Staff details updated successfully!");
    }
  } else {
    // Add new staff
    staffData.push(newStaffData);
    alert("New staff added successfully!");
  }

  loadStaffTable(); // Reload the table or other UI elements after update
  resetForm(); // Reset the form to clear out data after action
  window.location.href = "/pages\staff.html"; // Update with actual staff table page path
});

function resetForm() {
  document.getElementById("staffForm").reset();
  document.getElementById("actionButton").textContent = "Add";
  document.getElementById("actionButton").style.backgroundColor = "green";
  document.getElementById("staffForm").dataset.action = "add";
}

function deleteStaff(id) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    staffData = staffData.filter((s) => s.id !== id);
    loadStaffTable();
  }
}

