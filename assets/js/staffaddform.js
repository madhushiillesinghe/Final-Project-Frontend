document.addEventListener("DOMContentLoaded", () => {
  // Check if there is staff data in localStorage
  const staffData = localStorage.getItem("staffToEdit");

  if (staffData) {
    const staff = JSON.parse(staffData);

    // Populate form fields
    document.getElementById("id").value = staff.id;
    document.getElementById("firstName").value = staff.firstName;
    document.getElementById("lastName").value = staff.lastName;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("gender").value = staff.gender;
    document.getElementById("joinedDate").value = staff.joinedDate;
    document.getElementById("dob").value = staff.dob;
    document.getElementById("roadNumber").value = staff.roadNumber;
    document.getElementById("street").value = staff.street;
    document.getElementById("city").value = staff.city;
    document.getElementById("district").value = staff.district;
    document.getElementById("province").value = staff.province;
    document.getElementById("contactNo").value = staff.contactNo;
    document.getElementById("email").value = staff.email;
    document.getElementById("role").value = staff.role;

    // Change button text and style for edit mode
    const actionButton = document.getElementById("actionButton");
    actionButton.textContent = "Update Staff";
    actionButton.style.backgroundColor = "orange";

    // Set form action to "edit"
    document.getElementById("staffForm").dataset.action = "edit";

    // Clear localStorage after populating
    localStorage.removeItem("staffToEdit");
  }
});
