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
  loadEquipmentTable();
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
