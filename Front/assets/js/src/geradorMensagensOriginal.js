document.addEventListener("DOMContentLoaded", () => {
    const formModal = document.querySelector("#form-modal");
    const postsContainer = document.querySelector(".posts");
    const userLogin = JSON.parse(localStorage.getItem("userLogado"));
    const showComments = document.querySelector("#show-comments");
    let ws;
  
    if (userLogin) {
      console.log(userLogin);
    } else {
      console.log("Usuário não logado.");
    }
  
    // Conectando no servidor WebSocket quando a página carrega
    window.onload = () => {
      ws = new WebSocket("wss://flora-tvxk.onrender.com");
  
      ws.onopen = () => {
        console.log("Conexão WebSocket estabelecida");
      };
  
      ws.onmessage = processMessage;
    };
  
    // Processando e criando a mensagem
    const processMessage = ({ data }) => {
      const { idUsuario, nome, mensagem, idMensagem, nivel, tipo } = JSON.parse(data);
      let element;
      if (tipo === "comentario") {
        const commentSection = document.querySelector(#comments-${idMensagem});
        element = createComment(nome, mensagem);
  
        if (commentSection) {
          commentSection.appendChild(element);
        } else {
          console.error(Comentário não pôde ser adicionado. Seção de comentários com ID #comments-${idMensagem} não encontrada.);
        }
      } else if (tipo === "post") {
        element = createPost(nome, mensagem, idMensagem, nivel);
        postsContainer.appendChild(element);
      }
    };
  
    // Enviando mensagens para o fórum pelo servidor
    formModal.addEventListener("submit", (e) => {
      e.preventDefault();
      const mensagem = document.querySelector("#create-post").value;
  
      if (ws && ws.readyState === WebSocket.OPEN) {
        const messageUser = {
          id: userLogin.id,
          nome: userLogin.nome,
          mensagem: mensagem,
          idMensagem: crypto.randomUUID(),
          nivel: userLogin.nivel,
          tipo: "post",
        };
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(messageUser);
        savePosts(posts);
  
        ws.send(JSON.stringify(messageUser));
      } else {
        console.error("WebSocket não está aberto.");
      }
  
      document.querySelector("#create-post").value = "";
    });
  
    // Adicionando comentários
    document.addEventListener("submit", (e) => {
      const targetForm = e.target.closest("form");
  
      if (targetForm && targetForm.matches("#form-add-comment")) {
        e.preventDefault();
  
        const postId = targetForm.closest(".post").getAttribute("data-id");
        const commentInput = document.querySelector(#comment-input-${postId});
        const comment = commentInput.value;
  
        console.log(Submitting comment for post ID: ${postId});
  
        if (ws && ws.readyState === WebSocket.OPEN) {
          const commentUser = {
            id: userLogin.id,
            nome: userLogin.nome,
            mensagem: comment,
            idMensagem: postId,
            tipo: "comentario",
          };
          const comments = JSON.parse(localStorage.getItem(comments-${postId})) || [];
          comments.push(commentUser);
          saveComments(postId, comments);
  
          ws.send(JSON.stringify(commentUser));
        } else {
          console.error("WebSocket não está aberto.");
        }
  
        commentInput.value = "";
        targetForm.style.display = "none";
      }
    });
  
    // Mostrar/ocultar seções de comentários
    showComments.addEventListener("click", () => {
      const commentSections = document.querySelectorAll(".comments-container");
      commentSections.forEach((section) => {
        section.style.display =
          section.style.display === "none" || section.style.display === ""
            ? "block"
            : "none";
      });
    });
  // Função para salvar posts no localStorage
  function savePosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
  }
  
  // Função para salvar comentários no localStorage
  function saveComments(postId, comments) {
    localStorage.setItem(comments-${postId}, JSON.stringify(comments));
  }
  
  console.log( localStorage.getItem("posts", JSON.stringify(posts)));
  
  
    // Recuperar e renderizar postagens e comentários armazenados
    const postsSalvos = JSON.parse(localStorage.getItem("posts")) || [];
    postsSalvos.forEach(post => {
      const postElement = createPost(post.nome, post.mensagem, post.idMensagem, post.nivel);
      postsContainer.appendChild(postElement);
  
      const comments = JSON.parse(localStorage.getItem(comments-${post.idMensagem})) || [];
      comments.forEach(comment => {
        const commentElement = createComment(comment.nome, comment.mensagem);
        const commentSection = document.querySelector(#comments-${post.idMensagem});
        if (commentSection) {
          commentSection.appendChild(commentElement);
        }
      });
    });
  });
 
  