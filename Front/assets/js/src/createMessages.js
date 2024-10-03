//criando o post do forum
function createPost(nome, mensagem, idMensagem, nivel) {
  const post = document.createElement("div");
  post.classList.add("post");
  post.setAttribute("data-id", idMensagem);
  post.innerHTML = `

  <div class="post-header">
    <div class="post-info">
      <img src="../assets/images/user.png" alt="User" class="post-img">
      <div>
        <a href= "perfilConsultora.html"class="post-name">${nome}</a>
        <h4 class="post-level">Consultora ${nivel}</h4>
        <h4 class="post-time">Há 1h</h4>
      </div>
      <button class="post-btn-follow">Seguir <i class="bi bi-plus-circle icon-post"></i></button>
    </div>
  </div>

  <p class="post-text">${mensagem}</p>

  <div class="post-btns">
    <button class="post-btn-like" id="like-post"><i class="bi bi-heart icon-post"></i>Curtir</button>
  </div>

  <div class="comments-container" id="comments-${idMensagem}"></div>

             `;

  const btnCurtir = post.querySelector(".post-btn-like");
  btnCurtir.addEventListener("click", () => {

    if (btnCurtir.innerHTML.includes("Curtido")) {

      btnCurtir.innerHTML = `<i class="bi bi-heart icon-post"></i> Curtir`;
    } else {
   
      btnCurtir.innerHTML = `<i class="bi bi-heart-fill icon-post"></i> Curtido`;
    }
  });

  const btnSeguir = post.querySelector(".post-btn-follow");
  btnSeguir.addEventListener("click", () => {
   
    if (btnSeguir.innerHTML.includes("Seguindo")) {
 
      btnSeguir.innerHTML = `Seguir <i class="bi bi-plus-circle icon-post"></i>`;
    } else {
  
      btnSeguir.innerHTML = `Seguindo <i class="bi bi-check-circle icon-post"></i>`;
    }
  });


  return post;
}

// criando os comentarios do forum
function createComment(nome, comentario) {
  const comment = document.createElement("div");
  comment.classList.add("comment-post");
  comment.innerHTML = `
        <div class="header-comment-post">
          <img src="../assets/images/user.png" alt="Imagem do usuário">
          <h5>${nome}</h5>
        </div>
        <p>${comentario}</p>
      
  `;
  return comment;
}
