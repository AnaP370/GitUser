const btBuscar = document.querySelector(".sectionBuscar button");
const inputBuscar = document.querySelector(".sectionBuscar input");
const mainContainer = document.querySelector(".section-input");
const containerSection = document.querySelector(".box");

const url = "https://api.github.com/users/"; // URL correcta de GitHub

btBuscar.addEventListener("click", buscarUser);

function buscarUser(e) {
  e.preventDefault();

  if (inputBuscar.value === "") {
    mostrarError("Escriba un usuario de GitHub...");
    return;
  }
  callApiUser(inputBuscar.value);
}

async function callApiUser(user) {
  const userUrl = url + user;
  const repoUrl = `${url}${user}/repos`;

  try {
    const data = await Promise.all([fetch(userUrl), fetch(repoUrl)]);
    if (data[0].status === 404) {
      mostrarError("No existe el usuario...");
      return;
    }
    const dataUser = await data[0].json();
    const dataRepo = await data[1].json();

    mostrarData(dataUser);
    mostrarRepos(dataRepo);
  } catch (error) {
    console.log(error);
    mostrarError("Error al obtener la información.");
  }
}

function mostrarData(dataUser) {
  clearHTML();
  const { avatar_url, bio, followers, following, name, public_repos } = dataUser;
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="columnaiz">
      <img src="${avatar_url}" alt="user image"/>
    </div>
    <div class="columnaderecha">
      <h3>${name ? name : "Nombre no disponible"}</h3>
      <p>${bio ? bio : "Bio no disponible"}</p>
      <h4>Información de perfil</h4>
      <p>${followers} <span>Followers</span></p>
      <p>${following} <span>Following</span></p>
      <p>${public_repos} <span>Repos</span></p>
    </div>
    <div class="link-repos">
      <h4>REPOSITORIOS</h4>
    </div>
  `;
  containerSection.appendChild(container);
}

function mostrarRepos(repos) {
  const reposContainer = document.querySelector(".link-repos");
  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((element) => {
      const link = document.createElement("a");
      link.innerText = element.name;
      link.href = element.html_url;
      link.target = "_blank";
      reposContainer.appendChild(link);
    });
}

function mostrarError(mensaje) {
  clearHTML();
  const error = document.createElement("h5");
  error.innerText = mensaje;
  error.style.color = "red";
  mainContainer.appendChild(error);
  setTimeout(() => error.remove(), 3000);
}

function clearHTML() {
  containerSection.innerHTML = "";
}
