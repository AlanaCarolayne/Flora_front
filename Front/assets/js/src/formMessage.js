document.addEventListener("DOMContentLoaded", () => {
  const formModal = document.querySelector("#form-modal");
  userLogin = JSON.parse(localStorage.getItem("userLogado"));
  const postsContainer = document.querySelector(".posts");

  let ws;

  // iniciando o server
  initializeWebSocket();

  // mostrando os post antigos
  loadSavedPosts();

  // post
  formModal.addEventListener("submit", (e) => {
    e.preventDefault();
    const mensagem = document.querySelector("#create-post").value;
    if (!mensagem || !userLogin) return;

    const post = {
      id: userLogin.id,
      nome: userLogin.nome,
      mensagem: mensagem,
      idMensagem: crypto.randomUUID(),
      nivel: userLogin.nivel,
      tipo: "post",
    };

    // Envia o post para o server
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(post));
      savePost(post);
      renderPost(post);
    } else {
      console.error("WebSocket não está aberto.");
    }

    document.querySelector("#create-post").value = "";
  });

 

  function initializeWebSocket() {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      processMessage(data);
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };
  }

  // enviando mensagens para o server
  function processMessage(data) {
    if (data.tipo === "post") {
      if (!document.querySelector(`#post-${data.idMensagem}`)) {
        savePost(data);
        renderPost(data);
      }
    } else if (data.tipo === "comentario") {
      if (!isCommentSaved(data.idMensagem, data)) {
        saveComment(data.idMensagem, data);
        renderComment(data);
      }
    }
  }

  function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    if (!posts.some((p) => p.idMensagem === post.idMensagem)) {
      posts.push(post);
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }

  function loadSavedPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach((post) => {
      renderPost(post);
      loadSavedComments(post.idMensagem);
    });
  }

  function renderPost(post) {
    if (!document.querySelector(`#post-${post.idMensagem}`)) {
      const postElement = createPost(
        post.nome,
        post.mensagem,
        post.idMensagem,
        post.nivel
      );
      postElement.id = `post-${post.idMensagem}`;
      postsContainer.appendChild(postElement);

      const commentForm = createCommentForm(post.idMensagem);
      postElement.appendChild(commentForm);

      // criando os comentarios
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const commentInput = commentForm.querySelector(
          `#comment-input-${post.idMensagem}`
        );
        const commentText = commentInput.value;

        if (!commentText || !userLogin) return;

        const comment = {
          idMensagem: post.idMensagem, 
          nome: userLogin.nome,
          mensagem: commentText,
          tipo: "comentario",
        };

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(comment));
          saveComment(post.idMensagem, comment);
          renderComment(comment);
        } else {
          console.error("WebSocket não está aberto.");
        }

        commentInput.value = "";
      });
    }
  }

  function createCommentForm(idMensagem) {
    const form = document.createElement("form");
    form.classList.add("post-input-form");
    form.innerHTML = `
    
      <input type="text" name="comment" id="comment-input-${idMensagem}" placeholder="Escreva seu comentário...">
      <button type="submit"><i class="bi bi-send"></i></button>
    `;
    return form;
  }

  function saveComment(postId, comment) {
    const comments =
      JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];
    if (
      !comments.some(
        (c) => c.mensagem === comment.mensagem && c.nome === comment.nome
      )
    ) {
      comments.push(comment);
      localStorage.setItem(`comments-${postId}`, JSON.stringify(comments));
    }
  }

  function isCommentSaved(postId, comment) {
    const comments =
      JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];
    return comments.some(
      (c) => c.mensagem === comment.mensagem && c.nome === comment.nome
    );
  }

  function loadSavedComments(postId) {
    const comments =
      JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];
    comments.forEach((comment) => {
      if (!isCommentRendered(comment)) {
        renderComment(comment);
      }
    });
  }

  function isCommentRendered(comment) {
    const commentSection = document.querySelector(
      `#comments-${comment.idMensagem}`
    );
    if (commentSection) {
      return Array.from(commentSection.children).some(
        (c) => c.textContent === comment.mensagem
      );
    }
    return false;
  }

  function renderComment(comment) {
    const commentSection = document.querySelector(
      `#comments-${comment.idMensagem}`
    );
    if (commentSection) {
      const commentElement = createComment(comment.nome, comment.mensagem);
      commentSection.appendChild(commentElement);
    }
  }
});
