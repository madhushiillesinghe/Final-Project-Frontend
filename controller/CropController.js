import {
  getCropData,
  addCropData,
  updateCrop,
  deleteCrop,
} from "../model/CropModel.js";
$(document).ready(() => {
  init();
});
async function init() {
  try {
    const cropData = await getCropData(); // Wait for the data to be resolved
    console.log("Fetched crop data:", cropData);

    renderCropCards(cropData); // Pass the resolved data to renderStaffCards

    // Event listeners for actions
    $("#search-bar").on("keyup", handleSearch);
  } catch (error) {
    console.error("Error initializing crop data:", error);
  }
}
// Crop Container
const cropContainer = $("#crop-container");

// Function to Render Crop Cards
function renderCropCards(cropData) {
  console.log(cropData, "cropdata");
  cropContainer.empty();
  cropData.forEach((crop, index) => {
    const card = `
        <div class="col-md-3">
         <div class="crop-card position-relative">
            <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4 delete-icon" title="Delete Crop" data-index="${index}"></i>
            <img src="/assets/image/cropIcon.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
              <h5 class="crop-card-title">${crop.commonName}</h5>
              <p class="crop-card-text">
                <strong>code:</strong> ${crop.code}<br />
                <strong>Scientific Name:</strong> ${crop.scientificName}<br />
                <strong>Season:</strong> ${crop.season}<br />
                <strong>Category:</strong> ${crop.category}<br />
              </p>
              <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" data-index="${index}"></i>        
            <button class="btn btn-success btn-sm text-white view-btn" title="Get Details" data-index="${index}">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
            </div>
          </div>
        </div>
      `;
    cropContainer.append(card);
  });

  cropContainer
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".crop-card"); // Find the closest card element
      console.log(index, "crop index in delete crop");
      const cropCode = cropData[index].code; // Retrieve the staff ID
      console.log(cropData, "cropData in Controller");
      console.log(cropCode, "crop Code");

      if (confirm("Are you sure you want to delete this Crop?")) {
        deleteCrop(cropCode, cardElement, function (success) {
          if (success) {
            fetchAndUpdateCropData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to update the field. Please try again.");
          }
        }); // Pass the staff ID to deleteStaff
      }
    });

  // Event handling for edit
  cropContainer.off("click", ".fa-edit").on("click", ".fa-edit", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    const cardElement = $(this).closest(".crop-card"); // Find the closest card element
    editCrop(cropData, index, cardElement); // Call the edit handler with the staff index
  });
  // Event handling for view
  cropContainer.off("click", ".view-btn").on("click", ".view-btn", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    viewCrop(cropData, index); // Call the view handler with the staff index
  });
}
$("#addCropBtn").click(async function () {
  setFormReadOnly(false);
  console.log("Clicked add button");

  const cropData = await getCropData();
  if (!cropData || cropData.length === 0) {
    console.error("crop data is empty or undefined!");
    return;
  }
  const newId = `C${String(cropData.length + 1).padStart(3, "0")}`;
  console.log("Generated ID:", newId);

  $("#editCropModal .modal-title").text("Add Crop");
  resetFormCrops();

  $("#saveCropBtn").show();
  $("#saveCropBtn").text("Save").on("click", saveNewCrop);
  $("#editCropModal").modal("show");

  $("#editCropModal").on("shown.bs.modal", function () {
    const cropInput = $("#cropCode");
    if (cropInput.length) {
      cropInput.val(newId);
      console.log("ID successfully set in input crop:", cropInput.val());
    } else {
      console.error("#id input crop not found!");
    }
  });
});

// Function to Save a New Crop
function saveNewCrop() {
  const newCrop = getCropFormData();
  if (!newCrop.cropImage) {
    alert("Please upload  image before saving.");
    return;
  }
  addCropData(newCrop, function (success) {
    if (success) {
      fetchAndUpdateCropData(); // Update the UI with the latest data
      alert("New crop added successfully!");

      closeModal();
    }
  });
}

// Function to Edit a Crop
function editCrop(cropData, index, cardElement) {
  setFormReadOnly(false);
  $("#saveCropBtn").show();
  const crop = cropData[index];
  if (crop) {
    populateForm(crop);
    $("#editCropModal .modal-title").text("Edit Crop");
    $("#saveCropBtn")
      .text("Update")
      .on("click", function () {
        saveCropChanges(index, cardElement, cropData);
      });
    $("#editCropModal").modal("show");
  } else {
    alert("Crop not found!");
  }
}

// Function to Save Changes to a Crop
function saveCropChanges(index, cardElement, cropData) {
  const updatedCrop = getCropFormData();
  cropData[index] = updatedCrop;
  const cropCode = updateCrop.code;
  console.log(updatedCrop.code, "crop code");
  updateCrop(updatedCrop.code, updatedCrop, function (success) {
    if (success) {
      // Dynamically update the relevant card with the updated data
      cardElement.find("h5").text(`${updatedCrop.commonName}`);
      cardElement.find("p:contains('code')").text(`code: ${updatedCrop.code}`);
      cardElement
        .find("p:contains('Scientific Name')")
        .text(`Scientific Name: ${updatedCrop.scientificName}`);
      cardElement
        .find("p:contains('Season')")
        .text(`Season: ${updatedCrop.season}`);
      cardElement
        .find("p:contains('Category')")
        .text(`Category: ${updatedCrop.category}`);
      populateForm(updatedCrop);
      alert("Crop updated successfully!");
      closeModal();

      fetchAndUpdateCropData(); // Call the fetch function to reload the DOM
    } else {
      alert("Failed to update the crop. Please try again.");
    }
  });
}
$("#search-bar").keyup(async function () {
  console.log("Searching for crop...");
  const crop = await getCropData();
  // Ensure that staff is an array
  if (!Array.isArray(crop)) {
    console.error("getCropData() did not return an array.");
    return; // Exit the function if the data is not an array
  }

  const searchTerm = $("#search-bar").val().toLowerCase();

  // Filter staff based on first name, last name, or ID
  const filteredCrop = crop.filter(
    (cropcard) =>
      `${cropcard.code} `.toLowerCase().includes(searchTerm) ||
      `${cropcard.commonName}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderCropCards(filteredCrop);
});
// Function to Search Crops

// Function to View a Crops
function viewCrop(cropData, index) {
  const crop = cropData[index];
  if (crop) {
    populateForm(crop);
    setFormReadOnly(true);
    $("#editCropModalLabel").text("View Crop");
    $("#saveCropBtn").hide();
    const viewModal = new bootstrap.Modal($("#editCropModal"));
    viewModal.show();
  }
}
// Function to Populate Form Fields
function populateForm(crop) {
  $("#cropCode").val(crop.code);
  $("#commonName").val(crop.commonName);
  $("#scientificName").val(crop.scientificName);
  $("#cropCategory").val(crop.category);
  $("#cropSeason").val(crop.season);
  $("#fieldSelector").val(crop.fieldCode);
  $("#cropImagePreview").attr("src", crop.cropImage);
}

// Function to Get Form Data
function getCropFormData() {
  const cropImage = $("#cropImage").prop("files")[0];

  return {
    code: $("#cropCode").val(),
    commonName: $("#commonName").val(),
    scientificName: $("#scientificName").val(),
    category: $("#cropCategory").val(),
    season: $("#cropSeason").val(),
    fieldCode: $("#fieldSelector").val(),
    cropImage: cropImage,
  };
}
$(document).on("change", "#cropImage", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    $("#cropImagePreview").attr("src", e.target.result);
  };
  reader.readAsDataURL(this.files[0]);
});
// Helper Function: Reset Form Fields
function resetFormCrops() {
  $("#crop-form")[0].reset();
  $("#cropImagePreview").attr("src", "");
}

// Helper Function: Set Form Read-Only State
function setFormReadOnly(isReadOnly) {
  const formFields = $("#crop-form input, #crop-form select");
  formFields.each(function () {
    $(this).prop("readonly", isReadOnly).prop("disabled", isReadOnly);
  });
}
// Helper Function: Close Modal
function closeModal() {
  $("#editCropModal").modal("hide");
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
function fetchAndUpdateCropData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/crops/allcrops", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (cropData) {
      // Call the renderStaffCards function to refresh the DOM with the latest data
      renderCropCards(cropData);

      console.log("Crop data refreshed successfully.");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching crop data:", error);
    },
  });
}
