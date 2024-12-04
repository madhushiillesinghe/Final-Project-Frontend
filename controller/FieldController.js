import {
  getFieldData,
  addFieldData,
  updateField,
  deleteField,
} from "../model/FieldModel.js";
// Load Field Table on Page Ready
$(document).ready(() => {
  init();
});

async function init() {
  try {
    const fieldData = await getFieldData(); // Wait for the data to be resolved
    console.log("Fetched field data:", fieldData);

    renderFieldCards(fieldData); // Pass the resolved data to renderStaffCards

    // Event listeners for actions
    $("#search-bar").on("keyup", handleSearch);
  } catch (error) {
    console.error("Error initializing Field data:", error);
  }
}
const fieldContainer = $("#field-container");
const fieldModal = new bootstrap.Modal($("#editFieldModal"));
const fieldForm = $("#field-form-section");

// Load Field cards
function renderFieldCards(fieldData) {
  fieldContainer.empty();
  fieldData.forEach((field, index) => {
    const card = `
      <div class="col-md-3">
         <div class="field-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4 delete-icon" title="Delete Field" data-index="${index}"></i>
        <img src="/assets/image/field.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <h5>${field.fieldName}</h5>
          <p>code :${field.fieldCode}</p>
          <p> Location:${field.fieldLocation}</p>
          <p>extend size :${field.extentSize}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" data-index="${index}"></i>        
            <button class="btn btn-success btn-sm text-white view-btn" title="Get Details" data-index="${index}">
                View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    fieldContainer.append(card);
  });
  fieldContainer
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".field-card"); // Find the closest card element
      console.log(index, "field index in delete field");
      const fieldCode = fieldData[index].fieldCode; // Retrieve the staff ID
      console.log(fieldData, "Field Data in Controller");
      console.log(fieldCode, "Field Code");

      if (confirm("Are you sure you want to delete this Field?")) {
        deleteField(fieldCode, cardElement, function (success) {
          if (success) {
            fetchAndUpdateFieldData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to update the field. Please try again.");
          }
        }); // Pass the staff ID to deleteStaff
      }
    });

  // Event handling for edit
  fieldContainer.off("click", ".fa-edit").on("click", ".fa-edit", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    const cardElement = $(this).closest(".field-card"); // Find the closest card element
    editfield(fieldData, index, cardElement); // Call the edit handler with the staff index
  });
  // Event handling for view
  fieldContainer
    .off("click", ".view-btn")
    .on("click", ".view-btn", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      viewField(fieldData, index); // Call the view handler with the staff index
    });
}

$("#search-bar").keyup(async function () {
  console.log("Searching for field...");
  const field = await getFieldData();
  // Ensure that staff is an array
  if (!Array.isArray(field)) {
    console.error("getFieldData() did not return an array.");
    return; // Exit the function if the data is not an array
  }

  const searchTerm = $("#search-bar").val().toLowerCase();

  // Filter staff based on first name, last name, or ID
  const filteredField = field.filter(
    (fieldcard) =>
      `${fieldcard.fieldCode} `.toLowerCase().includes(searchTerm) ||
      `${fieldcard.extentSize} `.toLowerCase().includes(searchTerm) ||
      `${fieldcard.fieldNamed}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderFieldCards(filteredField);
});
// Function to Add a New Field
$("#addbtn").click(async function () {
  setFormReadOnly(false);
  console.log("Clicked add button");
  const fieldData = await getFieldData(); // Wait for the data to be resolved

  if (!fieldData || fieldData.length === 0) {
    console.error("field data is empty or undefined!");
    return; // Early exit if there's an issue with the data
  }

  // Generate a new ID based on the number of existing staff
  const newId = `F${String(fieldData.length + 1).padStart(2, "0")}`;
  console.log("Generated ID:", newId);

  // Reset the form and prepare it for adding new staff
  $("#editFieldModalLabel").text("Add Field"); // Set modal title
  resetFormFields();
  $(".update")
    .show()
    .text("Save")
    .off("click") // Remove any previous click handlers
    .on("click", saveNewField); // Attach the saveNewStaff handler
  $("#fieldForm input, #fieldForm select, #fieldForm textarea").prop(
    "readonly",
    false
  );

  // Show the modal
  const modal = new bootstrap.Modal($("#editFieldModal")[0]); // Pass the DOM element instead of jQuery object
  modal.show();

  $("#editFieldModal").on("shown.bs.modal", function () {
    const fieldInput = $("#fieldCode");
    if (fieldInput.length) {
      fieldInput.val(newId);
      console.log("ID successfully set in input field:", fieldInput.val());
    } else {
      console.error("#id input field not found!");
    }
  });

  // Set the staff ID once the modal content is fully rendered
});

// Function to Save a New Field
function saveNewField() {
  const newField = getFieldFormData(); // Collect the form data
  console.log("New Field Data:", newField);

  if (!newField.fieldImage1 || !newField.fieldImage2) {
    alert("Please upload both images before saving.");
    return;
  }

  // Call the function to send data to the server
  addFieldData(newField, function (success) {
    if (success) {
      fetchAndUpdateFieldData(); // Update the UI with the latest data
      alert("Field added successfully!");

      // Close the modal
      const modal = bootstrap.Modal.getInstance($("#editFieldModal")[0]);
      modal.hide();
    }
  });
}

// Function to Edit a Field
function editfield(fieldData, index, cardElement) {
  setFormReadOnly(false);
  $(".update").show();

  const field = fieldData[index];
  if (field) {
    populateForm(field);
    $("#editFieldModalLabel").text("Edit Field");
    $(".update")
      .text("Update")
      .on("click", function () {
        saveFieldChanges(index, cardElement, fieldData);
      });
    const editModal = new bootstrap.Modal($("#editFieldModal"));
    editModal.show();
  } else {
    alert("Field not found!");
  }
}

// Function to Save Changes to a Field
function saveFieldChanges(index, cardElement, field) {
  const updatedField = getFieldFormData();
  console.log(updatedField.fieldImage1, "field image is");
  const fieldCode = updatedField.fieldCode;
  updateField(fieldCode, updatedField, function (success) {
    if (success) {
      // Dynamically update the relevant card with the updated data
      cardElement.find("h5").text(`${updatedField.fieldName}`);
      cardElement
        .find("p:contains('code ')")
        .text(`Designation: ${updatedField.fieldCode}`);
      cardElement
        .find("p:contains('Location')")
        .text(`Location: ${updatedField.fieldLocation}`);
      cardElement
        .find("p:contains('extend size')")
        .text(`extend size: ${updatedField.extentSize}`);
      populateForm(updatedField);
      alert("Field updated successfully!");

      // Close the modal
      const modal = bootstrap.Modal.getInstance($("#editFieldModal")[0]);
      modal.hide();
      fetchAndUpdateFieldData(); // Call the fetch function to reload the DOM
    } else {
      alert("Failed to update the field. Please try again.");
    }
  });
}

// Function to View a Field
function viewField(fieldData, index) {
  const field = fieldData[index];
  if (field) {
    populateForm(field);
    setFormReadOnly(true);
    $("#editFieldModalLabel").text("View Field");
    $(".update").hide();
    const viewModal = new bootstrap.Modal($("#editFieldModal"));
    viewModal.show();
  }
}

function populateForm(field) {
  $("#fieldCode").val(field.fieldCode);
  $("#fieldName").val(field.fieldName);
  $("#fieldLocation").val(field.fieldLocation);
  $("#extentSize").val(field.extentSize);
  $("#fieldImage1").val("");
  $("#fieldImage2").val("");
  // Set image previews using the database image URLs
  if (field.fieldImage1) {
    // If stored as a URL or file path

    $("#fieldImage1Preview")
      .attr("src", `data:image/jpeg;base64,${field.fieldImage1}`)
      .show();
  } else {
    $("#fieldImage1Preview").attr("src", "").hide(); // Hide preview if no image
  }

  if (field.fieldImage2) {
    $("#fieldImage2Preview")
      .attr("src", `data:image/jpeg;base64,${field.fieldImage2}`)
      .show();
  } else {
    $("#fieldImage2Preview").attr("src", "").hide(); // Hide preview if no image
  }

  // Optionally, you can store the URL in a hidden field for further use
  $("#fieldImage1Hidden").val(field.fieldImage1 || "");
  $("#fieldImage2Hidden").val(field.fieldImage2 || "");
}

// Helper Function: Reset Form Fields
function resetFormFields() {
  $("#field-form")[0].reset();
}

// Helper Function: Close Modal
function closeModal() {
  const modal = bootstrap.Modal.getInstance($("#editFieldModal"));
  modal.hide();
}
// Function to Preview Image Before Upload
$(document).on("change", "#fieldImage1", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    $("#fieldImage1Preview").attr("src", e.target.result);
  };
  reader.readAsDataURL(this.files[0]);
});

$(document).on("change", "#fieldImage2", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    $("#fieldImage2Preview").attr("src", e.target.result);
  };
  reader.readAsDataURL(this.files[0]);
});
function getFieldFormData() {
  const image1 = $("#fieldImage1").prop("files")[0]; // Get the first file for Image 1
  const image2 = $("#fieldImage2").prop("files")[0]; // Get the first file for Image 2

  console.log("Image 1:", image1);
  console.log("Image 2:", image2);

  return {
    fieldCode: $("#fieldCode").val(), // Read input value for fieldCode
    fieldName: $("#fieldName").val(), // Read input value for fieldName
    fieldLocation: $("#fieldLocation").val(), // Read input value for fieldLocation
    extentSize: parseFloat($("#extentSize").val()), // Parse extentSize as a float
    fieldImage1: image1, // Pass the file object
    fieldImage2: image2, // Pass the file object
  };
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
function fetchAndUpdateFieldData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/fields/allfields", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (fieldData) {
      // Call the renderStaffCards function to refresh the DOM with the latest data
      renderFieldCards(fieldData);

      console.log("Field data refreshed successfully.");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching field data:", error);
    },
  });
}
function setFormReadOnly(isReadOnly) {
  const formFields = $("#field-form input, #field-form select");
  formFields.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
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
