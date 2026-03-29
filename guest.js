const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));

//-if (!selectedRoom) {
  alert("Please select a room first");
  window.location.href = "room.html";
}
document.addEventListener("DOMContentLoaded", () => {
  roomNumber.value = selectedRoom.number;
  roomType.value = selectedRoom.type;
  roomRate.value = selectedRoom.rate;
});

// Load guests on page load
document.addEventListener("DOMContentLoaded", renderGuests);

function saveGuest() {
  const fname = txtFName.value.trim();
  const mname = txtMName.value.trim();
  const lname = txtLName.value.trim();
  const address = txtAddress.value.trim();
  const number = txtNumber.value.trim();
  const email = txtEmail.value.trim();
  const gender = cboGender.value;

  const status = "Active";
  const remarks = "Available";

  if (!fname || !mname || !lname || !address || !number) {
    alert("Please Fill All Fields");
    return;
  }
const guest = {
  id: Date.now(),
  fname,
  mname,
  lname,
  address,
  number,
  email,
  gender,
  status: "Checked-In",
  roomNumber: selectedRoom.number,
  roomRate: selectedRoom.rate
};


  const guests = JSON.parse(localStorage.getItem("tblGuest")) || [];
  guests.push(guest);
  localStorage.setItem("tblGuest", JSON.stringify(guests));
// MARK ROOM AS OCCUPIED
let rooms = JSON.parse(localStorage.getItem("tblRoom")) || [];
rooms = rooms.map(r =>
  r.number === selectedRoom.number
    ? { ...r, status: "Occupied" }
    : r
);
localStorage.setItem("tblRoom", JSON.stringify(rooms));

// CLEAR SELECTED ROOM
localStorage.removeItem("selectedRoom");

  alert("Guest Added!");
  clearForm();
  renderGuests();
}

function renderGuests() {
  const guests = JSON.parse(localStorage.getItem("tblGuest")) || [];
  const table = document.getElementById("guestTable");
  table.innerHTML = "";

  guests.forEach(g => {
    const row = `
      <tr>
        <td>${g.id}</td>
        <td>${g.fname}</td>
        <td>${g.mname}</td>
        <td>${g.lname}</td>
        <td>${g.address}</td>
        <td>${g.number}</td>
        <td>${g.status}</td>
      </tr>`;
    table.innerHTML += row;
  });
}

function clearForm() {
  txtFName.value = "";
  txtMName.value = "";
  txtLName.value = "";
  txtAddress.value = "";
  txtNumber.value = "";
  txtEmail.value = "";
  cboGender.value = "";
}
const user = localStorage.getItem("loggedInUser");
if (user !== "admin") {
  alert("Access denied");
  window.location.href = "index.html";
}
