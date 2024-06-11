// script.js

document.addEventListener("DOMContentLoaded", function () {
  const individualDesksContainer = document.getElementById(
    "individualDesksContainer"
  );
  const teamDesksContainer = document.getElementById("teamDesksContainer");
  const bookingForm = document.getElementById("bookingForm");
  const summary = document.getElementById("summary");
  const membershipSelect = document.getElementById("membership");
  const deskTypeSelect = document.getElementById("deskType");
  const dashboard = document.getElementById("dashboard");

  const totalIndividualDesks = 10;
  const totalTeamDesks = 5;
  const deskState = {
    individual: Array(totalIndividualDesks).fill(false),
    team: Array(totalTeamDesks).fill(false),
  };

  const deskPrices = {
    basic: 10,
    premium: 15,
    executive: 20,
    team: 25,
  };

  const revenue = {
    basic: 0,
    premium: 0,
    executive: 0,
    team: 0,
  };

  function renderDesks() {
    individualDesksContainer.innerHTML = "";
    teamDesksContainer.innerHTML = "";

    deskState.individual.forEach((booked, index) => {
      const desk = document.createElement("div");
      desk.className = "desk";
      desk.textContent = `I${index + 1}`;
      if (booked) {
        desk.classList.add("booked");
      }
      desk.dataset.type = "individual";
      desk.dataset.index = index;
      individualDesksContainer.appendChild(desk);
    });

    deskState.team.forEach((booked, index) => {
      const desk = document.createElement("div");
      desk.className = "desk";
      desk.textContent = `T${index + 1}`;
      if (booked) {
        desk.classList.add("booked");
      }
      desk.dataset.type = "team";
      desk.dataset.index = index;
      teamDesksContainer.appendChild(desk);
    });
  }

  function calculateTotalCost(hours, membership, deskType) {
    let pricePerHour =
      deskType === "individual" ? deskPrices[membership] : deskPrices.team;
    let totalCost = pricePerHour * hours;
    if (hours > 3) {
      totalCost *= 0.9; // Apply 10% discount
    }
    return totalCost;
  }

  function updateRevenue(hours, membership, deskType) {
    let totalCost = calculateTotalCost(hours, membership, deskType);
    if (deskType === "individual") {
      revenue[membership] += totalCost;
    } else {
      revenue.team += totalCost;
    }
    renderDashboard();
  }

  function renderDashboard() {
    dashboard.innerHTML = `
              <h2>Revenue Dashboard</h2>
              <p>Basic Membership: $${revenue.basic.toFixed(2)}</p>
              <p>Premium Membership: $${revenue.premium.toFixed(2)}</p>
              <p>Executive Membership: $${revenue.executive.toFixed(2)}</p>
              <p>Team Desks: $${revenue.team.toFixed(2)}</p>
          `;
  }

  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const deskType = deskTypeSelect.value;
    const membership =
      deskType === "individual" ? membershipSelect.value : "team";
    const hours = parseInt(document.getElementById("hours").value, 10);

    const availableDesks = deskState[deskType];
    const deskIndex = availableDesks.findIndex((desk) => !desk);

    if (deskIndex === -1) {
      alert(`No available ${deskType} desks.`);
      return;
    }

    availableDesks[deskIndex] = true;
    renderDesks();
    updateRevenue(hours, membership, deskType);

    const totalCost = calculateTotalCost(hours, membership, deskType);
    summary.innerHTML = `
              <h2>Booking Summary</h2>
              <p>Name: ${name}</p>
              <p>Email: ${email}</p>
              <p>Desk Type: ${
                deskType.charAt(0).toUpperCase() + deskType.slice(1)
              }</p>
              <p>Desk Number: ${
                deskType.charAt(0).toUpperCase() + (deskIndex + 1)
              }</p>
              <p>Membership: ${
                membership.charAt(0).toUpperCase() + membership.slice(1)
              }</p>
              <p>Hours: ${hours}</p>
              <p>Total Cost: $${totalCost.toFixed(2)}</p>
          `;
  });

  deskTypeSelect.addEventListener("change", function () {
    if (deskTypeSelect.value === "individual") {
      membershipSelect.style.display = "block";
    } else {
      membershipSelect.style.display = "none";
    }
  });

  renderDesks();
  renderDashboard();
});
