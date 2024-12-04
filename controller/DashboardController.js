import {
  getCropData,
  getEquipmentData,
  getFieldData,
  getMoniteringLogData,
  getStaffData,
  getVehicleData,
} from "../model/DashboardModel.js";

$(document).ready(() => {
  init();
});

async function init() {
  try {
    // Fetching data from the APIs
    const equipmentData = await getEquipmentData();
    const countEquipment = equipmentData.length;

    const staffData = await getStaffData();
    const countStaff = staffData.length;

    const fieldData = await getFieldData();
    const countField = fieldData.length;

    const vehicleData = await getVehicleData();
    const countVehicle = vehicleData.length;

    const cropData = await getCropData();
    const countCrop = cropData.length;

    const logData = await getMoniteringLogData();
    const countLog = logData.length;
    console.log(countCrop,countField,countEquipment,countLog,countStaff,countVehicle,"count")
    // Initialize charts
    initializeCharts(countField, countCrop, countStaff, countVehicle, countEquipment, countLog);
  } catch (error) {
    console.error("Error initializing data:", error);
  }
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

function initializeCharts(countField, countCrop, countStaff, countVehicle, countEquipment, countLog) {
  // Line Chart
  const ctx = document.getElementById("lineChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "April", "May", "June"],
      datasets: [
        {
          label: "Earnings in $",
          data: [23, 45, 22, 20, 40, 59],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  // Doughnut Chart
  const ctx2 = document.getElementById("doughnut").getContext("2d");
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: ["Field", "Crop", "Staff", "Vehicle", "Equipment", "Log"],
      datasets: [
        {
          label: "System Data",
          data: [countField, countCrop, countStaff, countVehicle, countEquipment, countLog],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
