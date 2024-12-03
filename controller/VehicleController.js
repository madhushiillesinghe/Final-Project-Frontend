import {
  getVehicleData,
  addVehicleData,
  updateVehicleData,
  deleteVehicle,
  getStaffData,
} from "../model/VehicleModel.js";
async function init() {
  try {
    const vehicleData = await getVehicleData(); // Wait for the data to be resolved
    console.log("Fetched vehicle  data:", vehicleData);
    console.log(vehicleData.staffId, "id is");

    renderVehicleCards(vehicleData); // Pass the resolved data to renderStaffCards
    // Event listeners for actions
    $("#search-bar").on("keyup", searchVehicle());
  } catch (error) {
    console.error("Error initializing vehicle data:", error);
  }
}
$(document).ready(() => {
  getStaffData();
  init();
});
const vehicleContainer = $("#vehicle-container");
const vehicleModal = new bootstrap.Modal($("#editVehicleModal"));
const vehicleForm = $("#vehicle-form");

function renderVehicleCards(vehicleData) {
  vehicleContainer.empty();
  vehicleData.forEach((vehicle, index) => {
    const card = `
      <div class="col-md-3">
         <div class="vehicle-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4 delete-icon" title="Delete vehicle" data-index="${index}"></i>
        <img src="/assets/image/vehicleicon.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <h5>${vehicle.vehicleCode}</h5>
          <p> plate no : ${vehicle.licensePlateNo}</p>
          <p> category : ${vehicle.vehicleCategory}</p>
          <p> fuel Type: ${vehicle.fuelType}</p>
          <p>  status  :${vehicle.status}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" data-index="${index}"></i>        
            <button class="btn btn-success btn-sm text-white view-btn" title="Get Details" data-index="${index}">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    vehicleContainer.append(card);
  });
  vehicleContainer
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".vehicle-card"); // Find the closest card element
      const vehicleCode = vehicleData[index].vehicleCode; // Retrieve the staff ID

      if (confirm("Are you sure you want to delete this  vehicle?")) {
        deleteVehicle(vehicleCode, cardElement, function (success) {
          if (success) {
            fetchAndUpdateData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to update the vehicle. Please try again.");
          }
        }); // Pass the staff ID to deleteStaff
      }
    });

  // Event handling for edit
  vehicleContainer
    .off("click", ".fa-edit")
    .on("click", ".fa-edit", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".vehicle-card");
      editVehicle(vehicleData, index, cardElement); // Call the edit handler with the staff index
    });
  // Event handling for view
  vehicleContainer
    .off("click", ".view-btn")
    .on("click", ".view-btn", function () {
      console.log(vehicleData.staffId, "staff id");
      const index = $(this).data("index"); // Get the index from the data attribute
      viewVehicle(vehicleData, index); // Call the view handler with the staff index
    });
}

$("#search-bar").keyup(async function () {
  console.log("Searching for Vehicle...");
  const vehicle = await getVehicleData();
  if (!Array.isArray(vehicle)) {
    return; // Exit the function if the data is not an array
  }
  const searchTerm = $("#search-bar").val().toLowerCase();

  const filteredVehicle = vehicle.filter(
    (vehicleCard) =>
      `${vehicleCard.vehicleCode}`.toLowerCase().includes(searchTerm) ||
      `${vehicleCard.licensePlateNo}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderVehicleCards(filteredVehicle);
});
function editVehicle(vehicleData, index, cardElement) {
  setFormReadOnly(false);
  $(".update").show();
  // Find the vehicle record by code
  const vehicle = vehicleData[index];

  if (vehicle) {
    console.log(vehicle, "vehicle data is ");
    // Populate the form with the vehicle data
    $("#vehicleCode").val(vehicle.vehicleCode);
    $("#licensePlateNo").val(vehicle.licensePlateNo);
    $("#vehicleCategory").val(vehicle.vehicleCategory);
    $("#fuelType").val(vehicle.fuelType);
    $("#status").val(vehicle.status);
    $("#remarks").val(vehicle.remarks);
    $("#staffId").val(vehicle.staffId);
    if (!$("#fuelType option[value='" + vehicle.fuelType + "']").length) {
      $("#fuelType").append(
        `<option value="${vehicle.fuelType}">${vehicle.fuelType}</option>`
      );
    }
    $("#fuelType").val(vehicle.fuelType).change();

    // Ensure the status exists in the dropdown
    if (!$("#status option[value='" + vehicle.status + "']").length) {
      $("#status").append(
        `<option value="${vehicle.status}">${vehicle.status}</option>`
      );
    }
    $("#staffId").val(vehicle.staffId).change();
    if (!$("#staffId option[value='" + vehicle.staffId + "']").length) {
      $("#staffId").append(
        `<option value="${vehicle.staffId}">${vehicle.staffId}</option>`
      );
    }
    $("#staffId").val(vehicle.staffId).change();

    $("#editVehicleModalLabel").text("Edit Vehicle");
    $(".update")
      .text("Update")
      .data("index", index)
      .on("click", function () {
        saveVehicleChanges(index, cardElement, vehicleData);
      });

    // Show the modal
    const editVehicleModal = new bootstrap.Modal($("#editVehicleModal"));
    editVehicleModal.show();
  } else {
    alert("Vehicle not found!");
  }
}

function saveVehicleChanges(index, cardElement, vehicleData) {
  const updatedVehicle = {
    vehicleCode: $("#vehicleCode").val(),
    licensePlateNo: $("#licensePlateNo").val(),
    vehicleCategory: $("#vehicleCategory").val(),
    fuelType: $("#fuelType").val(),
    status: $("#status").val(),
    remarks: $("#remarks").val(),
    staffId: $("#staffId").val(),
  };
  const vehicleCode = updatedVehicle.vehicleCode; // Ensure the ID is included in the updated data

  updateVehicleData(vehicleCode, updatedVehicle, function (success) {
    if (success) {
      // Dynamically update the relevant card with the updated data
      cardElement.find("h5").text(`${updatedVehicle.vehicleCode}`);
      cardElement
        .find("p:contains('plate no')")
        .text(`plate no: ${updatedVehicle.licensePlateNo}`);
      cardElement
        .find("p:contains('category')")
        .text(`category: ${updatedVehicle.vehicleCategory}`);
      cardElement
        .find("p:contains('fuelType')")
        .text(`fuelType: ${updatedVehicle.fuelType}`);
      cardElement
        .find("p:contains(' status')")
        .text(` status: ${updatedVehicle.status}`);

      $("#vehicleCode").val(updatedVehicle.vehicleCode);
      $("#licensePlateNo").val(updatedVehicle.licensePlateNo);
      $("#vehicleCategory").val(updatedVehicle.vehicleCategory);
      $("#remarks").val(updatedVehicle.remarks);
      // Ensure the fuelType exists in the dropdown
      if (
        !$("#fuelType option[value='" + updatedVehicle.fuelType + "']").length
      ) {
        $("#fuelType").append(
          `<option value="${updatedVehicle.fuelType}">${updatedVehicle.fuelType}</option>`
        );
      }
      $("#fuelType").val(updatedVehicle.fuelType).change();

      // Ensure the status exists in the dropdown
      if (!$("#status option[value='" + updatedVehicle.status + "']").length) {
        $("#status").append(
          `<option value="${updatedVehicle.status}">${updatedVehicle.status}</option>`
        );
      }
      $("#staffId").val(updatedVehicle.staffId).change();
      if (
        !$("#staffId option[value='" + updatedVehicle.staffId + "']").length
      ) {
        $("#staffId").append(
          `<option value="${updatedVehicle.staffId}">${updatedVehicle.staffId}</option>`
        );
      }
      $("#staffId").val(updatedVehicle.staffId).change();

      // Close the modal
      const editVehicleModal = bootstrap.Modal.getInstance(
        $("#editVehicleModal")
      );
      editVehicleModal.hide();
      fetchAndUpdateData(); // Call the fetch function to reload the DOM
    } else {
      alert("Failed to update the vehicle. Please try again.");
    }
  });
}

$("#addbtn").click(async function () {
  resetFormFields();
  setFormReadOnly(false);

  const vehicleData = await getVehicleData();

  if (!vehicleData || vehicleData.length === 0) {
    console.error("Vehicle data is empty or undefined!");
    return; // Early exit if there's an issue with the data
  }
  const newId = `V${String(vehicleData.length + 1).padStart(3, "0")}`;
  console.log("Generated ID:", newId);
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

  $(".update").text("Save").on("click", saveNewVehicle);

  // Show the modal for adding a new vehicle
  const editVehicleModal = new bootstrap.Modal($("#editVehicleModal"));
  editVehicleModal.show();

  $("#editVehicleModal").on("shown.bs.modal", function () {
    const vehicleInput = $("#vehicleCode");
    if (vehicleInput.length) {
      vehicleInput.val(newId);
      console.log("ID successfully set in input field:", vehicleInput.val());
    } else {
      console.error("#id input field not found!");
    }
  });
});

function saveNewVehicle() {
  const newVehicle = {
    vehicleCode: $("#vehicleCode").val(),
    licensePlateNo: $("#licensePlateNo").val(),
    vehicleCategory: $("#vehicleCategory").val(),
    fuelType: $("#fuelType").val(),
    status: $("#status").val(),
    remarks: $("#remarks").val(),
    staffId: $("#staffId").val(),
  };
  console.log($("#staffId").val(), "staff id");
  console.log(newVehicle, "new vehicle");
  addVehicleData(newVehicle, function (success) {
    if (success) {
      fetchAndUpdateData();
      const editVehicleModal = bootstrap.Modal.getInstance(
        $("#editVehicleModal")
      );
      editVehicleModal.hide();
    }
  });
}

function viewVehicle(vehicleData, index) {
  // Find the vehicle record by code
  const vehicle = vehicleData[index];
  if (vehicle) {
    // Populate the form with vehicle data
    $("#vehicleCode").val(vehicle.vehicleCode);
    $("#licensePlateNo").val(vehicle.licensePlateNo);
    $("#vehicleCategory").val(vehicle.vehicleCategory);
    $("#remarks").val(vehicle.remarks);
    // Ensure the fuelType exists in the dropdown
    if (!$("#fuelType option[value='" + vehicle.fuelType + "']").length) {
      $("#fuelType").append(
        `<option value="${vehicle.fuelType}">${vehicle.fuelType}</option>`
      );
    }
    $("#fuelType").val(vehicle.fuelType).change();

    // Ensure the status exists in the dropdown
    if (!$("#status option[value='" + vehicle.status + "']").length) {
      $("#status").append(
        `<option value="${vehicle.status}">${vehicle.status}</option>`
      );
    }
    $("#status").val(vehicle.status).change();
    if (!$("#staffId option[value='" + vehicle.staffId + "']").length) {
      $("#staffId").append(
        `<option value="${vehicle.staffId}">${vehicle.staffId}</option>`
      );
    }
    $("#staffId").val(vehicle.staffId).change();

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
    url: "http://localhost:8080/agriculture/api/v1/vehicles/allvehicles", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (data) {
      renderVehicleCards(data);
      console.log("Vehicle data:", data);
    },
    error: function (xhr, status, error) {
      console.error("There was an error with the AJAX request:", error);
    },
  });
}
