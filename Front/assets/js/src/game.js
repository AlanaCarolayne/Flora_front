const trilhasGame = trilhas;
console.log(trilhasGame);

userLogin = JSON.parse(localStorage.getItem("userLogado"));
const nivelTrilhaNome = document.querySelector("#nivel-nome-trilha");
const criandoNiveis = document.querySelector("#niveis-jogaveis");

let btnMap = new Map();
nivelTrilhaNome.innerHTML = `<h2>Nível ${userLogin.nivel}</h2>`;

const handleButtonClick = (nivel, btnNivel) => {
  const modalTitle = document.querySelector("#dynamicModalLabel");
  const modalDescription = document.querySelector("#modal-description");
  const modalAlternatives = document.querySelector("#modal-alternatives");

  modalTitle.textContent = `Nível ${nivel.id_nivel}`;
  modalDescription.textContent = nivel.descricao;
  modalAlternatives.innerHTML = "";

  nivel.alternativas.forEach((alternativa) => {
    const btnAlternative = document.createElement("button");
    btnAlternative.classList.add("btn", "btn-secondary");
    btnAlternative.textContent = alternativa;

    btnAlternative.addEventListener("click", () => {
      if (btnAlternative.textContent === nivel.correta) {
        let pontos = Math.floor(Math.random() * 5) + 1;
        userLogin.pontosRanking = (userLogin.pontosRanking || 0) + pontos;
        console.log(userLogin.pontosRanking);
        users = users.map((user) =>
          user.email === userLogin.email
            ? { ...user, pontosRanking: userLogin.pontosRanking }
            : user
        );
        localStorage.setItem("users", JSON.stringify(users));

        const modal = bootstrap.Modal.getInstance(
          document.querySelector("#modal1")
        );
        modal.hide();
        const modalParabens = new bootstrap.Modal(
          document.querySelector("#modalParabens")
        );
        document.querySelector("#modal-congrats").innerHTML = `
          <h2>Você acertou!</h2>
          <h3>Ganhou ${pontos} pontos</h3>
        `;

        btnNivel.classList.remove("btn-trilha-incomplete");
        btnNivel.classList.add("btn-trilha-complete");
        btnNivel.innerHTML = '<i class="bi bi-star-fill icon-trilha"></i>';
        btnNivel.disabled = true;

      

        modalParabens.show();
      } else {
        console.log("burro");
        const modal = bootstrap.Modal.getInstance(
          document.querySelector("#modal1")
        );
        modal.hide();
        const modalErrou = new bootstrap.Modal(
          document.querySelector("#modalErrou")
        );
        modalErrou.show();
      }
    });
    modalAlternatives.appendChild(btnAlternative);
  });
};

trilhasGame.forEach((trilha) => {
  const trilhaContainer = document.createElement("div");
  trilhaContainer.innerHTML = `<h3> Módulo ${trilha.id_trilha} - ${trilha.nome}</h3>`;

  trilha.niveis.forEach((nivel) => {
    const btnNivel = document.createElement("button");
    btnNivel.classList.add("btn-trilha-incomplete", "btn-muda-posicao");
    btnNivel.innerHTML = '<i class="bi bi-star icon-trilha"></i>';
    btnNivel.setAttribute("data-bs-toggle", "modal");
    btnNivel.setAttribute("data-bs-target", "#modal1");

  console.log(userLogin);
    btnMap.set(nivel.id_nivel, btnNivel);

    btnNivel.addEventListener("click", () =>
      handleButtonClick(nivel, btnNivel)
    );

    trilhaContainer.appendChild(btnNivel);
  });

  criandoNiveis.appendChild(trilhaContainer);
});
