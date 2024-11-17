let staffData = [
  {
    id: "S001",
    firstName: "John",
    lastName: "Doe",
    designation: "Scientist",
    gender: "MALE",
    roadNo: "362A",
    street: "123 Main St",
    city: "Colombo",
    district: "Colombo",
    province: "Western",
    contactNo: "0771234567",
    email: "john.doe@example.com",
    role: "SCIENTIST",
    field: "F04",
    joinedDate: "2022-01-01",
    dob: "1985-07-20",
  },
  // Add more sample data if needed...
];

$(document).ready(() => {
  loadStaffTable(); // Initial table load
});

function loadStaffTable() {
  const tbody = $("#staff-table-body");
  tbody.empty(); // Clear existing rows
  staffData.forEach((staff) => {
    tbody.append(`
      <tr>
        <td>${staff.id}</td>
        <td>${staff.firstName} ${staff.lastName}</td>
        <td>${staff.designation}</td>
        <td>${staff.role}</td>
        <td>${staff.contactNo}</td>
        <td>${staff.email}</td>
        <td class="action-icons">
          <i class="fas fa-edit me-3" onclick="editStaff('${staff.id}')"></i>
          <i class="fas fa-trash-alt me-3" onclick="deleteStaff('${staff.id}')"></i>
          <i class="fas fa-eye black-icon" onclick="viewStaff('${staff.id}')"></i>
        </td>
      </tr>
    `);
  });

  $(".action-icons i").css("color", "black");
}

function addStaff() {
  resetFormFields();
  setFormReadOnly(false);
  $(".update").show();
  $("#id").val(`S${String(staffData.length + 1).padStart(3, "0")}`);
  $("#editStaffModalLabel").text("Add Staff");
  $(".update").text("Save").attr("onclick", "saveNewStaff()");
  const addModal = new bootstrap.Modal($("#editStaffModal"));
  addModal.show();
}

function saveNewStaff() {
  const newStaff = collectFormData();
  staffData.push(newStaff);
  alert("New staff member added successfully!");
  loadStaffTable();
  const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
  modal.hide();
}

function editStaff(staffId) {
  setFormReadOnly(false);
  $(".update").show();
  const staff = staffData.find((s) => s.id === staffId);
  if (staff) {
    populateFormFields(staff);
    $("#editStaffModalLabel").text("Edit Staff");
    $(".update").text("Update").attr("onclick", "saveStaffChanges()");
    const editModal = new bootstrap.Modal($("#editStaffModal"));
    editModal.show();
  } else {
    alert("Staff not found!");
  }
}

function saveStaffChanges() {
  const updatedStaff = collectFormData();
  const index = staffData.findIndex((s) => s.id === updatedStaff.id);
  if (index !== -1) {
    staffData[index] = updatedStaff;
    alert("Staff details updated successfully!");
    loadStaffTable();
  }
  const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
  modal.hide();
}

function deleteStaff(staffId) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    staffData = staffData.filter((s) => s.id !== staffId);
    alert("Staff member deleted successfully!");
    loadStaffTable();
  }
}

function viewStaff(staffId) {
  const staff = staffData.find((s) => s.id === staffId);
  if (staff) {
    populateFormFields(staff);
    setFormReadOnly(true);
    $("#editStaffModalLabel").text("View Staff");
    $(".update").hide();
    const viewModal = new bootstrap.Modal($("#editStaffModal"));
    viewModal.show();
  } else {
    alert("Staff not found!");
  }
}

function collectFormData() {
  return {
    id: $("#id").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    designation: $("#designation").val(),
    gender: $("#gender").val(),
    roadNo: $("#roadNo").val(),
    street: $("#street").val(),
    city: $("#city").val(),
    district: $("#district").val(),
    province: $("#province").val(),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    role: $("#role").val(),
    field: $("#fieldSelector").val(),
    gender: $("#gender").val(),
    joinedDate: $("#joinedDate").val(),
    dob: $("#dob").val(),
  };
}

function populateFormFields(staff) {
  $("#id").val(staff.id);
  $("#firstName").val(staff.firstName);
  $("#lastName").val(staff.lastName);
  $("#designation").val(staff.designation);
  $("#gender").val(staff.gender);
  $("#roadNo").val(staff.roadNo);
  $("#street").val(staff.street);
  $("#city").val(staff.city);
  $("#district").val(staff.district);
  $("#province").val(staff.province);
  $("#contactNo").val(staff.contactNo);
  $("#email").val(staff.email);
  $("#role").val(staff.role);
  $("#fieldSelector").val(staff.field);
  $("#joinedDate").val(staff.joinedDate);
  $("#dob").val(staff.dob);
}

function setFormReadOnly(isReadOnly) {
  const formFields = $("#staffForm input, #staffForm select");
  formFields.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
  });
}

function resetFormFields() {
  $("#staffForm")[0].reset();
}
