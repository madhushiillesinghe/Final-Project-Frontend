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
  renderEquipemtCards();
});


const equipmentContainer = $("#equipment-container");
const equipmentModal = new bootstrap.Modal($("#editEquipmentModal"));
const equipmentForm = $("#equipment-form");

// Load staff cards
function renderEquipemtCards() {
  equipmentContainer.empty();
  equipmentData.forEach((equipment, index) => {
    const card = `
      <div class="col-md-3">
         <div class="equipment-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete equipment" onclick="deleteEquipment(${index})"></i>
        <img src="/assets/image/equipmenticon.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <h5>${equipment.name}</h5>
          <p>${equipment.id}</p>
          <p>${equipment.type}</p>
          <p>${equipment.status}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" onclick="editEquipment(${index})"></i>        
            <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="viewEquipment(${index})">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    equipmentContainer.append(card);
  });
}

function searchEquipment() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const equipmentCards = document.querySelectorAll(".equipment-card");

  equipmentCards.forEach((card) => {
    const equipmentName = card.querySelector("h5").textContent.toLowerCase();
    const equipmentid = card.querySelector("p").textContent.toLowerCase();

    if (
      equipmentName.includes(searchTerm) ||
      equipmentid.includes(searchTerm)
    ) {
      card.style.display = "block"; // Show the card if it matches
    } else {
      card.style.display = "none"; // Hide the card if it doesn't match
    }
  });
}

function editEquipment(index) {
  setFormReadOnly(false);
  $(".update").show();
  const equipment = equipmentData[index];
  if (equipment) {
    populateForm(equipment);
    $("#editEquipmentModalLabel").text("Edit Equipment");
    $(".update").text("Update").attr("onclick", `saveEquipmentChanges()`);
    const editModal = new bootstrap.Modal($("#editEquipmentModal"));
    editModal.show();
  } else {
    alert("Equipment not found!");
  }
}

function saveEquipmentChanges() {
  const updatedEquipment = getFormData();
  const index = equipmentData.findIndex((e) => e.id === updatedEquipment.id);
  if (index !== -1) {
    equipmentData[index] = updatedEquipment;
    alert("Equipment updated successfully!");
    renderEquipemtCards();
    closeModal();
  }
}

function addEquipment() {
  resetFormFields();
  $("#editEquipmentModalLabel").text("Add Equipment");
  $(".update").text("Save").attr("onclick", "saveNewEquipment()");
  $("#equipmentId").val(
    `E${String(equipmentData.length + 1).padStart(3, "0")}`
  );
  const addModal = new bootstrap.Modal($("#editEquipmentModal"));
  addModal.show();
}

function saveNewEquipment() {
  const newEquipment = getFormData();
  equipmentData.push(newEquipment);
  alert("New equipment added successfully!");
  renderEquipemtCards();
  closeModal();
}

function deleteEquipment(index) {
  if (confirm("Are you sure you want to delete this equipment?")) {
    equipmentData.splice(index, 1);
    renderEquipemtCards();
  }
}

function viewEquipment(index) {
  const equipment = equipmentData[index];
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
