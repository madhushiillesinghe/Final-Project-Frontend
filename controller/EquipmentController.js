import {
  getEquipmentData,
  addEquipmentData,
  updateEquipmentData,
  deleteEquipment,
  getFieldData,
  getStaffData,
} from "../model/EquipmentModel.js";

// Load equipment table on page ready
$(document).ready(() => {
  getFieldData();
  getStaffData();
  init();
});
async function init() {
  try {
    const equipmentData = await getEquipmentData(); // Wait for the data to be resolved
    console.log("Fetched Equipment  data:", equipmentData);
    renderEquipemtCards(equipmentData); // Pass the resolved data to renderStaffCards
    $("#search-bar").on("keyup", searchVehicle());
  } catch (error) {
    console.error("Error initializing Equipment data:", error);
  }
}
const equipmentContainer = $("#equipment-container");
const equipmentModal = new bootstrap.Modal($("#editEquipmentModal"));
const equipmentForm = $("#equipment-form");

// Load staff cards
function renderEquipemtCards(equipmentData) {
  equipmentContainer.empty();
  equipmentData.forEach((equipment, index) => {
    const card = `
      <div class="col-md-3">
         <div class="equipment-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4 delete-icon" title="Delete equipment" data-index="${index}"></i>
        <img src="/assets/image/equipmenticon.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <h5> ${equipment.name}</h5>
          <p> id : ${equipment.id}</p>
          <p> type : ${equipment.type}</p>
          <p> status : ${equipment.status}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" data-index="${index}"></i>        
            <button class="btn btn-success btn-sm text-white view-btn" title="Get Details" data-index="${index}">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    equipmentContainer.append(card);
  });
  equipmentContainer
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".equipment-card"); // Find the closest card element
      const equipmentCode = equipmentData[index].id; // Retrieve the staff ID

      if (confirm("Are you sure you want to delete this  equipment?")) {
        deleteEquipment(equipmentCode, cardElement, function (success) {
          if (success) {
            fetchAndUpdateData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to update the equipment. Please try again.");
          }
        }); // Pass the staff ID to deleteStaff
      }
    });

  // Event handling for edit
  equipmentContainer
    .off("click", ".fa-edit")
    .on("click", ".fa-edit", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".equipment-card");
      editEquipment(equipmentData, index, cardElement); // Call the edit handler with the staff index
    });
  // Event handling for view
  equipmentContainer
    .off("click", ".view-btn")
    .on("click", ".view-btn", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      viewEquipment(equipmentData, index); // Call the view handler with the staff index
    });
}
$("#search-bar").keyup(async function () {
  console.log("Searching for Equipment...");
  const equipmentData = await getEquipmentData();
  if (!Array.isArray(equipmentData)) {
    return;
  }
  const searchTerm = $("#search-bar").val().toLowerCase();

  const filteredEquipment = equipmentData.filter(
    (equipmentCard) =>
      `${equipmentCard.id}`.toLowerCase().includes(searchTerm) ||
      `${equipmentCard.name}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderEquipemtCards(filteredEquipment);
});

function editEquipment(equipmentData, index, cardElement) {
  setFormReadOnly(false);
  $(".update").show();
  const equipment = equipmentData[index];
  if (equipment) {
    populateForm(equipment);
    $("#editEquipmentModalLabel").text("Edit Equipment");
    $(".update")
      .text("Update")
      .on("click", function () {
        saveEquipmentChanges(index, cardElement, equipmentData);
      });
    const editModal = new bootstrap.Modal($("#editEquipmentModal"));
    editModal.show();
  } else {
    alert("Equipment not found!");
  }
}

function saveEquipmentChanges(index, cardElement, equipmentData) {
  const updatedEquipment = getFormData();
  const equipmentCode = updatedEquipment.id; // Ensure the ID is included in the updated data
  updateEquipmentData(equipmentCode, updatedEquipment, function (success) {
    if (success) {
      cardElement.find("h5").text(`${updatedEquipment.name}`);
      cardElement.find("p:contains('id ')").text(`id : ${updatedEquipment.id}`);
      cardElement
        .find("p:contains('type')")
        .text(`type: ${updatedEquipment.type}`);
      cardElement
        .find("p:contains('status')")
        .text(`status: ${updatedEquipment.status}`);

      populateForm(updatedEquipment);
      const editEquipmentModal = bootstrap.Modal.getInstance(
        $("#editEquipmentModal")
      );
      editEquipmentModal.hide();
      fetchAndUpdateData(); // Call the fetch function to reload the DOM
    } else {
      alert("Failed to update the Equipment. Please try again.");
    }
  });
}
$("#addbtn").click(async function () {
  resetFormFields();
  setFormReadOnly(false);

  const equipmentData = await getEquipmentData();
  if (!equipmentData || equipmentData.length === 0) {
    console.error("Equipment data is empty or undefined!");
    return;
  }
  const newId = `E${String(equipmentData.length + 1).padStart(3, "0")}`;
  console.log("Generated ID:", newId);
  $("#editEquipmentModalLabel").text("Add Equipment");

  $(".update").text("Save").on("click", saveNewEquipment);

  const addModal = new bootstrap.Modal($("#editEquipmentModal"));
  addModal.show();

  $("#editEquipmentModal").on("shown.bs.modal", function () {
    const equipmentInput = $("#equipmentId");
    if (equipmentInput.length) {
      equipmentInput.val(newId);
      console.log("ID successfully set in input field:", equipmentInput.val());
    } else {
      console.error("##equipmentId input field not found!");
    }
  });
});

function saveNewEquipment() {
  const newEquipment = getFormData();
  console.log(newEquipment, "new equipment");
  addEquipmentData(newEquipment, function (success) {
    if (success) {
      fetchAndUpdateData();
      closeModal();
    }
  });
}

function viewEquipment(equipmentData, index) {
  const equipment = equipmentData[index];
  if (equipment) {
    populateForm(equipment);
    setFormReadOnly(true);
    $("#editEquipmentModalLabel").text("View Equipment");
    $(".update").hide();
    const viewModal = new bootstrap.Modal($("#editEquipmentModal"));
    viewModal.show();
  } else {
    alert("Equipment not found!");
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

  if (!$("#staffId option[value='" + equipment.staffId + "']").length) {
    $("#staffId").append(
      `<option value="${equipment.staffId}">${equipment.staffId}</option>`
    );
  }
  $("#staffId").val(equipment.staffId).change();

  if (!$("#fieldCode option[value='" + equipment.fieldCode + "']").length) {
    $("#fieldCode").append(
      `<option value="${equipment.fieldCode}">${equipment.fieldCode}</option>`
    );
  }
  $("#staffId").val(equipment.staffId).change();

  if (!$("#equipmentStatus option[value='" + equipment.status + "']").length) {
    $("#equipmentStatus").append(
      `<option value="${equipment.status}">${equipment.status}</option>`
    );
  }
  $("#equipmentStatus").val(equipment.status).change();
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
function fetchAndUpdateData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/equipments/allequipment", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      renderEquipemtCards(data);
      console.log("Equipment data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
}
document.addEventListener("DOMContentLoaded", function () {
  fetch("topbar.html")
    .then((response) => response.text())
    .then((html) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      document.body.insertAdjacentElement("afterbegin", tempDiv);

      // After the top bar is loaded, initialize the date-time functionality
      updateDateTime();
      setInterval(updateDateTime, 1000); // Update every second
    })
    .catch((error) => console.error("Error loading topbar:", error));
});

function updateDateTime() {
  const dateTimeElement = document.getElementById("date-time");
  const now = new Date();

  const options = { weekday: "long" };
  const day = new Intl.DateTimeFormat("en-US", options).format(now);
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString();

  dateTimeElement.textContent = `${day}, ${date} ${time}`;
}
