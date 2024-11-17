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
          <td>${
            staffData.street + " " + staffData.city + " " + staffData.district
          }</td>
          <td>${staffData.role}</td>
          <td>${staffData.contactNo}</td>
          <td>${staffData.email}</td>
          <td class="action-icons">
            <i class="fas fa-edit me-3" onclick="editStaff(${
              staffData.id
            })"></i>
            <i class="fas fa-trash-alt me-3" onclick="deleteStaff(${
              staffData.id
            })"></i>
             <i 
              class="fas fa-eye black-icon" 
              onclick="viewStaff(${staffData.id})"
          ></i>

          </td>
        </tr>
      `);
  });

  // Ensure the icons are styled after they are added to the DOM
  $(".action-icons i").css("color", "black");
}


// Function to handle the edit icon click
function editStaff(id) {
  setFormReadOnly(false);
  document.querySelector(".update").style.display = "";

  // Find the staff record by ID
  const staff = staffData.find((s) => s.id === id);

  if (staff) {
    // Populate the form with the staff data
    document.getElementById("id").value = staff.id;
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("contactNo").value = staff.contactNo;
    document.getElementById("email").value = staff.email;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("gender").value = staff.gender;
    document.getElementById("joinedDate").value = staff.joinedDate;
    document.getElementById("dob").value = staff.dob;
    document.getElementById("roadNumber").value = staff.roadNumber;
    document.getElementById("street").value = staff.street;
    document.getElementById("city").value = staff.city;
    document.getElementById("district").value = staff.district;
    document.getElementById("province").value = staff.province;
    document.getElementById("role").value = staff.role;

    // Populate additional fields as needed
    document.getElementById("editStaffModalLabel").innerText = "Edit Staff";

    const saveButton = document.querySelector(".update");
    saveButton.innerText = "Update";
    // Show the modal
    const editStaffModal = new bootstrap.Modal(
      document.getElementById("editStaffModal")
    );
    editStaffModal.show();
  } else {
    alert("Staff not found!");
  }
}
function saveStaffChanges() {
  const updatedStaff = {
    id: document.getElementById("id").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    contactNo: document.getElementById("contactNo").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
    province: document.getElementById("province").value,
    district: document.getElementById("district").value,
    city: document.getElementById("city"),
    street: document.getElementById("street"),
    roadNumber: document.getElementById("roadNumber").value,
    dob: document.getElementById("dob").value,
    joinedDate: document.getElementById("joinedDate").value,
    gender: document.getElementById("gender").value,
    designation: document.getElementById("designation").value,

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
function addStaff() {
  resetFormFields();

  // Enable all fields for editing
  setFormReadOnly(false);
  document.querySelector(".update").style.display = "";

  const fieldSelector = document.getElementById("fieldSelector");
  fieldSelector.classList.remove("d-none");

  const fields = [
    { id: 1, name: "Field 1" },
    { id: 2, name: "Field 2" },
    { id: 3, name: "Field 3" }
  ];

  fieldSelector.innerHTML = "<option value=''>Select Field</option>"; // Reset options first
  fields.forEach(field => {
    const option = document.createElement("option");
    option.value = field.id;
    option.textContent = field.name;
    fieldSelector.appendChild(option);
  });
  // Clear all form fields
  document.getElementById("id").value = ""; // Keep empty as ID will be auto-generated or set later
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("contactNo").value = "";
  document.getElementById("email").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("gender").value = "MALE"; // Set a default value
  document.getElementById("joinedDate").value = "";
  document.getElementById("dob").value = "";
  document.getElementById("roadNumber").value = "";
  document.getElementById("street").value = "";
  document.getElementById("city").value = "";
  document.getElementById("district").value = "";
  document.getElementById("province").value = "";
  document.getElementById("role").value = "OTHER"; // Set a default value

   
  document.getElementById("editStaffModalLabel").innerText = "Add Staff";
 
  const saveButton = document.querySelector(".update");
  saveButton.innerText = "Save";
  saveButton.setAttribute("onclick", "saveNewStaff()");
 
  // Show the modal
  const editStaffModal = new bootstrap.Modal(
    document.getElementById("editStaffModal")
  );
  editStaffModal.show();
}

function saveNewStaff() {
  const newStaff = {
    id: Date.now(), // Generate a unique ID for the new staff
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    contactNo: document.getElementById("contactNo").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
    province: document.getElementById("province").value,
    district: document.getElementById("district").value,
    city: document.getElementById("city").value,
    street: document.getElementById("street").value,
    roadNumber: document.getElementById("roadNumber").value,
    dob: document.getElementById("dob").value,
    joinedDate: document.getElementById("joinedDate").value,
    gender: document.getElementById("gender").value,
    designation: document.getElementById("designation").value,
  };

  // Add the new staff to the staff data array
  staffData.push(newStaff);
  alert("New staff added successfully!");

  // Refresh the staff table if necessary
  populateStaffTable();

  // Close the modal
  const editStaffModal = bootstrap.Modal.getInstance(
    document.getElementById("editStaffModal")
  );
  editStaffModal.hide();
}
function deleteStaff(id) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    staffData = staffData.filter((s) => s.id !== id);
    loadStaffTable();
  }
}
// Function to save changes

function viewStaff(id) {
  // Find the staff record by ID
  const staff = staffData.find((s) => s.id === id);

  if (staff) {
    // Populate the form with staff data
    document.getElementById("id").value = staff.id;
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("contactNo").value = staff.contactNo;
    document.getElementById("email").value = staff.email;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("gender").value = staff.gender;
    document.getElementById("joinedDate").value = staff.joinedDate;
    document.getElementById("dob").value = staff.dob;
    document.getElementById("roadNumber").value = staff.roadNumber;
    document.getElementById("street").value = staff.street;
    document.getElementById("city").value = staff.city;
    document.getElementById("district").value = staff.district;
    document.getElementById("province").value = staff.province;
    document.getElementById("role").value = staff.role;

    // Set all form fields to read-only
    setFormReadOnly(true);

    // Change the modal title
    document.getElementById("editStaffModalLabel").innerText = "View Staff";

    // Hide action buttons
    document.querySelector(".update").style.display = "none";

    // Show the modal
    const viewStaffModal = new bootstrap.Modal(document.getElementById("editStaffModal"));
    viewStaffModal.show();

  } else {
    alert("Staff not found!");
  }
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
  window.location.href = "/pagesstaff.html"; // Update with actual staff table page path
});

function resetForm() {
  document.getElementById("staffForm").reset();
  document.getElementById("actionButton").textContent = "Add";
  document.getElementById("actionButton").style.backgroundColor = "green";
  document.getElementById("staffForm").dataset.action = "add";
}
function setFormReadOnly(isReadOnly) {
  const formFields = document.querySelectorAll("#staffForm input, #staffForm select");
  formFields.forEach((field) => {
    if (isReadOnly) {
      field.setAttribute("readonly", true);
      field.setAttribute("disabled", true); // For dropdowns
    } else {
      field.removeAttribute("readonly");
      field.removeAttribute("disabled");
    }
  });
}

function resetFormFields() {
  document.getElementById("staffForm").reset(); // Reset form fields to default
}


