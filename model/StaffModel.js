// StaffModel.js
const StaffModel = (() => {
  let staffData = [
    {
      id: "S001",
      firstName: "John",
      lastName: "Doe",
      designation: "Scientist",
      gender: "MALE",
      roadNo: "362A",
      street: "123 Main St",
      city: "Colombo",
      district: "Colombo",
      province: "Western",
      contactNo: "0771234567",
      email: "john.doe@example.com",
      role: "SCIENTIST",
      field: "F04",
      joinedDate: "2022-01-01",
      dob: "1985-07-20",
    },
  ];

  const getStaffData = () => staffData;

  const addStaff = (staff) => {
    staffData.push(staff);
  };

  const updateStaff = (index, updatedStaff) => {
    staffData[index] = updatedStaff;
  };

  const deleteStaff = (index) => {
    staffData.splice(index, 1);
  };

  return {
    getStaffData,
    addStaff,
    updateStaff,
    deleteStaff,
  };
})();
