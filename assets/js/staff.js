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
];

$(document).ready(() => {
  renderStaffCards();
});

// function loadStaffTable() {
//   const tbody = $("#staff-table-body");
//   tbody.empty(); // Clear existing rows
//   staffData.forEach((staff) => {
//     tbody.append(`
//       <tr>
//         <td>${staff.id}</td>
//         <td>${staff.firstName} ${staff.lastName}</td>
//         <td>${staff.designation}</td>
//         <td>${staff.role}</td>
//         <td>${staff.contactNo}</td>
//         <td>${staff.email}</td>
//         <td class="action-icons">
//           <i class="fas fa-edit me-3" onclick="editStaff('${staff.id}')"></i>
//           <i class="fas fa-trash-alt me-3" onclick="deleteStaff('${staff.id}')"></i>
//           <i class="fas fa-eye black-icon" onclick="viewStaff('${staff.id}')"></i>
//         </td>
//       </tr>
//     `);
//   });

//   $(".action-icons i").css("color", "black");
// }

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
  renderStaffCards();
  const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
  modal.hide();
}

function editStaff(index) {
  setFormReadOnly(false);
  $(".update").show();
  const staff = staffData[index];
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
  const index = staffData.findIndex((s) => s.index === updatedStaff.index);
  if (index !== -1) {
    staffData[index] = updatedStaff;
    alert("Staff details updated successfully!");
    renderStaffCards();
  }
  const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
  modal.hide();
}

function deleteStaff(index) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    staffData.splice(index, 1);
    alert("Staff member deleted successfully!");
    renderStaffCards();
  }
}

function viewStaff(index) {
  const staff = staffData[index];
  if (staff) {
    populateFormFields(staff);
    setFormReadOnly(true);
    $("#editStaffModalLabel").text("View Staff");
    $(".update").hide();
    staffModal.show();
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

const staffContainer = $("#staff-container");
const staffModal = new bootstrap.Modal($("#editStaffModal"));
const staffForm = $("#staff-form");

// Load staff cards
function renderStaffCards() {
  staffContainer.empty();
  staffData.forEach((staff, index) => {
    const card = `
      <div class="col-md-3">
         <div class="staff-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete Staff" onclick="deleteStaff(${index})"></i>
    <i class="fas fa-user-circle text-dark " style="font-size: 40px;"></i> 
          <h5>${staff.firstName} ${staff.lastName}</h5>
          <p>${staff.designation}</p>
          <p>${staff.contactNo}</p>
          <p>${staff.email}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" onclick="editStaff(${index})"></i>        
            <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="viewStaff(${index})">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    staffContainer.append(card);
  });
}

function searchStaff() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const staffCards = document.querySelectorAll(".staff-card");

  staffCards.forEach((card) => {
    const staffName = card.querySelector("h5").textContent.toLowerCase();
    const staffDesignation = card.querySelector("p").textContent.toLowerCase();

    if (
      staffName.includes(searchTerm) ||
      staffDesignation.includes(searchTerm)
    ) {
      card.style.display = "block"; // Show the card if it matches
    } else {
      card.style.display = "none"; // Hide the card if it doesn't match
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  fetch("sidebar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Sidebar HTML not found");
      }
      return response.text();
    })
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      document.body.insertBefore(tempDiv, document.body.firstChild); // Insert as the first child of body
    })
    .catch((error) => console.error("Error loading sidebar:", error));
});