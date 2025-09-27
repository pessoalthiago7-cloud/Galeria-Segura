/* ---------------- USUÁRIOS ---------------- */
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
let galerias = JSON.parse(localStorage.getItem("galerias")) || {};
let usuarioLogado = null;

/* ---------------- LOGIN ---------------- */
const loginBox = document.getElementById("loginBox");
const cadastroBox = document.getElementById("cadastroBox");
const loginBtn = document.getElementById("loginBtn");
const showCadastroBtn = document.getElementById("showCadastroBtn");
const voltarLoginBtn = document.getElementById("voltarLoginBtn");

loginBtn.addEventListener("click", () => {
  const user = document.getElementById("usuarioLogin").value.trim();
  const pass = document.getElementById("senhaLogin").value;
  if(usuarios[user] && usuarios[user] === pass){
    usuarioLogado = user;
    carregarGaleriaUsuario();
    loginBox.style.display="none";
    document.getElementById("conteudo-galeria").style.display="block";
  } else {
    document.getElementById("error-msg").textContent="Usuário ou senha incorretos";
  }
});

showCadastroBtn.addEventListener("click", () => {
  loginBox.style.display="none";
  cadastroBox.style.display="block";
});

voltarLoginBtn.addEventListener("click", () => {
  cadastroBox.style.display="none";
  loginBox.style.display="block";
});

/* ---------------- CADASTRO ---------------- */
document.getElementById("cadastroBtn").addEventListener("click", () => {
  const user = document.getElementById("usuarioCadastro").value.trim();
  const pass = document.getElementById("senhaCadastro").value;
  if(!user || !pass){
    document.getElementById("cadError-msg").textContent="Preencha todos os campos";
    return;
  }
  if(usuarios[user]){
    document.getElementById("cadError-msg").textContent="Usuário já existe";
    return;
  }
  usuarios[user] = pass;
  galerias[user] = { fotos: [], videos: [] };
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("galerias", JSON.stringify(galerias));
  cadastroBox.style.display="none";
  loginBox.style.display="block";
  document.getElementById("cadError-msg").textContent="";
});

/* ---------------- GALERIA ---------------- */
const galeriaFotos = document.getElementById("galeriaFotos");
const galeriaVideos = document.getElementById("galeriaVideos");
const uploadBtn = document.getElementById("uploadBtn");
const uploadInput = document.getElementById("uploadInput");
const protegerCheck = document.getElementById("protegerCheck");

let items = [];
let currentIndex = 0;

/* Carrega a galeria do usuário logado */
function carregarGaleriaUsuario(){
  galeriaFotos.innerHTML = "";
  galeriaVideos.innerHTML = "";
  items = [];

  const userGaleria = galerias[usuarioLogado];
  if(!userGaleria) return;

  userGaleria.fotos.forEach(f => adicionarItem("img", f.url, f.protegido));
  userGaleria.videos.forEach(f => adicionarItem("video", f.url, f.protegido));
}

/* ---------------- ADICIONAR ITEM ---------------- */
function adicionarItem(tipo, url, protegido){
  let wrapper = document.createElement("div");
  wrapper.className = tipo==="img" ? "img-wrapper" : "video-wrapper";
  if(protegido) wrapper.classList.add("blur");

  if(tipo==="img"){
    const img = document.createElement("img");
    img.src = url; img.alt = "Foto";
    wrapper.appendChild(img);
    galeriaFotos.appendChild(wrapper);
  } else {
    const video = document.createElement("video");
    video.preload="metadata";
    const source = document.createElement("source");
    source.src = url; source.type="video/mp4";
    video.appendChild(source);
    wrapper.appendChild(video);
    galeriaVideos.appendChild(wrapper);
  }

  items.push(wrapper);
  wrapper.addEventListener("click", ()=>abrirModal(items.indexOf(wrapper)));
}

/* ---------------- CONVERTER ARQUIVO PARA BASE64 ---------------- */
function fileToBase64(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/* ---------------- UPLOAD ---------------- */
uploadBtn.addEventListener("click", ()=> uploadInput.click());
uploadInput.addEventListener("change", async (event)=>{
  const files = Array.from(event.target.files);
  const proteger = protegerCheck.checked;

  for(const file of files){
    const base64 = await fileToBase64(file);
    const tipo = file.type.startsWith("image") ? "img" : "video";
    adicionarItem(tipo, base64, proteger);

    if(tipo==="img") galerias[usuarioLogado].fotos.push({url:base64, protegido:proteger});
    else galerias[usuarioLogado].videos.push({url:base64, protegido:proteger});
  }

  localStorage.setItem("galerias", JSON.stringify(galerias));
  uploadInput.value="";
});

/* ---------------- MODAL ---------------- */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("imgModal");
const modalVideo = document.querySelector(".modal-video");
const captionText = document.getElementById("caption");
const fecharBtn = document.querySelector(".fechar");

function abrirModal(index){
  const item = items[index];
  currentIndex = index;

  modal.classList.add("active");
  modalImg.style.display="none";
  modalVideo.style.display="none";

  if(item.classList.contains("blur")){
    const userPin = prompt("Digite a senha para visualizar este item:");
    if(userPin !== "1234") return;
    item.classList.remove("blur");
  }

  if(item.classList.contains("img-wrapper")){
    modalImg.src = item.querySelector("img").src;
    modalImg.style.display="block";
    captionText.textContent = "Foto";
  } else {
    const video = item.querySelector("video");
    modalVideo.src = video.querySelector("source").src;
    modalVideo.style.display="block";
    modalVideo.play();
    captionText.textContent = "Vídeo";
  }
}

function fecharModal(){
  modal.classList.remove("active");
  modalVideo.pause();
  modalVideo.currentTime=0;
}

function mostrarProximo(){ abrirModal((currentIndex+1)%items.length); }
function mostrarAnterior(){ abrirModal((currentIndex-1+items.length)%items.length); }

fecharBtn.addEventListener("click", fecharModal);
document.addEventListener("keydown", e=>{
  if(!modal.classList.contains("active")) return;
  if(e.key==="Escape") fecharModal();
  else if(e.key==="ArrowRight") mostrarProximo();
  else if(e.key==="ArrowLeft") mostrarAnterior();
});

/* ---------------- TOGGLE THEME ---------------- */
const themes = ["dark","gray","light"];
let themeIndex = 0;
document.getElementById("toggleTheme").addEventListener("click", ()=>{
  themeIndex = (themeIndex+1)%themes.length;
  document.body.className = themes[themeIndex];
});
