// Staff data
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

// On document ready
$(document).ready(function () {
  loadStaffTable(); // Initial table load
});

// Function to load staff table
function loadStaffTable() {
  const $tbody = $("#staff-table-body");
  $tbody.empty(); // Clear existing rows
  $.each(staffData, function (index, staff) {
    $tbody.append(`
      <tr>
        <td>${staff.id}</td>
        <td>${staff.firstName} ${staff.lastName}</td>
        <td>${staff.street} ${staff.city} ${staff.district}</td>
        <td>${staff.role}</td>
        <td>${staff.contactNo}</td>
        <td>${staff.email}</td>
        <td class="action-icons">
          <i class="fas fa-edit me-3" onclick="editStaff(${staff.id})"></i>
          <i class="fas fa-trash-alt me-3" onclick="deleteStaff(${staff.id})"></i>
          <i class="fas fa-eye black-icon" onclick="viewStaff(${staff.id})"></i>
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
  $(".update").show();

  // Find the staff record by ID
  const staff = staffData.find((s) => s.id === id);

  if (staff) {
    // Populate the form with the staff data
    $("#id").val(staff.id);
    $("#firstName").val(staff.firstName);
    $("#lastName").val(staff.lastName);
    $("#contactNo").val(staff.contactNo);
    $("#email").val(staff.email);
    $("#designation").val(staff.designation);
    $("#gender").val(staff.gender);
    $("#joinedDate").val(staff.joinedDate);
    $("#dob").val(staff.dob);
    $("#roadNumber").val(staff.roadNumber);
    $("#street").val(staff.street);
    $("#city").val(staff.city);
    $("#district").val(staff.district);
    $("#province").val(staff.province);
    $("#role").val(staff.role);

    // Set modal title and button text
    $("#editStaffModalLabel").text("Edit Staff");
    $(".update").text("Update").off("click").on("click", saveStaffChanges);

    // Show the modal
    const editStaffModal = new bootstrap.Modal($("#editStaffModal")[0]);
    editStaffModal.show();
  } else {
    alert("Staff not found!");
  }
}

// Function to save updated staff changes
function saveStaffChanges() {
  const updatedStaff = {
    id: $("#id").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    role: $("#role").val(),
    province: $("#province").val(),
    district: $("#district").val(),
    city: $("#city").val(),
    street: $("#street").val(),
    roadNumber: $("#roadNumber").val(),
    dob: $("#dob").val(),
    joinedDate: $("#joinedDate").val(),
    gender: $("#gender").val(),
    designation: $("#designation").val(),
  };

  // Update the staff data
  const index = staffData.findIndex((s) => s.id == updatedStaff.id);
  if (index !== -1) {
    staffData[index] = updatedStaff;
    alert("Staff details updated successfully!");
    loadStaffTable(); // Refresh the table
  }

  // Close the modal
  const editStaffModal = bootstrap.Modal.getInstance($("#editStaffModal")[0]);
  editStaffModal.hide();
}

// Function to add new staff
function addStaff() {
  resetFormFields();
  setFormReadOnly(false);
  $(".update").show();

  const $fieldSelector = $("#fieldSelector");
  $fieldSelector.removeClass("d-none");

  const fields = [
    { id: 1, name: "Field 1" },
    { id: 2, name: "Field 2" },
    { id: 3, name: "Field 3" },
  ];

  $fieldSelector.empty().append("<option value=''>Select Field</option>");
  $.each(fields, function (index, field) {
    $fieldSelector.append(`<option value='${field.id}'>${field.name}</option>`);
  });

  // Clear all form fields
  $("#staffForm")[0].reset();
  $("#role").val("OTHER");
  $("#gender").val("MALE");

  $("#editStaffModalLabel").text("Add Staff");
  $(".update").text("Save").off("click").on("click", saveNewStaff);

  // Show the modal
  const editStaffModal = new bootstrap.Modal($("#editStaffModal")[0]);
  editStaffModal.show();
}

// Function to save new staff
function saveNewStaff() {
  const newStaff = {
    id: Date.now(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    role: $("#role").val(),
    province: $("#province").val(),
    district: $("#district").val(),
    city: $("#city").val(),
    street: $("#street").val(),
    roadNumber: $("#roadNumber").val(),
    dob: $("#dob").val(),
    joinedDate: $("#joinedDate").val(),
    gender: $("#gender").val(),
    designation: $("#designation").val(),
  };

  // Add the new staff to the staff data array
  staffData.push(newStaff);
  alert("New staff added successfully!");
  loadStaffTable(); // Refresh the table

  // Close the modal
  const editStaffModal = bootstrap.Modal.getInstance($("#editStaffModal")[0]);
  editStaffModal.hide();
}

// Function to delete staff
function deleteStaff(id) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    staffData = staffData.filter((s) => s.id !== id);
    loadStaffTable();
  }
}

// Function to view staff details
function viewStaff(id) {
  const staff = staffData.find((s) => s.id === id);
  if (staff) {
    // Populate the form with staff data
    $("#id").val(staff.id);
    $("#firstName").val(staff.firstName);
    $("#lastName").val(staff.lastName);
    $("#contactNo").val(staff.contactNo);
    $("#email").val(staff.email);
    $("#designation").val(staff.designation);
    $("#gender").val(staff.gender);
    $("#joinedDate").val(staff.joinedDate);
    $("#dob").val(staff.dob);
    $("#roadNumber").val(staff.roadNumber);
    $("#street").val(staff.street);
    $("#city").val(staff.city);
    $("#district").val(staff.district);
    $("#province").val(staff.province);
    $("#role").val(staff.role);

    // Set all form fields to read-only
    setFormReadOnly(true);
    $(".update").hide();

    // Set modal title
    $("#editStaffModalLabel").text("View Staff");

    // Show the modal
    const viewStaffModal = new bootstrap.Modal($("#editStaffModal")[0]);
    viewStaffModal.show();
  } else {
    alert("Staff not found!");
  }
}

// Function to reset form
function resetForm() {
  $("#staffForm")[0].reset();
  $("#actionButton").text("Add").css("background-color", "green");
  $("#staffForm").data("action", "add");
}

// Function to reset form fields
function resetFormFields() {
  $("#staffForm")[0].reset();
}

// Function to set form fields read-only
function setFormReadOnly(isReadOnly) {
  $("#staffForm input, #staffForm select").each(function () {
    $(this).prop("readonly", isReadOnly);
    $(this).prop("disabled", isReadOnly);
  });
}
