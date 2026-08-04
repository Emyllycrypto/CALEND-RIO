const mesesNomes = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const temasMeses = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
];

// 🔊 EFEITOS SONOROS (Pode substituir os links pelos caminhos dos seus arquivos .mp3 locais)
const somCliqueDia = new Audio("som/pop.mp3");
const somMudarMes = new Audio("som/pop.mp3");

// Ajuste opcional de volume (de 0.0 a 1.0)
somCliqueDia.volume = 0.4;
somMudarMes.volume = 0.5;

function tocarSom(audio) {
  audio.currentTime = 0; // Reinicia o áudio para tocar rápido em cliques seguidos
  audio.play().catch(() => {}); // .catch evita erros caso a interação seja bloqueada pelo navegador
}

let dataAtual = new Date();
let notasSalvas = JSON.parse(localStorage.getItem('calendarioRetroNotas')) || {};

let chaveAtualSelecionada = "";
let iconeSelecionadoModal = "fa-champagne-glasses";

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const poster = document.querySelector(".poster-container");
  temasMeses.forEach(t => poster.classList.remove(`tema-${t}`));
  poster.classList.add(`tema-${temasMeses[mes]}`);

  document.getElementById("nomeMes").innerText = mesesNomes[mes];
  document.querySelector(".ano").innerText = ano;

  const diasGrid = document.getElementById("diasGrid");
  diasGrid.innerHTML = "";

  const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const dataHoje = new Date();

  // 1. Dias vazios
  for (let i = 0; i < primeiroDiaIndex; i++) {
    const divVazia = document.createElement("div");
    divVazia.classList.add("dia-box", "vazio");
    divVazia.innerText = "✶";
    diasGrid.appendChild(divVazia);
  }

  // 2. Preenche os dias
  for (let dia = 1; dia <= totalDias; dia++) {
    const divDia = document.createElement("div");
    divDia.classList.add("dia-box");
    divDia.innerText = dia;

    const chaveNota = `${ano}-${mes}-${dia}`;

    // Marca o dia atual
    if (
      dia === dataHoje.getDate() &&
      mes === dataHoje.getMonth() &&
      ano === dataHoje.getFullYear()
    ) {
      divDia.classList.add("hoje");
    }

    // Se tiver nota registrada, insere o ícone do Font Awesome correspondente
    if (notasSalvas[chaveNota]) {
      divDia.classList.add("com-nota");
      
      const iconeClasse = notasSalvas[chaveNota].icone || "fa-star";
      const iconeElemento = document.createElement("i");
      iconeElemento.className = `fa-solid ${iconeClasse} icone-lembrete`;
      
      divDia.appendChild(iconeElemento);
      divDia.title = `Lembrete: ${notasSalvas[chaveNota].texto}`;
    }

    divDia.onclick = () => {
      tocarSom(somCliqueDia); // 🔊 Toca o som ao clicar no dia
      abrirModal(dia, mes, ano, chaveNota);
    };
    
    diasGrid.appendChild(divDia);
  }
}

function mudarMes(direcao) {
  tocarSom(somMudarMes); // 🔊 Toca o som ao mudar o mês
  dataAtual.setMonth(dataAtual.getMonth() + direcao);
  renderizarCalendario();
}

/* ==============================================
   MODAL DE NOTAS
   ============================================== */

function abrirModal(dia, mes, ano, chave) {
  chaveAtualSelecionada = chave;
  document.getElementById("modalDataTitulo").innerText = `Dia ${dia} de ${mesesNomes[mes]}`;
  
  const notaExistente = notasSalvas[chave];
  
  if (notaExistente) {
    document.getElementById("modalTextoNota").value = notaExistente.texto || "";
    iconeSelecionadoModal = notaExistente.icone || "fa-champagne-glasses";
  } else {
    document.getElementById("modalTextoNota").value = "";
    iconeSelecionadoModal = "fa-champagne-glasses";
  }

  atualizarBotoesIcone();
  document.getElementById("modalOverlay").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modalOverlay").classList.remove("ativo");
}

function selecionarIcone(classeIcone, elemento) {
  tocarSom(somCliqueDia); // 🔊 Som opcional ao alternar categorias dentro do modal
  iconeSelecionadoModal = classeIcone;
  atualizarBotoesIcone();
}

function atualizarBotoesIcone() {
  const botoes = document.querySelectorAll(".btn-icone");
  botoes.forEach(btn => {
    if (btn.getAttribute("onclick").includes(iconeSelecionadoModal)) {
      btn.classList.add("ativo");
    } else {
      btn.classList.remove("ativo");
    }
  });
}

function salvarNotaModal() {
  const texto = document.getElementById("modalTextoNota").value.trim();

  if (texto === "") {
    delete notasSalvas[chaveAtualSelecionada];
  } else {
    notasSalvas[chaveAtualSelecionada] = {
      texto: texto,
      icone: iconeSelecionadoModal
    };
  }

  localStorage.setItem('calendarioRetroNotas', JSON.stringify(notasSalvas));
  fecharModal();
  renderizarCalendario();
}

function excluirNotaModal() {
  delete notasSalvas[chaveAtualSelecionada];
  localStorage.setItem('calendarioRetroNotas', JSON.stringify(notasSalvas));
  fecharModal();
  renderizarCalendario();
}

renderizarCalendario();