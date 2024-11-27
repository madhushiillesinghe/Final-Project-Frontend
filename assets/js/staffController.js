const StaffController = (() => {
  const init = () => {
    const staffData = StaffModel.getStaffData();
    StaffView.renderStaffCards(staffData);

    $("#addbtn").on("click", handleAdd);
    $("#search-bar").on("keyup", handleSearch);
  };

  const handleAdd = () => {
    // Generate a new ID based on the number of existing staff
    const staffData = StaffModel.getStaffData();
    const newId = `S${String(staffData.length + 1).padStart(3, "0")}`;
    console.log("Generated ID:", newId);
  
    // Reset the form and prepare it for adding new staff
    $("#staffForm")[0].reset(); // Reset all fields
    $("#editStaffModalLabel").text("Add Staff"); // Set modal title
    $(".update").show().text("Save").attr("onclick", "StaffController.saveNewStaff()"); // Update button
    $("#staffForm input, #staffForm select, #staffForm textarea").prop("readonly", false); // Make fields editable
  
    // Show the modal and set the ID when the modal is fully shown
    const modal = new bootstrap.Modal($("#editStaffModal"));
    modal.show();
  
    // Set the staff ID once the modal content is fully rendered
    $("#editStaffModal").on("shown.bs.modal", function () {
      const staffInput = $("#staffid");
      if (staffInput.length) {
        staffInput.val(newId);
        console.log("ID successfully set in input field:", staffInput.val());
      } else {
        console.error("#staffid input field not found!");
      }
    });
  };
  
  

  const saveNewStaff = () => {
    const newStaff = StaffView.collectFormData();
    StaffModel.addStaff(newStaff);
    StaffView.renderStaffCards(StaffModel.getStaffData());
    alert("Staff member added successfully!");
    const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
    modal.hide();
  };

  const handleEdit = (index) => {
    const staff = StaffModel.getStaffData()[index];
    StaffView.populateFormFields(staff); // Populate fields with data
    $("#editStaffModalLabel").text("Edit Staff");
    $(".update")
      .show()
      .text("Update")
      .attr("onclick", `StaffController.saveChanges(${index})`); // Update button
    $("#staffForm input, #staffForm select, #staffForm textarea").prop(
      "readonly",
      false
    ); // Make fields editable
    const modal = new bootstrap.Modal($("#editStaffModal"));
    modal.show();
  };

  const saveChanges = (index) => {
    const updatedStaff = StaffView.collectFormData();
    StaffModel.updateStaff(index, updatedStaff);
    StaffView.renderStaffCards(StaffModel.getStaffData());
    alert("Staff member updated successfully!");
    const modal = bootstrap.Modal.getInstance($("#editStaffModal"));
    modal.hide();
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      StaffModel.deleteStaff(index);
      StaffView.renderStaffCards(StaffModel.getStaffData());
      alert("Staff member deleted successfully!");
    }
  };

  const handleView = (index) => {
    const staff = StaffModel.getStaffData()[index];
    StaffView.populateFormFields(staff); // Populate fields with data
    $("#editStaffModalLabel").text("View Staff");
    $(".update").hide(); // Hide update button
    $("#staffForm input, #staffForm select, #staffForm textarea").prop(
      "readonly",
      true
    ); // Make fields read-only
    const modal = new bootstrap.Modal($("#editStaffModal"));
    modal.show();
  };

  const handleSearch = () => {
    const searchTerm = $("#search-bar").val().toLowerCase();
    const filteredStaff = StaffModel.getStaffData().filter((staff) =>
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm)
    );
    StaffView.renderStaffCards(filteredStaff);
  };

  return {
    init,
    saveNewStaff,
    saveChanges,
    handleEdit,
    handleDelete,
    handleView,
  };
})();

$(document).ready(() => {
  StaffController.init();
});
