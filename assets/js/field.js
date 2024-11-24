// Initial Field Data
let fieldData = [
  {
    fieldCode: "F001",
    fieldName: "Field A",
    fieldLocation: "40.7128, -74.0060",
    extentSize: 10.5,
    fieldImage1: "https://via.placeholder.com/100",
    fieldImage2: "https://via.placeholder.com/100",
  },
];

// Load Field Table on Page Ready
$(document).ready(() => {
  renderFieldCards();
});
const fieldContainer = $("#field-container");
const fieldModal = new bootstrap.Modal($("#editFieldModal"));
const fieldForm = $("#field-form-section");
// Function to Load Field Table
// function loadFieldTable() {
//   const tbody = $("#field-table-body");
//   tbody.empty(); // Clear existing rows

//   fieldData.forEach((field) => {
//     tbody.append(`
//         <tr>
//           <td>${field.fieldCode}</td>
//           <td>${field.fieldName}</td>
//           <td>${field.fieldLocation}</td>
//           <td>${field.extentSize}</td>
//           <<td><img src="${field.fieldImage1}" alt="Field Image 1" style="width: 50px; height: 50px;" /></td>
//           <td><img src="${field.fieldImage2}" alt="Field Image 2" style="width: 50px; height: 50px;" /></td>
//           <td class="action-icons">
//             <i class="fas fa-edit me-3" onclick="editField('${field.fieldCode}')"></i>
//             <i class="fas fa-trash-alt me-3" onclick="deleteField('${field.fieldCode}')"></i>
//             <i class="fas fa-eye" onclick="viewField('${field.fieldCode}')"></i>
//           </td>
//         </tr>
//       `);
//   });
// }

// Load Field cards
function renderFieldCards() {
  fieldContainer.empty();
  fieldData.forEach((field, index) => {
    const card = `
      <div class="col-md-3">
         <div class="field-card position-relative">
          <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete Field" onclick="deleteField(${index})"></i>
        <img src="/assets/image/field.png" alt="User Icon" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
          <h5>${field.fieldName}</h5>
          <p>${field.fieldCode}</p>
          <p>${field.fieldLocation}</p>
          <p>${field.extentSize}</p>
          <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
            <i class="fas fa-edit text-dark" title="Edit Details" onclick="editfield(${index})"></i>        
            <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="viewField(${index})">
            View <i class="fas fa-arrow-right ml-2 text-white"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    fieldContainer.append(card);
  });
}

function searchField() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  const fieldCards = document.querySelectorAll(".field-card");

  fieldCards.forEach((card) => {
    const fieldName = card.querySelector("h5").textContent.toLowerCase();
    const fieldCode = card.querySelector("p").textContent.toLowerCase();

    if (fieldName.includes(searchTerm) || fieldCode.includes(searchTerm)) {
      card.style.display = "block"; // Show the card if it matches
    } else {
      card.style.display = "none"; // Hide the card if it doesn't match
    }
  });
}
// Function to Add a New Field
function addField() {
  resetFormFields();
  setFormReadOnly(false);
  $(".update").show();
  $("#fieldCode").val(`F${String(fieldData.length + 1).padStart(3, "0")}`);
  $("#editFieldModalLabel").text("Add Field");
  $(".update").text("Save").attr("onclick", "saveNewField()");
  fieldModal.show();
}

// Function to Save a New Field
function saveNewField() {
  const newField = getFieldFormData();
  fieldData.push(newField);
  alert("New field added successfully!");
  renderFieldCards();
  closeModal();
}

// Function to Edit a Field
function editfield(index) {
  setFormReadOnly(false);
  $(".update").show();

  const field = fieldData[index];
  if (field) {
    populateForm(field);
    $("#editFieldModalLabel").text("Edit Field");
    $(".update").text("Update").attr("onclick", "saveFieldChanges()");
    const editModal = new bootstrap.Modal($("#editFieldModal"));
    editModal.show();
  } else {
    alert("Field not found!");
  }
}

// Function to Save Changes to a Field
function saveFieldChanges() {
  const updatedField = getFieldFormData();
  const index = fieldData.findIndex(
    (f) => f.fieldCode === updatedField.fieldCode
  );
  if (index !== -1) {
    fieldData[index] = updatedField;
    alert("Field updated successfully!");
    renderFieldCards();
  }
  const modal = bootstrap.Modal.getInstance($("#editFieldModal"));
  modal.hide();
}

// Function to Delete a Field
function deleteField(index) {
  if (confirm("Are you sure you want to delete this field?")) {
    fieldData.splice(index, 1);
    renderFieldCards();
  }
}

// Function to View a Field
function viewField(index) {
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

  // Set Image Previews
  $("#fieldImage1Preview").attr("src", field.fieldImage1);
  $("#fieldImage2Preview").attr("src", field.fieldImage2);
}
// Helper Function: Set Form Read-Only State
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
  const image1 = $("#fieldImage1").prop("files")[0];
  const image2 = $("#fieldImage2").prop("files")[0];

  return {
    fieldCode: $("#fieldCode").val(),
    fieldName: $("#fieldName").val(),
    fieldLocation: $("#fieldLocation").val(),
    extentSize: parseFloat($("#extentSize").val()),
    fieldImage1: image1
      ? URL.createObjectURL(image1)
      : $("#fieldImage1Preview").attr("src"),
    fieldImage2: image2
      ? URL.createObjectURL(image2)
      : $("#fieldImage2Preview").attr("src"),
  };
}
