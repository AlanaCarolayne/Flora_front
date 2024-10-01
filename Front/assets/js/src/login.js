
const formLogin = document.querySelector("#form-login");
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email-login").value;
    const senha = document.querySelector("#password-login").value;
    const feedback = document.querySelector("#feedback-login");

    // Encontrar o usuário
    userLogado = users.find(user => user.email === email);

    if (!userLogado) {
        feedback.style.display = "block";
        feedback.textContent = "Conta não encontrada, favor verificar dados ou realizar cadastro!";
    } else if (userLogado.senha !== senha) {
        feedback.style.display = "block";
        feedback.textContent = "Senha incorreta. Verifique novamente";
    } else {
        feedback.style.display = "none";

        localStorage.setItem('userLogado', JSON.stringify(userLogado));
        window.location.href = "forum.html";
  
    }
});