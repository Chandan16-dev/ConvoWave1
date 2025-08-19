const socket = io();
let currentRoom = null;

// Room join hone pe server se confirm
socket.on("joined", (roomId) => {
  currentRoom = roomId;
  document.getElementById("status").innerText = "Connected ✅";
});

// Stranger disconnect hone pe status dikhana
socket.on("stranger-disconnected", () => {
  document.getElementById("status").innerText = "Stranger Left ❌";
});

// Jab message aaye to chat-box me show karo
socket.on("message", ({ text, sender }) => {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg");

  if (sender === socket.id) {
    msgDiv.innerHTML = `<b>You:</b> ${text}`;
    msgDiv.classList.add("me");
  } else {
    msgDiv.innerHTML = `<b>Stranger:</b> ${text}`;
    msgDiv.classList.add("stranger");
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send button pe click → message bhejna
document.getElementById("send").addEventListener("click", () => {
  sendMessage();
});

// Enter press → message bhejna
document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Message bhejne ka function
function sendMessage() {
  const input = document.getElementById("message");
  if (input.value.trim() !== "" && currentRoom) {
    socket.emit("message", { roomId: currentRoom, text: input.value });
    input.value = "";
  }
}
