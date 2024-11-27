// StaffView.js
const StaffView = (() => {
    const renderStaffCards = (staffData) => {
      const staffContainer = $("#staff-container");
      staffContainer.empty();
  
      staffData.forEach((staff, index) => {
        const card = `
          <div class="col-md-3">
            <div class="staff-card position-relative">
              <i class="fas fa-trash text-danger position-absolute top-0 end-0 m-4" title="Delete Staff" onclick="StaffController.handleDelete(${index})"></i>
              <i class="fas fa-user-circle text-dark" style="font-size: 40px;"></i>
              <h5>${staff.firstName} ${staff.lastName}</h5>
              <p>${staff.designation}</p>
              <p>${staff.contactNo}</p>
              <p>${staff.email}</p>
              <div class="action-buttons d-flex justify-content-center align-items-center gap-4 mt-3">
                <i class="fas fa-edit text-dark" title="Edit Details" onclick="StaffController.handleEdit(${index})"></i>
                <button class="btn btn-success btn-sm text-white" title="Get Details" onclick="StaffController.handleView(${index})">
                  View <i class="fas fa-arrow-right ml-2 text-white"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        staffContainer.append(card);
      });
    };
  
    const collectFormData = () => ({
      id: $("#id").val(),
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      designation: $("#designation").val(),
      gender: $("#gender").val(),
      roadNo: $("#roadNo").val(),
      street: $("#street").val(),
      city: $("#city").val(),
      district: $("#district").val(),
      province: $("#province").val(),
      contactNo: $("#contactNo").val(),
      email: $("#email").val(),
      role: $("#role").val(),
      field: $("#fieldSelector").val(),
      joinedDate: $("#joinedDate").val(),
      dob: $("#dob").val(),
    });
  
    const populateFormFields = (staff) => {
      $("#id").val(staff.id);
      $("#firstName").val(staff.firstName);
      $("#lastName").val(staff.lastName);
      $("#designation").val(staff.designation);
      $("#gender").val(staff.gender);
      $("#roadNo").val(staff.roadNo);
      $("#street").val(staff.street);
      $("#city").val(staff.city);
      $("#district").val(staff.district);
      $("#province").val(staff.province);
      $("#contactNo").val(staff.contactNo);
      $("#email").val(staff.email);
      $("#role").val(staff.role);
      $("#fieldSelector").val(staff.field);
      $("#joinedDate").val(staff.joinedDate);
      $("#dob").val(staff.dob);
    };
  
    return {
      renderStaffCards,
      collectFormData,
      populateFormFields,
    };
  })();
  
// Function to dynamically load the sidebar
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
  
  // Other UI-related rendering logic for staff cards, modals, etc.
  