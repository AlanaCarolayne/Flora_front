const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

// Criando o server
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  // mostrar erros
  ws.on("error", console.error);

  // Processar mensagem recebida e enviar para todos os clientes conectados
  ws.on("message", (data) => {
    console.log("Mensagem recebida: " + data.toString());

    // Enviar a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {  
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

console.log("Servidor WebSocket rodando...");
