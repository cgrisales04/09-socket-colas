// Referencias del HTML
const lblNuevoTicket = document.getElementById("lblNuevoTicket");
const btnCrear = document.getElementById("btnGenerarTicket");

const socket = io();

socket.on("connect", () => {
  socket.on("ultimo-ticket", (ultimo) => {
    lblNuevoTicket.innerText = "Ticket " + ultimo;
  });
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

btnCrear.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
  socket.emit("ticket-cola-generado", null, (ticket) =>{});
});
