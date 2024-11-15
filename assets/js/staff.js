let staffData = [
    {
      id: 1,
      name: "John Doe",
      address: "Galle",
      designation: "Manager",
      mobileNo: "0776210846",
      email: "john@example.com",
    },
  ];
  
  function loadStaffTable() {
    const tbody = $("#staff-table-body");
    tbody.empty(); // Clear existing rows
    staffData.forEach((staff, index) => {
      tbody.append(`
        <tr>
          <td>${staff.id}</td>
          <td>${staff.name}</td>
          <td>${staff.address}</td>
          <td>${staff.designation}</td>
          <td>${staff.mobileNo}</td>
          <td>${staff.email}</td>
          <td class="action-icons">
            <i class="fas fa-edit  me-3" onclick="editStaff(${staff.id})"></i>
            <i class="fas fa-trash-alt " onclick="deleteStaff(${staff.id})"></i>
          </td>
        </tr>
      `);
    });
  
    // Ensure the icons are styled after they are added to the DOM
    $(".action-icons i").css("color", "black");
  }
  
  function editStaff(id) {
    const staff = staffData.find((s) => s.id === id);
    if (staff) {
      const newName = prompt("Enter new name:", staff.name);
      const newDesignation = prompt("Enter new designation:", staff.designation);
      const newEmail = prompt("Enter new email:", staff.email);
      if (newName && newDesignation && newEmail) {
        staff.name = newName;
        staff.designation = newDesignation;
        staff.email = newEmail;
        loadStaffTable();
      }
    }
  }
  
  function deleteStaff(id) {
    if (confirm("Are you sure you want to delete this staff member?")) {
      staffData = staffData.filter((s) => s.id !== id);
      loadStaffTable();
    }
  }
  
  $(document).ready(() => {
    loadStaffTable();
  });
  