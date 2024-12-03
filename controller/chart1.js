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

const ctx2 = document.getElementById("doughnut").getContext("2d");

new Chart(ctx2, {
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
