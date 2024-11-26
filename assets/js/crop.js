// Initial Crop Data
let cropData = [
  {
    cropCode: "C001",
    commonName: "Wheat",
    scientificName: "Triticum aestivum",
    category: "Grain",
    season: "Winter",
    cropImage: "https://via.placeholder.com/100",
  },
];

// Load Crop Cards on Page Ready
$(document).ready(() => {
  renderCropCards();
});

// Crop Container
const cropContainer = $("#crop-container");

// Function to Render Crop Cards
function renderCropCards() {
  cropContainer.empty();
  cropData.forEach((crop, index) => {
    const card = `
        <div class="col-md-3">
         <div class="crop-card position-relative">
            <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete Crop" onclick="deleteCrop(${index})"></i>
            <img src="/assets/image/cropIcon.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
              <h5 class="crop-card-title">${crop.commonName}</h5>
              <p class="crop-card-text">
                <strong>code:</strong> ${crop.cropCode}<br />
                <strong>Scientific Name:</strong> ${crop.scientificName}<br />
                <strong>Season:</strong> ${crop.season}<br />
                <strong>Category:</strong> ${crop.category}<br />
              </p>
              <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" onclick="editCrop(${index})"></i>        
            <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="viewCrop(${index})">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
            </div>
          </div>
        </div>
      `;
    cropContainer.append(card);
  });
}

// Function to Add a New Crop
function addCrop() {
  resetFormCrops();
  setFormReadOnly(false);
  $("#saveCropBtn").show();
  $("#cropCode").val(`C${String(cropData.length + 1).padStart(3, "0")}`);
  $("#editCropModal .modal-title").text("Add Crop");
  $("#saveCropBtn").text("Save").attr("onclick", "saveNewCrop()");
  $("#editCropModal").modal("show");
}

// Function to Save a New Crop
function saveNewCrop() {
  const newCrop = getCropFormData();
  cropData.push(newCrop);
  alert("New crop added successfully!");
  renderCropCards();
  closeModal();
}

// Function to Edit a Crop
function editCrop(index) {
  const crop = cropData[index];
  if (crop) {
    populateForm(crop);
    setFormReadOnly(false);
    $("#editCropModal .modal-title").text("Edit Crop");
    $("#saveCropBtn")
      .text("Update")
      .attr("onclick", `saveCropChanges(${index})`);
    $("#editCropModal").modal("show");
  } else {
    alert("Crop not found!");
  }
}

// Function to Save Changes to a Crop
function saveCropChanges(index) {
  const updatedCrop = getCropFormData();
  cropData[index] = updatedCrop;
  alert("Crop updated successfully!");
  renderCropCards();
  closeModal();
}

// Function to Delete a Crop
function deleteCrop(index) {
  if (confirm("Are you sure you want to delete this crop?")) {
    cropData.splice(index, 1);
    renderCropCards();
  }
}

// Function to Search Crops
function searchCrop() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const cropCards = document.querySelectorAll(".crop-card");

  cropCards.forEach((card) => {
    const cropName = card.querySelector("h5").textContent.toLowerCase();
    const cropCode = card.querySelector("p").textContent.toLowerCase();

    if (cropName.includes(searchTerm) || cropCode.includes(searchTerm)) {
      card.style.display = "block"; // Show card
    } else {
      card.style.display = "none"; // Hide card
    }
  });
}
// Function to View a Crops
function viewCrop(index) {
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
  $("#cropCode").val(crop.cropCode);
  $("#commonName").val(crop.commonName);
  $("#scientificName").val(crop.scientificName);
  $("#cropCategory").val(crop.category);
  $("#cropSeason").val(crop.season);
  $("#cropImagePreview").attr("src", crop.cropImage);
}

// Function to Get Form Data
function getCropFormData() {
  const cropImage = $("#cropImage").prop("files")[0];

  return {
    cropCode: $("#cropCode").val(),
    commonName: $("#commonName").val(),
    scientificName: $("#scientificName").val(),
    category: $("#cropCategory").val(),
    season: $("#cropSeason").val(),
    cropImage: cropImage
      ? URL.createObjectURL(cropImage)
      : $("#cropImagePreview").attr("src"),
  };
}

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

// Preview Crop Image on Upload
$(document).on("change", "#cropImage", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    $("#cropImagePreview").attr("src", e.target.result);
  };
  reader.readAsDataURL(this.files[0]);
});
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
