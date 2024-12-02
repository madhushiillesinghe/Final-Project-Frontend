import {
  getMoniteringLogData,
  addMoniteringLogData,
  updateMoniteringLog,
  deleteMoniteringLog,
} from "../model/MoniteringLogModel.js";

$(document).ready(() => {
  init();
});
async function init() {
  try {
    const logData = await getMoniteringLogData(); // Wait for the data to be resolved
    console.log("Fetched Monitering Log data:", logData);

    renderLogs(logData); // Pass the resolved data to renderStaffCards

    // Event listeners for actions
    $("#search-bar").on("keyup", handleSearch);
  } catch (error) {
    console.error("Error initializing log data:", error);
  }
}
function renderLogs(logs) {
  const tableBody = $("#log-table-body");
  tableBody.empty(); // Clear previous rows

  logs.forEach((log, index) => {
    // Add index here
    tableBody.append(`<tr>
        <td>${log.logCode}</td>
        <td>${log.logDate}</td>
        <td>${log.observation}</td>
        <td>${log.fieldCode}</td>
        <td>
          <i class="fas fa-edit me-3 " data-index="${index}"></i>
         <i class="fas fa-trash-alt me-3 delete-icon" data-index="${index}"></i>
          <i class="fas fa-eye black-icon view-btn" data-index="${index}"></i>
        </td>
      </tr>`);
  });
  tableBody
    .off("click", ".delete-icon")
    .on("click", ".delete-icon", function () {
      const index = $(this).data("index"); // Get the index from the data attribute
      const tableRow = $(this).closest("tr"); // Find the closest row
      console.log(index, "Log index in delete log");
      const logCode = logs[index].logCode; // Retrieve the log code
      console.log(logs, "Monitoring Logs in Controller");
      console.log(logCode, "Log Code");

      if (confirm("Are you sure you want to delete this Monitoring Log?")) {
        deleteMoniteringLog(logCode, tableRow, function (success) {
          if (success) {
            fetchAndUpdateData(); // Call the fetch function to reload the DOM
          } else {
            alert("Failed to delete the Monitoring Log. Please try again.");
          }
        });
      }
    });

  tableBody.off("click", ".fa-edit").on("click", ".fa-edit", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    const tablerow = $(this).closest("tr"); // Find the closest card element
    editLog(logs, index, tablerow); // Call the edit handler with the staff index
  });
  // Event handling for view
  tableBody.off("click", ".view-btn").on("click", ".view-btn", function () {
    const index = $(this).data("index"); // Get the index from the data attribute
    viewLog(logs, index); // Call the view handler with the staff index
  });
}
$("#addbtn").click(async function () {
  setFormReadOnly(false);
  console.log("Clicked add button");
  const logData = await getMoniteringLogData(); // Wait for the data to be resolved

  if (!logData || logData.length === 0) {
    console.error("log data is empty or undefined!");
    return;
  }

  // Generate a new ID based on the number of existing staff
  const newId = `L${String(logData.length + 1).padStart(2, "0")}`;
  console.log("Generated ID:", newId);

  // Reset the form and prepare it for adding new staff
  $("#editLogModalLabel").text("Add Logs"); // Set modal title
  $("#logForm")[0].reset();
  $("#saveChangesBtn")
    .show()
    .text("Save")
    .off("click") // Remove any previous click handlers
    .on("click", saveNewLog); // Attach the saveNewStaff handler
  $("#logForm input, #logForm select, #logForm textarea").prop(
    "readonly",
    false
  );

  // Show the modal
  const modal = new bootstrap.Modal($("#editLogModal")[0]); // Pass the DOM element instead of jQuery object
  modal.show();

  $("#editLogModal").on("shown.bs.modal", function () {
    const logInput = $("#logCode");
    if (logInput.length) {
      logInput.val(newId);
      console.log("ID successfully set in input   Log:", logInput.val());
    } else {
      console.error("#id input field not found!");
    }
  });

  // Set the staff ID once the modal content is fully rendered
});

function editLog(logData, index, tableRow) {
  setFormReadOnly(false);
  $("#saveChangesBtn").show();

  const log = logData[index];

  // Set form fields
  $("#logCode").val(log.logCode);

  // Format the date and set it in the input
  const logDate = new Date(log.logDate);
  const formattedDate = logDate.toISOString().split("T")[0];
  $("#logDate").val(formattedDate);

  $("#observation").val(log.observation);

  // Ensure cropCode exists in the dropdown, then select it
  if (!$("#cropCode option[value='" + log.cropCode + "']").length) {
    $("#cropCode").append(
      `<option value="${log.cropCode}">${log.cropCode}</option>`
    );
  }
  $("#cropCode").val(log.cropCode).change();

  // Ensure fieldCode exists in the dropdown, then select it
  if (!$("#fieldCode option[value='" + log.fieldCode + "']").length) {
    $("#fieldCode").append(
      `<option value="${log.fieldCode}">${log.fieldCode}</option>`
    );
  }
  $("#fieldCode").val(log.fieldCode).change();

  // Ensure staffCode exists in the dropdown, then select it
  if (!$("#staffCode option[value='" + log.staffCode + "']").length) {
    $("#staffCode").append(
      `<option value="${log.staffCode}">${log.staffCode}</option>`
    );
  }
  $("#staffCode").val(log.staffCode).change();

  // Set image preview
  if (log.observedImage) {
    $("#observedImage").attr("src", log.observedImage).show(); // Show preview
  } else {
    $("#observedImage").attr("src", "").hide(); // Hide preview
  }

  // Set modal title and button text
  $("#editLogModalLabel").text("Edit Logs");
  $("#saveChangesBtn").text("Update");

  // Clear previous event handlers and attach the new one
  $("#saveChangesBtn")
    .off("click") // Remove any previously attached handlers
    .on("click", function () {
      saveChanges(index, tableRow, logData); // Trigger saveChanges
    });

  // Show the modal
  new bootstrap.Modal($("#editLogModal")).show();
}

$(document).on("change", "#observedImage", function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    $("#observedImage").attr("src", e.target.result);
  };
  reader.readAsDataURL(this.files[0]);
});
// Save Log Changes
function saveChanges(index, tableRow, logs) {
  const imageobserved = $("#observedImage").prop("files")[0]; // Get the first file for Image 1
  const UpdatedlogData = {
    logCode: $("#logCode").val(),
    logDate: $("#logDate").val(),
    observation: $("#observation").val(),
    cropCode: $("#cropCode").val(),
    fieldCode: $("#fieldCode").val(),
    staffCode: $("#staffCode").val(),
    observedImage: imageobserved,
  };
  const logCode = UpdatedlogData.logCode;
  updateMoniteringLog(logCode, UpdatedlogData, function (success) {
    if (success) {
      alert("Monitering Log updated successfully!");
      const modal = bootstrap.Modal.getInstance($("#editLogModal")[0]);
      modal.hide();
      fetchAndUpdateData();
    } else {
      alert("Failed to update the log. Please try again.");
    }
  });
}
function saveNewLog(index, tableRow, logs) {
  const imageobserved = $("#observedImage").prop("files")[0]; // Get the first file for Image 1
  const newlogData = {
    logCode: $("#logCode").val(),
    logDate: $("#logDate").val(),
    observation: $("#observation").val(),
    cropCode: $("#cropCode").val(),
    fieldCode: $("#fieldCode").val(),
    staffCode: $("#staffCode").val(),
    observedImage: imageobserved,
  };
  addMoniteringLogData(newlogData, function (success) {
    if (success) {
      fetchAndUpdateData();
      alert("Log added successfully!");
      const modal = bootstrap.Modal.getInstance($("#editLogModal")[0]);
      modal.hide();
    }
  });
}
$("#search-bar").keyup(async function () {
  console.log("Searching for Logs...");
  const Logs = await getMoniteringLogData();
  if (!Array.isArray(Logs)) {
    console.error("getLogData() did not return an array.");
    return; // Exit the function if the data is not an array
  }
  const searchTerm = $("#search-bar").val().toLowerCase();

  // Filter staff based on first name, last name, or ID
  const filteredLog = Logs.filter(
    (filteredRow) =>
      `${filteredRow.logCode} `.toLowerCase().includes(searchTerm) ||
      `${filteredRow.logData}`.toLowerCase().includes(searchTerm)
  );

  // Render the filtered staff cards
  renderLogs(filteredLog);
});

function viewLog(logsData, index) {
  const log = logsData[index];
  if (log) {
    const logDate = new Date(log.logDate);
    const formattedDate = logDate.toISOString().split("T")[0];
    $("#logDate").val(formattedDate);
    $("#logCode").val(log.logCode);
    $("#observation").val(log.observation);
    $("#observedImage").val("");
    if (!$("#cropCode option[value='" + log.cropCode + "']").length) {
      $("#cropCode").append(
        `<option value="${log.cropCode}">${log.cropCode}</option>`
      );
    }
    $("#cropCode").val(log.cropCodee).change();

    if (!$("#fieldCode option[value='" + log.fieldCode + "']").length) {
      $("#fieldCode").append(
        `<option value="${log.fieldCode}">${log.fieldCode}</option>`
      );
    }
    $("#fieldCode").val(log.fieldCode).change();

    if (!$("#staffCode option[value='" + log.staffCode + "']").length) {
      $("#staffCode").append(
        `<option value="${log.staffCode}">${log.staffCode}</option>`
      );
    }
    $("#staffCode").val(log.staffCode).change();
    console.log(log.observedImage, "view pop up image");

    if (log.observedImage) {
      $("#observedImage").attr("src", log.observedImage).show(); // Show the preview image
    } else {
      $("#observedImage").attr("src", "").hide(); // Hide preview if no image
    }
    setFormReadOnly(true);
    $("#editLogModalLabel").text("View Logs");
    $("#saveChangesBtn").hide();
    new bootstrap.Modal($("#editLogModal")).show();
  } else {
    alert("Log not found!");
  }
}
function setFormReadOnly(isReadOnly) {
  const formFields = $("#logForm input, #logForm select");
  formFields.each(function () {
    if (isReadOnly) {
      $(this).attr("readonly", true).attr("disabled", true);
    } else {
      $(this).removeAttr("readonly").removeAttr("disabled");
    }
  });
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
    url: "http://localhost:8080/agriculture/api/v1/logs/alllogs", // Backend API URL
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ` + token, // Include the JWT token (use backticks for template literals)
    },
    success: function (logData) {
      renderLogs(logData);
      console.log("Monitering Log data refreshed successfully.");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching Monitering Log data:", error);
    },
  });
}
