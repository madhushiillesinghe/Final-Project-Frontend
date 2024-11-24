let vehicleData = [
  {
    vehicleCode: "V001",
    licensePlateNo: "ABC1234",
    vehicleCategory: "Sedan",
    fuelType: "PETROL",
    status: "ACTIVE",
    remarks: "No issues",
    StaffId: "S001",
  },
  // Other vehicle records
];

$(document).ready(() => {
  renderVehicleCards(); // Initial table load
});
const vehicleContainer = $("#vehicle-container");
const vehicleModal = new bootstrap.Modal($("#editVehicleModal"));
const vehicleForm = $("#vehicle-form");

function renderVehicleCards() {
  vehicleContainer.empty();
  vehicleData.forEach((vehicle, index) => {
    const card = `
      <div class="col-md-3">
         <div class="vehicle-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete vehicle" onclick="deleteVehicle(${index})"></i>
          <i class="fas fa-user-circle text-dark " style="font-size: 40px;"></i> 
          <h5>${vehicle.vehicleCode}</h5>
          <p>${vehicle.licensePlateNo}</p>
          <p>${vehicle.vehicleCategory}</p>
          <p>${vehicle.fuelType}</p>
          <p>${vehicle.status}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" onclick="editVehicle(${index})"></i>        
            <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="viewVehicle(${index})">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    vehicleContainer.append(card);
  });
}

function searchVehicle() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const vehicleCards = document.querySelectorAll(".vehicle-card");

  vehicleCards.forEach((card) => {
    const vehicleCode = card.querySelector("h5").textContent.toLowerCase();
    const licensePlateNo = card.querySelector("p").textContent.toLowerCase();

    if (
      vehicleCode.includes(searchTerm) ||
      licensePlateNo.includes(searchTerm)
    ) {
      card.style.display = "block"; // Show the card if it matches
    } else {
      card.style.display = "none"; // Hide the card if it doesn't match
    }
  });
}

function editVehicle(index) {
  setFormReadOnly(false);
  $(".update").show();
  // Find the vehicle record by code
  const vehicle = vehicleData[index];

  if (vehicle) {
    // Populate the form with the vehicle data
    $("#vehicleCode").val(vehicle.vehicleCode);
    $("#licensePlateNo").val(vehicle.licensePlateNo);
    $("#vehicleCategory").val(vehicle.vehicleCategory);
    $("#fuelType").val(vehicle.fuelType);
    $("#status").val(vehicle.status);
    $("#remarks").val(vehicle.remarks);
    $("#StaffId").val(vehicle.StaffId);
    $("#editVehicleModalLabel").text("Edit Vehicle");
    $(".update").text("Update").attr("onclick", "saveVehicleChanges()");

    // Show the modal
    const editVehicleModal = new bootstrap.Modal($("#editVehicleModal"));
    editVehicleModal.show();
  } else {
    alert("Vehicle not found!");
  }
}

function saveVehicleChanges() {
  const updatedVehicle = {
    vehicleCode: $("#vehicleCode").val(),
    licensePlateNo: $("#licensePlateNo").val(),
    vehicleCategory: $("#vehicleCategory").val(),
    fuelType: $("#fuelType").val(),
    status: $("#status").val(),
    remarks: $("#remarks").val(),
    StaffId: $("#StaffId").val(),
  };

  // Update the vehicle data
  const index = vehicleData.findIndex(
    (v) => v.vehicleCode === updatedVehicle.vehicleCode
  );
  if (index !== -1) {
    vehicleData[index] = updatedVehicle;
    alert("Vehicle details updated successfully!");
    renderVehicleCards(); // Refresh the table
  }

  // Close the modal
  const editVehicleModal = bootstrap.Modal.getInstance($("#editVehicleModal"));
  editVehicleModal.hide();
}

function addVehicle() {
  resetFormFields();

  // Enable all fields for editing
  setFormReadOnly(false);
  $(".update").show();
  // Reset the form fields
  $("#vehicleCode").val("");
  $("#licensePlateNo").val("");
  $("#vehicleCategory").val("");
  $("#fuelType").val("PETROL");
  $("#status").val("ACTIVE");
  $("#remarks").val("");
  $("#StaffId").val("");
  $("#editVehicleModalLabel").text("Add Vehicle");
  $("#vehicleCode").val(`V${String(vehicleData.length + 1).padStart(3, "0")}`);

  $(".update").text("Save").attr("onclick", "saveNewVehicle()");

  // Show the modal for adding a new vehicle
  const editVehicleModal = new bootstrap.Modal($("#editVehicleModal"));
  editVehicleModal.show();
}

function saveNewVehicle() {
  const newVehicle = {
    vehicleCode: $("#vehicleCode").val(),
    licensePlateNo: $("#licensePlateNo").val(),
    vehicleCategory: $("#vehicleCategory").val(),
    fuelType: $("#fuelType").val(),
    status: $("#status").val(),
    remarks: $("#remarks").val(),
    StaffId: $("#StaffId").val(),
  };

  // Add the new vehicle to the vehicle data array
  vehicleData.push(newVehicle);
  alert("New vehicle added successfully!");

  // Refresh the vehicle table
  renderVehicleCards();

  // Close the modal
  const editVehicleModal = bootstrap.Modal.getInstance($("#editVehicleModal"));
  editVehicleModal.hide();
}

function deleteVehicle(index) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    vehicleData.splice(index);
    renderVehicleCards();
  }
}

function viewVehicle(index) {
  // Find the vehicle record by code
  const vehicle = vehicleData[index];

  if (vehicle) {
    // Populate the form with vehicle data
    $("#vehicleCode").val(vehicle.vehicleCode);
    $("#licensePlateNo").val(vehicle.licensePlateNo);
    $("#vehicleCategory").val(vehicle.vehicleCategory);
    $("#fuelType").val(vehicle.fuelType);
    $("#status").val(vehicle.status);
    $("#remarks").val(vehicle.remarks);
    $("#StaffId").val(vehicle.StaffId);

    // Set all form fields to read-only
    setFormReadOnly(true);

    // Change the modal title
    $("#editVehicleModalLabel").text("View Vehicle");

    // Hide action buttons
    $(".update").hide();

    // Show the modal
    const viewVehicleModal = new bootstrap.Modal($("#editVehicleModal"));
    viewVehicleModal.show();
  } else {
    alert("Vehicle not found!");
  }
}

function setFormReadOnly(isReadOnly) {
  const formFields = $("#vehicle-form input, #vehicle-form select");
  formFields.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
  });
}

function resetFormFields() {
  $("#vehicleForm")[0].reset(); // Reset form fields to default
}

function resetForm() {
  $("#vehicleForm")[0].reset();
  $("#actionButton").text("Add").css("background-color", "green");
  $("#vehicleForm").data("action", "add");
}
