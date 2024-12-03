const ctx = document.getElementById("doughnut").getContext("2d");

new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Field", "Crop", "Staff", "Vehicle", "Equipment", "User"],
    datasets: [
      {
        label: "System Data",
        data: [25, 45, 22, 10, 40, 15],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
  },
});
