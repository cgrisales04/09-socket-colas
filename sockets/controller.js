const TicketControl = require("../models/ticket-control");
const ticket_control = new TicketControl();

const socketController = (socket) => {
  socket.emit("ultimo-ticket", ticket_control.ultimo);
  socket.emit("estado-actual", ticket_control.ultimos4);
  socket.emit("ticket-cola", ticket_control.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticket_control.siguiente();
    callback(siguiente);

    //TODO: Notificar que hay un ticket pendiente de asignar
  });

  socket.on("ticket-cola-generado", (payload, callback) => {
    socket.broadcast.emit("ticket-cola", ticket_control.tickets.length);
    callback(ticket_control.tickets.length);
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticket_control.atenderTicket(escritorio);
    socket.broadcast.emit("estado-actual", ticket_control.ultimos4);

    if (!ticket) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
