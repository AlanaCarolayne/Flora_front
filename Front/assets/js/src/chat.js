const btnShowChat = document.querySelectorAll("#chat-user");
userLogin = JSON.parse(localStorage.getItem("userLogado"));
users = JSON.parse(localStorage.getItem("users"));
const showChat = document.querySelector(".chat");
const chatListUl = document.querySelector(".chat-list-ul");
const chatList = document.querySelector(".chat-list");
const chatMessages = document.querySelector(".chat-messages");
const formChat = document.querySelector("#form-chat");
const showListChat = document.querySelector("#show-list-chat");

let currentChatUser = null; 

window.onload = () => {
  ws = new WebSocket("ws://localhost:8080");
  ws.onopen = () => {
    console.log("Conexão WebSocket estabelecida");
  };
  ws.onmessage = processMessageChat;

  // Restaurar mensagens do localStorage para o usuário atual
  loadMessages(currentChatUser);
};

// Função para salvar as mensagens no localStorage para o usuário específico
const saveMessageLocally = (messageUserChat) => {
  const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || {};
  const chatWithUser = currentChatUser;

  if (!savedMessages[chatWithUser]) {
    savedMessages[chatWithUser] = [];
  }
  savedMessages[chatWithUser].push(messageUserChat);

  localStorage.setItem("chatMessages", JSON.stringify(savedMessages));
};

// Função para carregar as mensagens salvas do localStorage
const loadMessages = (userId) => {
  chatMessages.innerHTML = ""; 
  const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || {};
  
  if (savedMessages[userId]) {
    savedMessages[userId].forEach(({ id, mensagem }) => {
      const message =
        userLogin.id === id
          ? createMessageChat(mensagem)
          : createMessageChatOtherUser(mensagem);
      chatMessages.appendChild(message);
    });
  }
};

// Criando a mensagem do usuário conectado no chat
const createMessageChat = (content) => {
  const div = document.createElement("div");
  div.classList.add("div-message-right");
  div.innerHTML = `<p class="message-right">${content}</p>`;
  return div;
};

// Criando a mensagem do outro usuário no chat
const createMessageChatOtherUser = (content) => {
  const div = document.createElement("div");
  div.classList.add("div-message-left");
  div.innerHTML = `<p class="message-left">${content}</p>`;
  return div;
};

const processMessageChat = ({ data }) => {
  const { id, mensagem } = JSON.parse(data);
  const message =
    userLogin.id === id
      ? createMessageChat(mensagem)
      : createMessageChatOtherUser(mensagem);

  chatMessages.appendChild(message);

  // Salvar mensagem recebida no localStorage
  saveMessageLocally({ id, mensagem });
};

chatListUl.innerHTML = '';

users.forEach(user => {
  if (userLogin.id !== user.id) { 
    // Cria um novo botão para cada usuário
    const li = document.createElement("li");
    const button = document.createElement('button');
    button.classList.add('chat-list-item');
    button.innerHTML = ` 
      <img src="../assets/images/user.png" alt="user">
      <div class="chat-list-info">
        <h4>${user.nome}</h4>
        <p>Converse com ${user.nome}</p>
      </div>`;

    button.addEventListener("click", () => {
      chatList.style.display = "none";
      showChat.style.display = "block";

       document.querySelector("#username-chat").textContent = user.nome;
   
      
      const nivelChat = document.querySelector("#nivel-chat");
      nivelChat.textContent = `Consultora ${user.nivel}`;

      currentChatUser = user.id; 
      loadMessages(currentChatUser); 
    });

    li.appendChild(button);
    chatListUl.appendChild(li);
  }
});

showListChat.addEventListener("click", () => {
  chatList.style.display = "block";
  showChat.style.display = "none";
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const msgChat = document.querySelector("#message-chat").value;
  if (ws && ws.readyState === ws.OPEN) {
    const messageUserChat = {
      id: userLogin.id,
      nome: userLogin.nome,
      mensagem: msgChat,
      idMensagem: crypto.randomUUID(),
      nivel: userLogin.nivel
    };
    
    // Enviar a mensagem via WebSocket
    ws.send(JSON.stringify(messageUserChat));
    
    // Adicionar a mensagem ao chat e limpar o input
    // chatMessages.appendChild(createMessageChat(msgChat));
    document.querySelector("#message-chat").value = "";
    
    // Salvar a mensagem localmente
    saveMessageLocally(messageUserChat);
  } else {
    console.error("WebSocket não está aberto.");
  }
});
