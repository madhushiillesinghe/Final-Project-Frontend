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
  loadFieldTable();
});

// Function to Load Field Table
function loadFieldTable() {
  const tbody = $("#field-table-body");
  tbody.empty(); // Clear existing rows

  fieldData.forEach((field) => {
    tbody.append(`
        <tr>
          <td>${field.fieldCode}</td>
          <td>${field.fieldName}</td>
          <td>${field.fieldLocation}</td>
          <td>${field.extentSize}</td>
          <<td><img src="${field.fieldImage1}" alt="Field Image 1" style="width: 50px; height: 50px;" /></td>
          <td><img src="${field.fieldImage2}" alt="Field Image 2" style="width: 50px; height: 50px;" /></td>
          <td class="action-icons">
            <i class="fas fa-edit me-3" onclick="editField('${field.fieldCode}')"></i>
            <i class="fas fa-trash-alt me-3" onclick="deleteField('${field.fieldCode}')"></i>
            <i class="fas fa-eye" onclick="viewField('${field.fieldCode}')"></i>
          </td>
        </tr>
      `);
  });
}

// Function to Add a New Field
function addField() {
  resetFormFields();
  $("#editFieldModalLabel").text("Add Field");
  $(".update").text("Save").attr("onclick", "saveNewField()");
  const addModal = new bootstrap.Modal($("#editFieldModal"));
  addModal.show();
}

// Function to Save a New Field
function saveNewField() {
  const newField = getFieldFormData();
  fieldData.push(newField);
  alert("New field added successfully!");
  loadFieldTable();
  closeModal();
}

// Function to Edit a Field
function editField(fieldCode) {
  setFormReadOnly(false);
  $(".update").show();

  const field = fieldData.find((f) => f.fieldCode === fieldCode);
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
    loadFieldTable();
  }
  const modal = bootstrap.Modal.getInstance($("#editFieldModal"));
  modal.hide();
}

// Function to Delete a Field
function deleteField(fieldCode) {
  if (confirm("Are you sure you want to delete this field?")) {
    fieldData = fieldData.filter((f) => f.fieldCode !== fieldCode);
    loadFieldTable();
    alert("Field deleted successfully!");
  }
}

// Function to View a Field
function viewField(fieldCode) {
  const field = fieldData.find((f) => f.fieldCode === fieldCode);
  if (field) {
    populateForm(field);
    setFormReadOnly(true);
    $("#editFieldModalLabel").text("View Field");
    $(".update").hide();
    const viewModal = new bootstrap.Modal($("#editFieldModal"));
    viewModal.show();
  }
}

// Helper Function: Get Form Data
// function getFieldFormData() {
//   return {
//     fieldCode: $("#fieldCode").val(),
//     fieldName: $("#fieldName").val(),
//     fieldLocation: $("#fieldLocation").val(),
//     extentSize: parseFloat($("#extentSize").val()),
//     fieldImage1: $("#fieldImage1").val(),
//     fieldImage2: $("#fieldImage2").val(),
//   };
// }

// Helper Function: Populate Form with Field Data
// function populateForm(field) {
//   $("#fieldCode").val(field.fieldCode);
//   $("#fieldName").val(field.fieldName);
//   $("#fieldLocation").val(field.fieldLocation);
//   $("#extentSize").val(field.extentSize);
//   $("#fieldImage1").val(field.fieldImage1);
//   $("#fieldImage2").val(field.fieldImage2);
// }
function populateForm(field) {
  $("#fieldCode").val(field.fieldCode);
  $("#fieldName").val(field.fieldName);
  $("#fieldLocation").val(field.fieldLocation);
  $("#extentSize").val(field.extentSize);
  $("#fieldImage1").val('');
  $("#fieldImage2").val('');

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
    fieldImage1: image1 ? URL.createObjectURL(image1) : $("#fieldImage1Preview").attr("src"),
    fieldImage2: image2 ? URL.createObjectURL(image2) : $("#fieldImage2Preview").attr("src"),
  };
}