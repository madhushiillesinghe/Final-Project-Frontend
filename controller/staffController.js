import {
  getStaffData,
  addStaffData,
  updateStaff,
  deleteStaff,
  getFieldData,
} from "../model/StaffModel.js";
async function init() {
  try {
    getFieldData();
    const staffData = await getStaffData(); // Wait for the data to be resolved
    console.log("Fetched staff data:", staffData);

    renderStaffCards(staffData); // Pass the resolved data to renderStaffCards

    // Event listeners for actions
    $("#search-bar").on("keyup", handleSearch);
  } catch (error) {
    console.error("Error initializing staff data:", error);
  }
}

$("#addbtn").click(async function () {
  setFormReadOnly(false);
  console.log("Clicked add button");
  const staffData = await getStaffData(); // Wait for the data to be resolved

  if (!staffData || staffData.length === 0) {
    console.error("Staff data is empty or undefined!");
    return; // Early exit if there's an issue with the data
  }

  // Generate a new ID based on the number of existing staff
  const newId = `S${String(staffData.length + 1).padStart(2, "0")}`;
  console.log("Generated ID:", newId);

  // Reset the form and prepare it for adding new staff
  $("#staffForm")[0].reset(); // Reset all fields
  $("#editStaffModalLabel").text("Add Staff"); // Set modal title
  $(".update")
    .show()
    .text("Save")
    .off("click") // Remove any previous click handlers
    .on("click", saveNewStaff); // Attach the saveNewStaff handler
  $("#staffForm input, #staffForm select, #staffForm textarea").prop(
    "readonly",
    false
  );

  // Show the modal
  const modal = new bootstrap.Modal($("#editStaffModal")[0]); // Pass the DOM element instead of jQuery object
  modal.show();

  // Set the staff ID once the modal content is fully rendered
  $("#editStaffModal").on("shown.bs.modal", function () {
    const staffInput = $("#id");
    if (staffInput.length) {
      staffInput.val(newId);
      console.log("ID successfully set in input field:", staffInput.val());
    } else {
      console.error("#id input field not found!");
    }
  });
});

async function saveNewStaff() {
  const newStaff = collectFormData(); // Collect data from the form
  console.log();
  if (validate(newStaff)) {
    const staffData = await getStaffData(); // Fetch the current staff data
    const cardElement = $(this).closest(".staff-card"); // Find the closest card element

    // Send new staff data to the backend
    addStaffData(newStaff, function (success) {
      if (success) {
        fetchAndUpdateStaffData();
        alert("Staff member added successfully!");

        // Close the modal
        const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
        modal.hide();
      }
    });
  }
}

// Handle editing a staff member
function handleEdit(staffData, index, cardElement) {
  setFormReadOnly(false);
  const staff = staffData[index];
  console.log(staff, "staff");
  populateFormFields(staff); // Populate fields with data
  $("#editStaffModalLabel").text("Edit Staff");

  // Show the update button and bind the saveChanges handler
  $(".update")
    .show()
    .text("Update")
    .data("index", index) // Store the index using data-attribute
    .off("click") // Unbind previous click event
    .on("click", function () {
      saveChanges(index, cardElement, staffData);
    }); // Bind the saveChanges function
  console.log(index, "index is");
  // Make form fields editable
  $("#staffForm input, #staffForm select, #staffForm textarea").prop(
    "readonly",
    false
  );

  // Show the modal
  const modal = new bootstrap.Modal($("#editStaffModal"));
  modal.show();

  $("#editStaffModal").on("shown.bs.modal", function () {
    const staffInput = $("#id");
    if (staffInput.length) {
      staffInput.val(staff.id); // Set existing ID for edit mode
    }
  });
}
function saveChanges(index, cardElement, staff) {
  const updatedStaff = collectFormData(); // Collect the form data
  const staffId = updatedStaff.id; // Ensure the ID is included in the updated data
  if (validate(updatedStaff)) {
    updateStaff(staffId, updatedStaff, function (success) {
      if (success) {
        cardElement
          .find("h5")
          .text(`${updatedStaff.name.firstName} ${updatedStaff.name.lastName}`);
        cardElement.find("p:contains('ID')").text(`ID: ${updatedStaff.id}`);
        cardElement
          .find("p:contains('Designation')")
          .text(`Designation: ${updatedStaff.designation}`);
        cardElement
          .find("p:contains('Contact')")
          .text(`Contact: ${updatedStaff.contactNo}`);
        cardElement
          .find("p:contains('Email')")
          .text(`Email: ${updatedStaff.email}`);

        populateFieldTable(updatedStaff.fields); // Update table dynamically

        alert("Staff member updated successfully!");
        const modal = bootstrap.Modal.getInstance($("#editStaffModal")[0]);
        modal.hide();
        fetchAndUpdateStaffData(); // Refresh staff data
      } else {
        alert("Failed to update the staff member. Please try again.");
      }
    });
  }
}

// Handle viewing a staff member
function handleView(staffData, index) {
  const staff = staffData[index];
  console.log(staff);
  populateFormFields(staff); // Populate fields with data
  $("#editStaffModalLabel").text("View Staff");
  $(".update").hide(); // Hide update button
  $("#staffForm input, #staffForm select, #staffForm textarea").prop(
    "readonly",
    true
  ); // Make fields read-only
  const modal = new bootstrap.Modal($("#editStaffModal"));
  modal.show();
  $("#editStaffModal").on("shown.bs.modal", function () {
    const staffInput = $("#id");
    if (staffInput.length) {
      staffInput.val(staff.id); // Set existing ID for edit mode
    }
  });
}
// Handle search functionality for staff members
$("#search-bar").keyup(async function () {
  console.log("Searching for staff...");
  const staff = await getStaffData();
  // Ensure that staff is an array
  if (!Array.isArray(staff)) {
    console.error("getStaffData() did not return an array.");
    return; // Exit the function if the data is not an array
  }

  const searchTerm = $("#search-bar").val().toLowerCase();

  // Filter staff based on first name, last name, or ID
  const filteredStaff = staff.filter(
    (staffMember) =>
      `${staffMember.name.firstName} ${staffMember.name.lastName}`
        .toLowerCase()
        .includes(searchTerm) ||
      `${staffMember.id}`.toLowerCase().includes(searchTerm) ||
      `${staffMember.designation}`.toLowerCase().includes(searchTerm) ||
      `${staffMember.gender}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderStaffCards(filteredStaff);
});

// Render staff cards dynamically
function renderStaffCards(staffData) {
  const staffContainer = $("#staff-container");
  staffContainer.empty(); // Clear the container first

  staffData.forEach((staff, index) => {
    const card = `
        <div class="col-md-3 id="staff-card-${staff.id}">
          <div class="staff-card position-relative p-3 border rounded shadow-sm">
            <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-2 delete-icon" 
             title="Delete Staff" data-index="${index}"></i>
            <i class="fas fa-user-circle text-dark mb-2" style="font-size: 40px;"></i>
            <h5>${staff.name.firstName} ${staff.name.lastName}</h5>
            <p>ID: ${staff.id}</p>
            <p>Designation: ${staff.designation}</p>
            <p>Contact: ${staff.contactNo}</p>
            <p>Email: ${staff.email}</p>
            <div class="action-buttons d-flex justify-content-center align-items-center gap-3 mt-3">
              <i class="fas fa-edit text-primary" title="Edit Details" data-index="${index}"></i>        
              <button class="btn btn-success btn-sm text-white view-btn" data-index="${index}">
                View <i class="fas fa-arrow-right ml-2 text-white"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    staffContainer.append(card); // Append each card to the container
  });

  // Event handling for delete
  staffContainer
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const cardElement = $(this).closest(".staff-card"); // Find the closest card element
      const staffId = staffData[index].id; // Retrieve the staff ID
      console.log(staffData, "Staff Data in Controller");
      console.log(staffId, "Staff ID");

      if (confirm("Are you sure you want to delete this staff member?")) {
        deleteStaff(staffId, cardElement, function (success) {
          if (success) {
            fetchAndUpdateStaffData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to update the staff member. Please try again.");
          }
        }); // Pass the staff ID to deleteStaff
      }
    });

  // Event handling for edit
  staffContainer.off("click", ".fa-edit").on("click", ".fa-edit", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    const cardElement = $(this).closest(".staff-card"); // Find the closest card element
    handleEdit(staffData, index, cardElement); // Call the edit handler with the staff index
  });
  // Event handling for view
  staffContainer
    .off("click", ".view-btn")
    .on("click", ".view-btn", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      handleView(staffData, index); // Call the view handler with the staff index
    });
}

// Collect form data
// Collect form data for edit functionality
const collectFormData = () => {
  const fields = [];
  const rows = document.querySelectorAll("#log-table-body tr");

  // Loop through each row in the table and collect field codes
  rows.forEach((row) => {
    const fieldCode = row.cells[0].textContent; // Get the field code from the first cell
    fields.push({ fieldCode });
  });

  return {
    id: $("#id").val(),
    name: {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
    },
    designation: $("#designation").val(),
    gender: $("#gender").val(),
    address: {
      roadNo: $("#roadNo").val(),
      street: $("#street").val(),
      city: $("#city").val(),
      district: $("#district").val(),
      province: $("#province").val(),
    },
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    role: $("#role").val(),
    fields, // Include collected fields here
    joinedDate: $("#joinedDate").val(),
    dob: $("#dob").val(),
  };
};

// Populate form fields with staff data
function populateFormFields(staff) {
  $("#id").val(staff.id);
  $("#firstName").val(staff.name.firstName);
  $("#lastName").val(staff.name.lastName);
  $("#designation").val(staff.designation);
  $("#gender").val(staff.gender);
  $("#roadNo").val(staff.address.roadNo);
  $("#street").val(staff.address.street);
  $("#city").val(staff.address.city);
  $("#district").val(staff.address.district);
  $("#province").val(staff.address.province);
  $("#contactNo").val(staff.contactNo);
  $("#email").val(staff.email);
  $("#role").val(staff.role);
  $("#fieldSelector").val(staff.field);
  $("#joinedDate").val(staff.joinedDate);
  $("#dob").val(staff.dob);
}

// Initialize the StaffController
$(document).ready(() => {
  init();
});

// Load sidebar HTML dynamically
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
function fetchAndUpdateStaffData() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  $.ajax({
    url: "http://localhost:8080/agriculture/api/v1/staff/allstaff", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
      // Set content type to JSON
    },
    success: function (staffData) {
      // Call the renderStaffCards function to refresh the DOM with the latest data
      renderStaffCards(staffData);

      console.log("Staff data refreshed successfully.");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching staff data:", error);
    },
  });
}
function setFormReadOnly(isReadOnly) {
  const formStaff = $("#staff-form input, #staff-form select");
  formStaff.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
  });
}
// Add selected field to the table
document
  .getElementById("addFieldBtn")
  .addEventListener("click", function (event) {
    // Prevent default button behavior (like form submission or page reload)
    event.preventDefault();

    const fieldSelector = document.getElementById("fieldSelector");
    const selectedField = fieldSelector.value;

    if (selectedField) {
      const logTableBody = document.getElementById("log-table-body");

      // Check for duplicates
      const existingRows = Array.from(logTableBody.getElementsByTagName("tr"));
      const isDuplicate = existingRows.some(
        (row) => row.firstChild.textContent === selectedField
      );

      if (!isDuplicate) {
        // Create a new table row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>${selectedField}</td>
        <td><button class="btn btn-danger btn-sm remove-field">Remove</button></td>
      `;
        logTableBody.appendChild(newRow);

        // Add event listener for the remove button
        newRow
          .querySelector(".remove-field")
          .addEventListener("click", function () {
            newRow.remove();
          });

        // Reset the dropdown
        fieldSelector.selectedIndex = 0;
      } else {
        alert("Field code already added.");
      }
    } else {
      alert("Please select a field code.");
    }
  });

function populateFieldTable(fields) {
  const logTableBody = document.getElementById("log-table-body");
  logTableBody.innerHTML = ""; // Clear existing rows

  fields.forEach((field) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${field.fieldCode}</td>
      <td><button class="btn btn-danger btn-sm remove-field">Remove</button></td>
    `;
    logTableBody.appendChild(newRow);

    // Add event listener for the remove button
    newRow
      .querySelector(".remove-field")
      .addEventListener("click", function () {
        newRow.remove();
      });
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
function validate(newStaff) {
  let valid = true;

  // Validate First Name
  if (/^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/.test(newStaff.name.firstName)) {
    $("#staff-form .invalidStaffName").text("");
  } else {
    $("#staff-form .invalidStaffName").text("Invalid staff First Name");
    valid = false;
  }

  // Validate Contact Number (e.g., supports formats like 1234567890, +911234567890, (123) 456-7890)
  if (
    /^\+?[0-9]{1,4}?[-. (]?[0-9]{3}[-. )]?[0-9]{3}[-. ]?[0-9]{4}$/.test(
      newStaff.contactNo
    )
  ) {
    $("#staff-form .invalidContactNo").text("");
  } else {
    $("#staff-form .invalidContactNo").text("Invalid staff Contact No");
    valid = false;
  }

  // Validate Email
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newStaff.email)) {
    $("#staff-form .invalidCEmail").text("");
  } else {
    $("#staff-form .invalidCEmail").text("Invalid staff Email");
    valid = false;
  }
  console.log(valid, "valid is");
  return valid; // Return the validation result
}
