userLogin = JSON.parse(localStorage.getItem("userLogado"));
users = JSON.parse(localStorage.getItem("users"));
console.log(userLogin.pontosRanking);

const title = document.querySelector("#ranking-title");
const rankingRow = document.querySelector("#rank-header");

title.textContent = `Ranking - Nível ${userLogin.nivel}`;


const filteredUsers = users.filter(user => user.nivel === userLogin.nivel);


filteredUsers.sort((a, b) => (Number(b.pontosRanking) || 0) - (Number(a.pontosRanking) || 0));

rankingRow.innerHTML = '';

filteredUsers.forEach((user, index) => {
  rankingRow.innerHTML += `
    <div class="rank-row">
      <h2 style="margin-left: 1vw;">${index + 1}°</h2>
      <img src="../assets/images/user.png" alt="User" class="rank-img" style="margin-left: 1vw;">
      <h2 style="margin-left: 1vw;">${user.nome}</h2>
      <h4 class="points">${user.pontosRanking || 0} pontos</h4>
    </div>`;
});
