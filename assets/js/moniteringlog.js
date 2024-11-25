// /assets/js/monitoring-log.js

// Sample data for demonstration (these will be populated dynamically)
let logs = [
    { logCode: "L001", logDate: "2024-11-25", observation: "Crop issue detected", fieldCode: "F01", cropCode: "C001", staffCode: "S001" },
    { logCode: "L002", logDate: "2024-11-24", observation: "No abnormalities", fieldCode: "F02", cropCode: "C002", staffCode: "S002" }
  ];
  
  // Sample dropdown data for crops, fields, and staff
  const crops = [
    { code: "C001", name: "Wheat" },
    { code: "C002", name: "Rice" },
    { code: "C003", name: "Corn" }
  ];
  
  const fields = [
    { code: "F01", name: "Field A" },
    { code: "F02", name: "Field B" },
    { code: "F03", name: "Field C" }
  ];
  
  const staff = [
    { code: "S001", name: "John Doe" },
    { code: "S002", name: "Jane Smith" },
    { code: "S003", name: "Alex Brown" }
  ];
  
  $(document).ready(() => {
    renderLogs();
  });
  // Function to render logs in the table
 // Function to render logs in the table
function renderLogs() {
    const tableBody = $("#log-table-body");
    tableBody.empty(); // Clear previous rows
  
    logs.forEach((log, index) => { // Add index here
      tableBody.append(`<tr>
        <td>${log.logCode}</td>
        <td>${log.logDate}</td>
        <td>${log.observation}</td>
        <td>${log.fieldCode}</td>
        <td>
          <i class="fas fa-edit me-3" onclick="editLog('${index}')"></i>
         <i class="fas fa-trash-alt me-3" onclick="deleteLog('${index}')"></i>
          <i class="fas fa-eye black-icon" onclick="viewLog('${index}')"></i>
        </td>
      </tr>`);
    });
  }
  
  
  // Populate dropdowns with options using jQuery
  function populateDropdowns() {
    // Crop Code Dropdown
    const cropCodeSelect = $("#cropCode");
    cropCodeSelect.empty();
    crops.forEach(crop => {
      cropCodeSelect.append(new Option(crop.name, crop.code));
    });
  
    // Field Code Dropdown
    const fieldCodeSelect = $("#fieldCode");
    fieldCodeSelect.empty();
    fields.forEach(field => {
      fieldCodeSelect.append(new Option(field.name, field.code));
    });
  
    // Staff Code Dropdown
    const staffCodeSelect = $("#staffCode");
    staffCodeSelect.empty();
    staff.forEach(staffMember => {
      staffCodeSelect.append(new Option(staffMember.name, staffMember.code));
    });
  }
  
  // Add Log
  $(".add-button").click(function() {
    $("#logForm")[0].reset(); // Reset form
    setFormReadOnly(false);
    $("#saveChangesBtn").show();
    $("#logCode").val(`L00${logs.length + 1}`);
    populateDropdowns();
    $("#editLogModalLabel").text("Add Logs");
      $("#saveChangesBtn").text("Save").attr("onclick", "saveChanges()");
    new bootstrap.Modal($("#editLogModal")).show();
  });
  
  // Edit Log
  function editLog(index) {
    setFormReadOnly(false);
   $("#saveChangesBtn").show();
    const log = logs[index];
    $("#logCode").val(log.logCode);
    $("#logDate").val(log.logDate);
    $("#observation").val(log.observation);
    $("#cropCode").val(log.cropCode);
    $("#fieldCode").val(log.fieldCode);
    $("#staffCode").val(log.staffCode);

    populateDropdowns();
    $("#editLogModalLabel").text("Edit  Logs");
    $("#saveChangesBtn").text("Update").attr("onclick", "saveChanges()");
    new bootstrap.Modal($("#editLogModal")).show();
  }
  
  // Save Log Changes
  $("#saveChangesBtn").click(function() {
    const logCode = $("#logCode").val();
    const logDate = $("#logDate").val();
    const observation = $("#observation").val();
    const cropCode = $("#cropCode").val();
    const fieldCode = $("#fieldCode").val();
    const staffCode = $("#staffCode").val();
  
    // Save the changes to the logs (this is a basic implementation)
    const logIndex = logs.findIndex(log => log.logCode === logCode);
    if (logIndex >= 0) {
      logs[logIndex] = { logCode, logDate, observation, cropCode, fieldCode, staffCode };
    } else {
      logs.push({ logCode, logDate, observation, cropCode, fieldCode, staffCode });
    }
  
    renderLogs();
    $(".btn-close").click(); // Close modal
  });
  
  // Delete Log
  function deleteLog(index) {
    logs.splice(index, 1);
    renderLogs();
  }
  
  // Search Logs
  function searchLogs() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const logRows = document.querySelectorAll("#log-table-body tr"); // Select rows
  
    logRows.forEach((row) => {
      const logCode = row.querySelector("td:nth-child(1)").textContent.toLowerCase(); // Get the text of the first td
      const logDate = row.querySelector("td:nth-child(2)").textContent.toLowerCase(); // Get the text of the second td
  
      if (
        logCode.includes(searchTerm) ||
        logDate.includes(searchTerm)
      ) {
        row.style.display = "table-row"; // Show the row if it matches
      } else {
        row.style.display = "none"; // Hide the row if it doesn't match
      }
    });
  }
  
 
  function viewLog(index) {
    const log = logs[index];
    if (log) {
        $("#logCode").val(log.logCode);
         $("#logDate").val(log.logDate);
         $("#observation").val(log.observation);
         $("#cropCode").val(log.cropCode);
         $("#fieldCode").val(log.fieldCode);
         $("#staffCode").val(log.staffCode);
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