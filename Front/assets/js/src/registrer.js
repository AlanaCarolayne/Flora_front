const form = document.querySelector("#form-cadastro");

// salvando os usuarios no localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  const selectBox = document.querySelector("#selectBox");

  if (password === confirmPassword) {
    const newUser = {
      id: crypto.randomUUID(),
      nome: document.querySelector("#name").value,
      sobrenome: document.querySelector("#last-name").value,
      email: document.querySelector("#email").value,
      senha: password,
      login: document.querySelector("#username").value,
      nivel: selectBox.options[selectBox.selectedIndex].value,
      pontosRanking: "",
    };

    users.push(newUser);
    document.querySelector(".alert-password").style.display = "none";

    try {
      localStorage.setItem("users", JSON.stringify(users));
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao salvar usuários no localStorage:", error);
    }

  } else {
    document.querySelector(".alert-password").style.display = "block";
  }
});

window.addEventListener("load", () => {
  users = JSON.parse(localStorage.getItem("users")) || [];
});
