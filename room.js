const SHEET_API = "https://script.google.com/macros/s/AKfycbyFPVN3wnwFMLK7NfgSqvlGB5Wy4efYFXTs7Bzgp_ToNoLKwni00iud0-HiCZ1K-AKk/exec";
// EMPLOYEE ONLY ACCESS
const user = localStorage.getItem("loggedInUser");
if (user !== "employee") {
  alert("Access denied");
  window.location.href = "dashboard.html";
}

let data = [];

fetch(SHEET_API)
  .then(res => res.json())
  .then(rows => {
    data = rows.map(r => ({
      id: r[0],
      type: r[1],
      rate: r[2],
      status: r[3]
    }));
    renderSheet();
  });
;fetch(SHEET_API, {
  method: "POST",
  body: JSON.stringify(
    data.map(d => [d.id, d.type, d.rate, d.status])
  )
});


// LOAD ROOMS
document.addEventListener("DOMContentLoaded", displayRooms);

function getRooms() {
  return JSON.parse(localStorage.getItem("tblRoom")) || [];
}
//display rooms
function displayRooms() {
  const rooms = getRooms();
  const table = document.getElementById("roomTable");
  table.innerHTML = "";

  rooms.forEach(room => {
    const disabled = room.status === "Occupied" ? "disabled" : "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${room.id}</td>
      <td>${room.number}</td>
      <td>${room.type}</td>
      <td>${room.rate}</td>
      <td>${room.occupancy}</td>
      <td>
        <button ${disabled} onclick='selectRoom(${JSON.stringify(room)})'>
          Select
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}


// SAVE / UPDATE ROOM
function saveRoom() {
  const number = txtID.value.trim();
  const type = txtRoomType.value.trim();
  const rate = txtRoomRate.value.trim();
  const occupancy = txtNoOfOccupancy.value.trim();
  const status = "Available";

  if (!number || !type || !rate || !occupancy) {
    alert("Please Fill All Fields");
    return;
  }

  let rooms = getRooms();

  // SAVE MODE
  if (editId === null) {
    const exists = rooms.some(r => r.number === number);
    if (exists) {
      alert("Room Number Existed!");
      return;
    }

    rooms.push({
      id: Date.now(),
      number,
      type,
      rate,
      occupancy,
      status
    });

    alert("Room Added!");
  }
  // UPDATE MODE
  else {
    rooms = rooms.map(r =>
      r.id === editId
        ? { ...r, number, type, rate, occupancy }
        : r
    );

    alert("Room Saved!");
    editId = null;
    bttnSave.textContent = "Save";
  }

  localStorage.setItem("tblRoom", JSON.stringify(rooms));
  clearRoomForm();
  displayRooms();
}

// LOAD ROOM INTO FORM (DOUBLE CLICK)
function loadRoom(room) {
  if (!confirm("Update selected Item?")) return;

  editId = room.id;
  txtID.value = room.number;
  txtRoomType.value = room.type;
  txtRoomRate.value = room.rate;
  txtNoOfOccupancy.value = room.occupancy;
  bttnSave.textContent = "Update";
}

// CANCEL BUTTON
function clearRoomForm() {
  txtID.value = "";
  txtRoomType.value = "";
  txtRoomRate.value = "";
  txtNoOfOccupancy.value = "";
  editId = null;
  bttnSave.textContent = "Save";
}

// SEARCH ROOM
function searchRooms() {
  const keyword = searchRoom.value.toLowerCase();
  const rows = document.querySelectorAll("#roomTable tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(keyword)
      ? ""
      : "none";
  });
}
function selectRoom(room) {
  localStorage.setItem("selectedRoom", JSON.stringify(room));
  window.location.href = "guest.html";
}

