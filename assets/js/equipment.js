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

// Load equipment table on page ready
$(document).ready(() => {
  renderEquipemtCards()
});

function loadEquipmentTable() {
  const tbody = $("#equipment-table-body");
  tbody.empty(); // Clear existing rows

  equipmentData.forEach((equipment) => {
    tbody.append(`
        <tr>
          <td>${equipment.id}</td>
          <td>${equipment.name}</td>
          <td>${equipment.type}</td>
          <td>${equipment.status}</td>
          <td>${equipment.fieldCode}</td>
          <td>${equipment.staffId}</td>
          <td class="action-icons">
            <i class="fas fa-edit me-3" onclick="editEquipment('${equipment.id}')"></i>
            <i class="fas fa-trash-alt me-3" onclick="deleteEquipment('${equipment.id}')"></i>
            <i class="fas fa-eye black-icon" onclick="viewEquipment('${equipment.id}')"></i>
          </td>
        </tr>
      `);
  });
}

const equipmentContainer = $("#equipment-container");
const equipmentModal = new bootstrap.Modal($("#editEquipmentModal"));
const equipmentForm = $("#equipment-form");

// Load staff cards
function renderEquipemtCards() {
  equipmentContainer.empty();
  equipmentData.forEach((staff, index) => {
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

function editEquipment(id) {
  const equipment = equipmentData.find((e) => e.id === id);
  if (equipment) {
    populateForm(equipment);
    $("#editEquipmentModalLabel").text("Edit Equipment");
    $(".update")
      .text("Update")
      .attr("onclick", `saveEquipmentChanges('${id}')`);
    const editModal = new bootstrap.Modal($("#editEquipmentModal"));
    editModal.show();
  } else {
    alert("Equipment not found!");
  }
}

function saveEquipmentChanges(id) {
  const updatedEquipment = getFormData();
  const index = equipmentData.findIndex((e) => e.id === id);
  if (index !== -1) {
    equipmentData[index] = updatedEquipment;
    alert("Equipment updated successfully!");
    loadEquipmentTable();
    closeModal();
  }
}

function addEquipment() {
  resetFormFields();
  $("#editEquipmentModalLabel").text("Add Equipment");
  $(".update").text("Save").attr("onclick", "saveNewEquipment()");
  const addModal = new bootstrap.Modal($("#editEquipmentModal"));
  addModal.show();
}

function saveNewEquipment() {
  const newEquipment = getFormData();
  equipmentData.push(newEquipment);
  alert("New equipment added successfully!");
  loadEquipmentTable();
  closeModal();
}

function deleteEquipment(id) {
  if (confirm("Are you sure you want to delete this equipment?")) {
    equipmentData = equipmentData.filter((e) => e.id !== id);
    loadEquipmentTable();
    alert("Equipment deleted successfully!");
  }
}

function viewEquipment(id) {
  const equipment = equipmentData.find((e) => e.id === id);
  if (equipment) {
    populateForm(equipment);
    setFormReadOnly(true);
    $("#editEquipmentModalLabel").text("View Equipment");
    $(".update").hide();
    const viewModal = new bootstrap.Modal($("#editEquipmentModal"));
    viewModal.show();
  }
}

function getFormData() {
  return {
    id: $("#equipmentId").val(),
    name: $("#equipmentName").val(),
    type: $("#equipmentType").val(),
    status: $("#equipmentStatus").val(),
    fieldCode: $("#fieldCode").val(),
    staffId: $("#staffId").val(),
  };
}

function populateForm(equipment) {
  $("#equipmentId").val(equipment.id);
  $("#equipmentName").val(equipment.name);
  $("#equipmentType").val(equipment.type);
  $("#equipmentStatus").val(equipment.status);
  $("#fieldCode").val(equipment.fieldCode);
  $("#staffId").val(equipment.staffId);
}

function setFormReadOnly(isReadOnly) {
  const formFields = $("#equipment-form input, #equipment-form select");
  formFields.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
  });
}

function resetFormFields() {
  $("#equipment-form")[0].reset();
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance($("#editEquipmentModal"));
  modal.hide();
}
