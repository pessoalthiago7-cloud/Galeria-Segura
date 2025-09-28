// ---------- Variáveis globais ----------
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
let usuarioAtual = localStorage.getItem('usuarioAtual') || null;

const loginBox = document.getElementById('loginBox');
const cadastroBox = document.getElementById('cadastroBox');
const esqueciBox = document.getElementById('esqueciBox');
const configBox = document.getElementById('configBox');
const conteudoGaleria = document.getElementById('conteudo-galeria');
const logoutBtn = document.getElementById('logoutBtn');
const configBtn = document.getElementById('configBtn');

// ---------- Funções auxiliares ----------
function showError(id, msg){
  const el = document.getElementById(id);
  el.textContent = msg;
  setTimeout(()=>el.textContent='',3000);
}

function salvarUsuarios(){
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function salvarUsuarioAtual(){
  if(usuarioAtual) localStorage.setItem('usuarioAtual', usuarioAtual);
  else localStorage.removeItem('usuarioAtual');
}

// ---------- Tema ----------
const toggleTheme = document.getElementById('toggleTheme');
toggleTheme.onclick = ()=>{
  if(document.body.classList.contains('dark')){
    document.body.className='light';
    toggleTheme.textContent='🌙';
  } else{
    document.body.className='dark';
    toggleTheme.textContent='🌑';
  }
};

// ---------- Mostrar / ocultar boxes ----------
document.getElementById('showCadastroBtn').onclick = ()=>{loginBox.style.display='none'; cadastroBox.style.display='block';};
document.getElementById('voltarLoginBtn').onclick = ()=>{cadastroBox.style.display='none'; loginBox.style.display='block';};
document.getElementById('esqueciSenhaBtn').onclick = ()=>{loginBox.style.display='none'; esqueciBox.style.display='block';};
document.getElementById('voltarLogin2Btn').onclick = ()=>{esqueciBox.style.display='none'; loginBox.style.display='block';};
configBtn.onclick = ()=>{conteudoGaleria.style.display='none'; configBox.style.display='block';};
document.getElementById('voltarGaleriaBtn').onclick = ()=>{configBox.style.display='none'; conteudoGaleria.style.display='block';};

// ---------- Cadastro ----------
document.getElementById('cadastroBtn').onclick = ()=>{
  const user = document.getElementById('usuarioCadastro').value.trim();
  const pass = document.getElementById('senhaCadastro').value.trim();
  const rg = document.getElementById('rgCadastro').value.trim();
  if(!user||!pass||!rg) return showError('cadError-msg','Preencha todos os campos!');
  if(usuarios[user]) return showError('cadError-msg','Usuário já existe!');
  usuarios[user]={senha:pass, rg:rg, arquivos:[]};
  salvarUsuarios();
  showError('cadError-msg','Cadastro realizado!');
  cadastroBox.style.display='none'; loginBox.style.display='block';
  document.getElementById('usuarioCadastro').value='';
  document.getElementById('senhaCadastro').value='';
  document.getElementById('rgCadastro').value='';
};

// ---------- Login ----------
document.getElementById('loginBtn').onclick = ()=>{
  const user = document.getElementById('usuarioLogin').value.trim();
  const pass = document.getElementById('senhaLogin').value.trim();
  if(usuarios[user] && usuarios[user].senha === pass){
    usuarioAtual=user;
    salvarUsuarioAtual();
    loginBox.style.display='none';
    conteudoGaleria.style.display='block';
    logoutBtn.style.display='inline-block';
    configBtn.style.display='inline-block';
    document.getElementById('usuarioLogin').value='';
    document.getElementById('senhaLogin').value='';
    carregarGaleria(); // Carregar arquivos do usuário
  }else showError('error-msg','Usuário ou senha incorretos!');
};

// ---------- Logout ----------
logoutBtn.onclick = ()=>{
  usuarioAtual=null;
  salvarUsuarioAtual();
  conteudoGaleria.style.display='none';
  loginBox.style.display='block';
  logoutBtn.style.display='none';
  configBtn.style.display='none';
};

// ---------- Esqueci senha ----------
document.getElementById('resetSenhaBtn').onclick = ()=>{
  const user=document.getElementById('usuarioRG').value.trim();
  const rg=document.getElementById('rgInput').value.trim();
  const novaSenha=document.getElementById('novaSenhaEsqueci').value.trim();
  if(!user||!rg||!novaSenha) return showError('esqueci-msg','Preencha todos os campos!');
  if(!usuarios[user]) return showError('esqueci-msg','Usuário não encontrado!');
  if(usuarios[user].rg!==rg) return showError('esqueci-msg','RG incorreto!');
  usuarios[user].senha=novaSenha;
  salvarUsuarios();
  showError('esqueci-msg','Senha redefinida com sucesso!');
  esqueciBox.style.display='none'; loginBox.style.display='block';
  document.getElementById('usuarioRG').value='';
  document.getElementById('rgInput').value='';
  document.getElementById('novaSenhaEsqueci').value='';
};

// ---------- Alterar senha (senha atual necessária) ----------
document.getElementById('trocarSenhaBtn').onclick = () => {
  const atual = document.getElementById('senhaAtual').value.trim();
  const nova = document.getElementById('novaSenha').value.trim();

  if (!atual || !nova) return showError('config-msg', 'Preencha todos os campos!');
  if (usuarios[usuarioAtual].senha !== atual) return showError('config-msg', 'Senha atual incorreta!');

  usuarios[usuarioAtual].senha = nova;
  salvarUsuarios();
  showError('config-msg', 'Senha alterada com sucesso!');
  document.getElementById('senhaAtual').value='';
  document.getElementById('novaSenha').value='';
};

// ---------- Galeria e upload ----------
const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const previewArea = document.getElementById('previewArea');
const previewGrid = document.getElementById('previewGrid');
const protegerCheck = document.getElementById('protegerCheck');
const senhaArquivoInput = document.getElementById('senhaArquivo');
const confirmUploadBtn = document.getElementById('confirmUploadBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');
const galeriaFotos = document.getElementById('galeriaFotos');
const galeriaVideos = document.getElementById('galeriaVideos');

protegerCheck.addEventListener('change',()=>{senhaArquivoInput.style.display=protegerCheck.checked?'block':'none';});
uploadBtn.onclick = ()=>uploadInput.click();

uploadInput.onchange = ()=>{
  previewGrid.innerHTML='';
  if(!uploadInput.files.length) return;
  previewArea.style.display='block';
  Array.from(uploadInput.files).forEach(file=>{
    const url=URL.createObjectURL(file);
    const wrapper=document.createElement('div');
    wrapper.classList.add(file.type.startsWith('image')?'img-wrapper':'video-wrapper');
    wrapper.dataset.senha = protegerCheck.checked ? senhaArquivoInput.value : '';
    wrapper.dataset.id = Date.now()+Math.random();
    let content='';
    if(file.type.startsWith('image')) content=`<img src="${url}" alt="Preview"><button class="delete-btn">🗑</button>`;
    else content=`<video src="${url}" controls></video><button class="delete-btn">🗑</button>`;
    wrapper.innerHTML=content;
    if(wrapper.dataset.senha) wrapper.classList.add('blur');
    previewGrid.appendChild(wrapper);
  });
};

cancelUploadBtn.onclick = ()=>{
  previewGrid.innerHTML='';
  previewArea.style.display='none';
  uploadInput.value='';
  protegerCheck.checked=false;
  senhaArquivoInput.value='';
  senhaArquivoInput.style.display='none';
};

confirmUploadBtn.onclick = ()=>{
  if(!previewGrid.children.length) return;
  Array.from(previewGrid.children).forEach(wrapper=>{
    const clone = wrapper.cloneNode(true);
    if(clone.querySelector('img')) galeriaFotos.appendChild(clone);
    if(clone.querySelector('video')) galeriaVideos.appendChild(clone);
    usuarios[usuarioAtual].arquivos.push({
      id: clone.dataset.id,
      senha: clone.dataset.senha,
      type: clone.querySelector('img')?'img':'video',
      src: clone.querySelector('img')?clone.querySelector('img').src:clone.querySelector('video').src
    });
  });
  salvarUsuarios();
  previewGrid.innerHTML='';
  previewArea.style.display='none';
  uploadInput.value='';
  protegerCheck.checked=false;
  senhaArquivoInput.value='';
  senhaArquivoInput.style.display='none';
};

// ---------- Carregar galeria ----------
function carregarGaleria(){
  galeriaFotos.innerHTML='';
  galeriaVideos.innerHTML='';
  if(!usuarioAtual || !usuarios[usuarioAtual]) return;
  usuarios[usuarioAtual].arquivos.forEach(file=>{
    const wrapper=document.createElement('div');
    wrapper.classList.add(file.type==='img'?'img-wrapper':'video-wrapper');
    wrapper.dataset.id=file.id;
    wrapper.dataset.senha=file.senha||'';
    if(file.senha) wrapper.classList.add('blur');
    if(file.type==='img') wrapper.innerHTML=`<img src="${file.src}" alt=""><button class="delete-btn">🗑</button>`;
    else wrapper.innerHTML=`<video src="${file.src}" controls></video><button class="delete-btn">🗑</button>`;
    if(file.type==='img') galeriaFotos.appendChild(wrapper);
    else galeriaVideos.appendChild(wrapper);
  });
}

// ---------- Modal e deletar ----------
const modal = document.getElementById('modal');
const imgModal = document.getElementById('imgModal');
const videoModal = modal.querySelector('video');
const passwordInput = document.getElementById('passwordModalInput');
const passwordConfirmBtn = document.getElementById('passwordConfirmBtn');
const passwordError = document.getElementById('passwordError');
let currentWrapper = null;

document.addEventListener('click', e=>{
  const target = e.target;
  if(target.classList.contains('img-wrapper') || target.closest('.img-wrapper')) openModal(target.closest('.img-wrapper'));
  else if(target.classList.contains('video-wrapper') || target.closest('.video-wrapper')) openModal(target.closest('.video-wrapper'));
  else if(target.classList.contains('delete-btn')) deleteFile(target.parentElement);
});

function openModal(wrapper){
  currentWrapper=wrapper;
  if(wrapper.dataset.senha){
    passwordInput.style.display='block';
    passwordConfirmBtn.style.display='block';
    passwordInput.value='';
    passwordError.textContent='';
    modal.classList.add('active');
  } else showFile(wrapper);
}

function showFile(wrapper){
  const img = wrapper.querySelector('img');
  const video = wrapper.querySelector('video');
  if(img){imgModal.src=img.src; imgModal.style.display='block'; videoModal.style.display='none';}
  if(video){videoModal.src=video.src; videoModal.style.display='block'; imgModal.style.display='none';}
  passwordInput.style.display='none';
  passwordConfirmBtn.style.display='none';
  passwordError.textContent='';
  modal.classList.add('active');
}

passwordConfirmBtn.onclick = ()=>{
  if(passwordInput.value===currentWrapper.dataset.senha) showFile(currentWrapper);
  else passwordError.textContent='Senha incorreta!';
};

function fecharModal(){
  modal.classList.remove('active');
  imgModal.style.display='none';
  videoModal.style.display='none';
  passwordInput.style.display='none';
  passwordConfirmBtn.style.display='none';
  passwordInput.value='';
  passwordError.textContent='';
}
modal.querySelector('.fechar').onclick = fecharModal;
modal.querySelector('.modal-background').onclick = fecharModal;

function deleteFile(wrapper){
  if(!usuarioAtual) return;
  const id = wrapper.dataset.id;
  wrapper.remove();
  usuarios[usuarioAtual].arquivos = usuarios[usuarioAtual].arquivos.filter(f=>f.id!==id);
  salvarUsuarios();
}

// ---------- Drag & Drop ----------
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', e=>{e.preventDefault(); uploadArea.classList.add('dragover');});
uploadArea.addEventListener('dragleave', e=>{e.preventDefault(); uploadArea.classList.remove('dragover');});
uploadArea.addEventListener('drop', e=>{
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  uploadInput.files = e.dataTransfer.files;
  uploadInput.onchange();
});
