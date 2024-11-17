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
               <i 
              class="fas fa-eye black-icon" 
              onclick="viewVehicle('${vehicle.vehicleCode}')"
          ></i>
            </td>
          </tr>
        `);
  });

  // Ensure the icons are styled after they are added to the DOM
  $(".action-icons i").css("color", "black");
}

function editVehicle(vehicleCode) {
  setFormReadOnly(false);
  document.querySelector(".update").style.display = "";
  // Find the vehicle record by code
  const vehicle = vehicleData.find((v) => v.vehicleCode === vehicleCode);

  if (vehicle) {
    // Populate the form with the vehicle data
    document.getElementById("vehicleCode").value = vehicle.vehicleCode;
    document.getElementById("licensePlateNo").value = vehicle.licensePlateNo;
    document.getElementById("vehicleCategory").value = vehicle.vehicleCategory;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("remarks").value = vehicle.remarks;
    document.getElementById("StaffId").value = vehicle.StaffId;
    document.getElementById("editVehicleModalLabel").innerText = "Edit Vehicle";
    const saveButton = document.querySelector(".update");
    saveButton.innerText = "Update";
    // Show the modal
    const editVehicleModal = new bootstrap.Modal(
      document.getElementById("editVehicleModal")
    );
    editVehicleModal.show();
  } else {
    alert("Vehicle not found!");
  }
}

function saveVehicleChanges() {
  const updatedVehicle = {
    vehicleCode: document.getElementById("vehicleCode").value,
    licensePlateNo: document.getElementById("licensePlateNo").value,
    vehicleCategory: document.getElementById("vehicleCategory").value,
    fuelType: document.getElementById("fuelType").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
    StaffId: document.getElementById("StaffId").value,
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
  const editVehicleModal = bootstrap.Modal.getInstance(
    document.getElementById("editVehicleModal")
  );
  editVehicleModal.hide();
}

function addVehicle() {
  resetFormFields();

  // Enable all fields for editing
  setFormReadOnly(false);
  document.querySelector(".update").style.display = "";
  // Reset the form fields
  document.getElementById("vehicleCode").value = "";
  document.getElementById("licensePlateNo").value = "";
  document.getElementById("vehicleCategory").value = "";
  document.getElementById("fuelType").value = "PETROL";
  document.getElementById("status").value = "ACTIVE";
  document.getElementById("remarks").value = "";
  document.getElementById("StaffId").value = "";
  document.getElementById("editVehicleModalLabel").innerText = "Add Vehicle";

  const saveButton = document.querySelector(".update");
  saveButton.innerText = "Save";
  saveButton.setAttribute("onclick", "saveNewVehicle()");
  // Show the modal for adding a new vehicle
  const editVehicleModal = new bootstrap.Modal(
    document.getElementById("editVehicleModal")
  );
  editVehicleModal.show();
}
function saveNewVehicle() {
  const newVehicle = {
    vehicleCode: document.getElementById("vehicleCode").value,
    licensePlateNo: document.getElementById("licensePlateNo").value,
    vehicleCategory: document.getElementById("vehicleCategory").value,
    fuelType: document.getElementById("fuelType").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
    StaffId: document.getElementById("StaffId").value,
  };

  // Add the new staff to the staff data array
  vehicleData.push(newVehicle);
  alert("New staff added successfully!");

  // Refresh the staff table if necessary

  // Close the modal
  const editVehicleModal = bootstrap.Modal.getInstance(
    document.getElementById("editStaffModal")
  );
  editVehicleModal.hide();
}
function deleteVehicle(vehicleCode) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    vehicleData = vehicleData.filter((v) => v.vehicleCode !== vehicleCode);
    loadVehicleTable();
  }
}
// Function to save changes

function viewVehicle(vehicleCode) {
  // Find the staff record by ID
  const vehicle = vehicleData.find((v) => v.vehicleCode === vehicleCode);

  if (vehicle) {
    // Populate the form with staff data
    document.getElementById("vehicleCode").value = vehicle.vehicleCode;
    document.getElementById("licensePlateNo").value = vehicle.licensePlateNo;
    document.getElementById("vehicleCategory").value = vehicle.vehicleCategory;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("status").value = vehicle.status;
    document.getElementById("remarks").value = vehicle.remarks;
    document.getElementById("StaffId").value = vehicle.StaffId;

    // Set all form fields to read-only
    setFormReadOnly(true);

    // Change the modal title
    document.getElementById("editVehicleModalLabel").innerText = "View Vehicle";

    // Hide action buttons
    document.querySelector(".update").style.display = "none";

    // Show the modal
    const viewVehicleModal = new bootstrap.Modal(
      document.getElementById("editVehicleModal")
    );
    viewVehicleModal.show();
  } else {
    alert("Vehicle not found!");
  }
}

document.getElementById("actionButton").addEventListener("click", function () {
  const action = document.getElementById("vehicleForm").dataset.action;

  const newdataVehicle = {
    vehicleCode: document.getElementById("vehicleCode").value,
    licensePlateNo: document.getElementById("licensePlateNo").value,
    vehicleCategory: document.getElementById("vehicleCategory").value,
    fuelType: document.getElementById("fuelType").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
    StaffId: document.getElementById("StaffId").value,
  };

  if (action === "edit") {
    // Update the staff data in the array
    const index = vehicleData.findIndex(
      (s) => s.vehicleCode == newdataVehicle.vehicleCode
    );
    if (index !== -1) {
      vehicleData[index] = newdataVehicle;
      alert("Vehicle details updated successfully!");
    }
  } else {
    // Add new staff
    vehicleData.push(newdataVehicle);
    alert("New vehicle added successfully!");
  }

  loadVehicleTable(); // Reload the table or other UI elements after update
  resetForm(); // Reset the form to clear out data after action
});

function setFormReadOnly(isReadOnly) {
  const formFields = document.querySelectorAll(
    "#vehicle-form input, #vehicle-form select"
  );
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
  document.getElementById("vehicleForm").reset(); // Reset form fields to default
}
function resetForm() {
  document.getElementById("vehicleForm").reset();
  document.getElementById("actionButton").textContent = "Add";
  document.getElementById("actionButton").style.backgroundColor = "green";
  document.getElementById("vehicleForm").dataset.action = "add";
}
