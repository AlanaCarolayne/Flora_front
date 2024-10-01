const MyprofileName = document.querySelector(".myProfileName");  // Correto
const MyprofileRanking = document.querySelector(".my-ranking-profile"); // Corrija aqui

userLogin = JSON.parse(localStorage.getItem("userLogado"));

MyprofileName.textContent = `${userLogin.nome}`;
MyprofileRanking.textContent = `${userLogin.nivel}`;

