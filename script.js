// Consumo médio de carne crua por pessoa (em kg)
const CONSUMO_CARNE = {
  homem: 0.5,
  mulher: 0.35,
  crianca: 0.2
};

// Consumo de bebidas por adulto (unidades por hora de evento)
const CONSUMO_BEBIDAS = {
  cerveja: { homem: 1.2, mulher: 0.8, unidade: 'latas (350ml)' },
  refrigerante: { homem: 0.3, mulher: 0.3, crianca: 0.4, unidade: 'litros' },
  suco: { crianca: 0.5, homem: 0.2, mulher: 0.2, unidade: 'litros' },
  agua: { homem: 0.3, mulher: 0.3, crianca: 0.3, unidade: 'litros' },
  vinho: { homem: 0.3, mulher: 0.3, unidade: 'taças (~150ml cada)' },
  destilado: { homem: 0.2, mulher: 0.15, unidade: 'doses' }
};

// Nomes legíveis das carnes
const NOMES_CARNES = {
  picanha: 'Picanha',
  linguica: 'Linguiça',
  costela: 'Costela',
  frango: 'Frango (coxa/sobrecoxa)',
  alcatra: 'Alcatra',
  contrafile: 'Contrafilé',
  cupim: 'Cupim',
  coracao: 'Coração de frango'
};

// Nomes legíveis das bebidas
const NOMES_BEBIDAS = {
  cerveja: 'Cerveja',
  refrigerante: 'Refrigerante',
  suco: 'Suco',
  agua: 'Água mineral',
  vinho: 'Vinho',
  destilado: 'Whisky / Vodka'
};

// Atualiza o total de pessoas na tela
function atualizarTotalPessoas() {
  const homens = obterNumero('qtd-homens');
  const mulheres = obterNumero('qtd-mulheres');
  const criancas = obterNumero('qtd-criancas');
  const total = homens + mulheres + criancas;

  document.getElementById('total-pessoas').textContent = total;
}

// Lê um campo numérico do formulário
function obterNumero(idCampo) {
  const valor = parseInt(document.getElementById(idCampo).value, 10);
  return isNaN(valor) || valor < 0 ? 0 : valor;
}

// Lê os checkboxes marcados de um grupo
function obterItensMarcados(nomeGrupo) {
  const checkboxes = document.querySelectorAll('input[name="' + nomeGrupo + '"]:checked');
  const itens = [];

  checkboxes.forEach(function (checkbox) {
    itens.push(checkbox.value);
  });

  return itens;
}

// Calcula o total de carne necessário em kg
function calcularTotalCarne(homens, mulheres, criancas) {
  const total =
    homens * CONSUMO_CARNE.homem +
    mulheres * CONSUMO_CARNE.mulher +
    criancas * CONSUMO_CARNE.crianca;

  return Math.round(total * 10) / 10;
}

// Divide a carne entre os tipos selecionados
function calcularQuantidadeCarnes(totalCarne, carnesSelecionadas) {
  const lista = [];

  if (carnesSelecionadas.length === 0) {
    return [{ nome: 'Carne (escolha os tipos acima)', quantidade: totalCarne, unidade: 'kg' }];
  }

  const quantidadePorTipo = Math.round((totalCarne / carnesSelecionadas.length) * 10) / 10;

  carnesSelecionadas.forEach(function (tipo) {
    lista.push({
      nome: NOMES_CARNES[tipo] || tipo,
      quantidade: quantidadePorTipo,
      unidade: 'kg'
    });
  });

  return lista;
}

// Calcula quantidade de cada bebida
function calcularQuantidadeBebidas(homens, mulheres, criancas, duracao, bebidasSelecionadas) {
  const lista = [];
  const fatorDuracao = duracao / 4;

  bebidasSelecionadas.forEach(function (tipo) {
    const config = CONSUMO_BEBIDAS[tipo];
    if (!config) return;

    let quantidade = 0;

    if (config.homem) quantidade += homens * config.homem * fatorDuracao;
    if (config.mulher) quantidade += mulheres * config.mulher * fatorDuracao;
    if (config.crianca) quantidade += criancas * config.crianca * fatorDuracao;

    if (quantidade > 0) {
      let quantidadeFinal = quantidade;
      let unidade = config.unidade;

      if (tipo === 'cerveja') {
        quantidadeFinal = Math.ceil(quantidade);
        unidade = 'latas (350ml)';
      } else if (tipo === 'refrigerante' || tipo === 'suco' || tipo === 'agua') {
        quantidadeFinal = Math.ceil(quantidade);
        unidade = 'litros';
      } else if (tipo === 'vinho') {
        quantidadeFinal = Math.ceil(quantidade);
        unidade = 'garrafas (750ml)';
      } else if (tipo === 'destilado') {
        quantidadeFinal = Math.ceil(quantidade * 10);
        unidade = 'doses';
      }

      lista.push({
        nome: NOMES_BEBIDAS[tipo] || tipo,
        quantidade: quantidadeFinal,
        unidade: unidade
      });
    }
  });

  return lista;
}

// Calcula acompanhamentos e itens extras
function calcularExtras(homens, mulheres, criancas, totalCarne, extrasSelecionados) {
  const totalPessoas = homens + mulheres + criancas;
  const lista = [];

  extrasSelecionados.forEach(function (tipo) {
    switch (tipo) {
      case 'pao-alho':
        lista.push({
          nome: 'Pão de alho',
          quantidade: Math.ceil(totalPessoas / 3),
          unidade: 'unidades'
        });
        break;
      case 'farofa':
        lista.push({
          nome: 'Farofa pronta',
          quantidade: Math.ceil(totalPessoas * 0.05 * 10) / 10,
          unidade: 'kg'
        });
        break;
      case 'vinagrete':
        lista.push({
          nome: 'Vinagrete / salada',
          quantidade: Math.ceil(totalPessoas * 0.08 * 10) / 10,
          unidade: 'kg'
        });
        break;
      case 'queijo-coalho':
        lista.push({
          nome: 'Queijo coalho',
          quantidade: Math.ceil(totalPessoas * 0.1 * 10) / 10,
          unidade: 'kg'
        });
        break;
    }
  });

  // Carvão: ~1kg para cada 1kg de carne
  lista.push({
    nome: 'Carvão',
    quantidade: Math.ceil(totalCarne),
    unidade: 'kg'
  });

  // Sal grosso
  lista.push({
    nome: 'Sal grosso',
    quantidade: Math.max(1, Math.ceil(totalPessoas / 10)),
    unidade: 'kg'
  });

  // Gelo
  lista.push({
    nome: 'Gelo',
    quantidade: Math.ceil(totalPessoas * 0.5),
    unidade: 'kg'
  });

  return lista;
}

// Formata número para exibição
function formatarQuantidade(valor) {
  if (valor % 1 === 0) return valor;
  return valor.toFixed(1);
}

// Monta o HTML de uma lista de compras
function renderizarListaCompras(elementoId, itens) {
  const lista = document.getElementById(elementoId);
  lista.innerHTML = '';

  if (itens.length === 0) {
    lista.innerHTML = '<li class="vazio">Nenhum item selecionado</li>';
    return;
  }

  itens.forEach(function (item) {
    const li = document.createElement('li');
    li.innerHTML =
      '<span class="nome-item">' + item.nome + '</span>' +
      '<span class="qtd-item">' + formatarQuantidade(item.quantidade) + ' ' + item.unidade + '</span>';
    lista.appendChild(li);
  });
}

// Exibe o resultado na tela
function exibirResultado(dados) {
  const secao = document.getElementById('secao-resultado');
  const resumo = document.getElementById('resumo-evento');

  const textoResumo =
    'Churrasco para <strong>' + dados.totalPessoas + ' pessoas</strong> ' +
    '(' + dados.homens + ' homens, ' + dados.mulheres + ' mulheres, ' + dados.criancas + ' crianças) ' +
    'com duração de <strong>' + dados.duracao + ' horas</strong>.';

  resumo.innerHTML = textoResumo;

  renderizarListaCompras('lista-compras-carnes', dados.carnes);
  renderizarListaCompras('lista-compras-bebidas', dados.bebidas);
  renderizarListaCompras('lista-compras-extras', dados.extras);

  document.getElementById('total-carne').textContent = dados.totalCarne + ' kg';

  secao.classList.remove('oculto');
  secao.scrollIntoView({ behavior: 'smooth' });
}

// Processa o formulário e calcula tudo
function calcularChurrasco(evento) {
  evento.preventDefault();

  const homens = obterNumero('qtd-homens');
  const mulheres = obterNumero('qtd-mulheres');
  const criancas = obterNumero('qtd-criancas');
  const totalPessoas = homens + mulheres + criancas;

  if (totalPessoas === 0) {
    alert('Informe pelo menos 1 pessoa no churrasco!');
    return;
  }

  const duracao = parseInt(document.getElementById('duracao-horas').value, 10);
  const carnesSelecionadas = obterItensMarcados('carne');
  const bebidasSelecionadas = obterItensMarcados('bebida');
  const extrasSelecionados = obterItensMarcados('extra');

  const totalCarne = calcularTotalCarne(homens, mulheres, criancas);
  const carnes = calcularQuantidadeCarnes(totalCarne, carnesSelecionadas);
  const bebidas = calcularQuantidadeBebidas(homens, mulheres, criancas, duracao, bebidasSelecionadas);
  const extras = calcularExtras(homens, mulheres, criancas, totalCarne, extrasSelecionados);

  exibirResultado({
    homens: homens,
    mulheres: mulheres,
    criancas: criancas,
    totalPessoas: totalPessoas,
    duracao: duracao,
    totalCarne: totalCarne,
    carnes: carnes,
    bebidas: bebidas,
    extras: extras
  });
}

// Inicializa os eventos da página
function inicializarPagina() {
  const camposPessoas = ['qtd-homens', 'qtd-mulheres', 'qtd-criancas'];

  camposPessoas.forEach(function (id) {
    document.getElementById(id).addEventListener('input', atualizarTotalPessoas);
  });

  document.getElementById('formulario-churrasco').addEventListener('submit', calcularChurrasco);

  atualizarTotalPessoas();
}

document.addEventListener('DOMContentLoaded', inicializarPagina);
