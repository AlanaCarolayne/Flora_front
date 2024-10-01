let ws;
let reconnectInterval = 5000; // Tempo para tentar reconectar (3 segundos)

// Função para criar e conectar WebSocket
const connectWebSocket = ()=> {
    ws = new WebSocket("wss://flora-tvxk.onrender.com");

    // Evento quando a conexão for aberta
    ws.onopen = () => {
        console.log("Conexão WebSocket estabelecida");
    };

    // Evento quando receber uma mensagem do servidor
    ws.onmessage = processMessage;

    // Evento de erro
    ws.onerror = (error) => {
        console.error("Erro na conexão WebSocket:", error);
    };

    // Evento quando a conexão for fechada
    ws.onclose = () => {
        console.log("Conexão WebSocket fechada. Tentando reconectar...");
        setTimeout(() => {
            console.log("Tentando reconectar...");
            connectWebSocket(); // Tentar reconectar
        }, reconnectInterval); // Espera 3 segundos antes de tentar reconectar
    };
}