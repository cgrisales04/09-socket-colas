//Referencias HTML
const lblEscritorio = document.getElementById("lblEscritorio");
const btnAtender = document.getElementById("btnAtender");
const lblTicket = document.getElementById("lblTicket");
const divAlerta = document.getElementById("divAlerta");
const lblTicketPendiente = document.getElementById("lblTicketPendiente");

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("ticket-cola", (total_tickets_pendientes) => {
  lblTicketPendiente.innerHTML = total_tickets_pendientes;
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie.";
      return (divAlerta.style.display = "");
    }
    lblTicket.innerText = `Ticket ${ticket.numero}`;
  });

  socket.emit("ticket-cola-generado", null, (total_tickets_pendientes) => {
    lblTicketPendiente.innerHTML = total_tickets_pendientes;
  });
});
