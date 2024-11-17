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
  loadVehicleTable(); // Initial table load
});

function loadVehicleTable() {
  const tbody = $("#vehicle-table-body");
  tbody.empty(); // Clear existing rows
  vehicleData.forEach((vehicle) => {
    tbody.append(`
      <tr>
        <td>${vehicle.vehicleCode}</td>
        <td>${vehicle.licensePlateNo}</td>
        <td>${vehicle.vehicleCategory}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.status}</td>
        <td class="action-icons">
          <i class="fas fa-edit me-3" onclick="editVehicle('${vehicle.vehicleCode}')"></i>
          <i class="fas fa-trash-alt me-3" onclick="deleteVehicle('${vehicle.vehicleCode}')"></i>
          <i class="fas fa-eye black-icon" onclick="viewVehicle('${vehicle.vehicleCode}')"></i>
        </td>
      </tr>
    `);
  });

  // Ensure the icons are styled after they are added to the DOM
  $(".action-icons i").css("color", "black");
}

function editVehicle(vehicleCode) {
  setFormReadOnly(false);
  $(".update").show();
  // Find the vehicle record by code
  const vehicle = vehicleData.find((v) => v.vehicleCode === vehicleCode);

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
    loadVehicleTable(); // Refresh the table
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
  loadVehicleTable();

  // Close the modal
  const editVehicleModal = bootstrap.Modal.getInstance($("#editVehicleModal"));
  editVehicleModal.hide();
}

function deleteVehicle(vehicleCode) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    vehicleData = vehicleData.filter((v) => v.vehicleCode !== vehicleCode);
    loadVehicleTable();
  }
}

function viewVehicle(vehicleCode) {
  // Find the vehicle record by code
  const vehicle = vehicleData.find((v) => v.vehicleCode === vehicleCode);

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
