// Elementos da página
const form = document.getElementById("form-transacao");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const categoriaInput = document.getElementById("categoria");
const tipoInput = document.getElementById("tipo");
const dataInput = document.getElementById("data");

const listaTransacoes = document.getElementById("lista-transacoes");

const saldoElemento = document.getElementById("saldo");
const receitasElemento = document.getElementById("receitas");
const despesasElemento = document.getElementById("despesas");

const filtro = document.getElementById("filtro");


// Busca as transações salvas no navegador
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];


// Coloca a data de hoje automaticamente
dataInput.valueAsDate = new Date();


// Quando o formulário for enviado
form.addEventListener("submit", function (event) {

    // Impede a página de recarregar
    event.preventDefault();

    const descricao = descricaoInput.value.trim();
    const valor = Number(valorInput.value);
    const categoria = categoriaInput.value;
    const tipo = tipoInput.value;
    const data = dataInput.value;

    // Validação
    if (!descricao || valor <= 0 || !categoria || !tipo || !data) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    // Criando uma nova transação
    const novaTransacao = {
        id: Date.now(),
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        tipo: tipo,
        data: data
    };

    // Adiciona no array
    transacoes.push(novaTransacao);

    // Salva
    salvarTransacoes();

    // Atualiza a tela
    atualizarTela();

    // Limpa o formulário
    form.reset();

    // Volta a data para hoje
    dataInput.valueAsDate = new Date();
});


// Salva as transações no navegador
function salvarTransacoes() {

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );

}


// Atualiza toda a interface
function atualizarTela() {

    mostrarTransacoes();
    atualizarResumo();

}


// Mostra as transações na tabela
function mostrarTransacoes() {

    listaTransacoes.innerHTML = "";

    const filtroSelecionado = filtro.value;

    let transacoesFiltradas = transacoes;

    if (filtroSelecionado !== "todos") {

        transacoesFiltradas = transacoes.filter(function (transacao) {

            return transacao.tipo === filtroSelecionado;

        });

    }

    transacoesFiltradas.forEach(function (transacao) {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${transacao.descricao}</td>

            <td>${formatarCategoria(transacao.categoria)}</td>

            <td>${formatarData(transacao.data)}</td>

            <td>${formatarTipo(transacao.tipo)}</td>

            <td>
                ${formatarDinheiro(transacao.valor)}
            </td>

            <td>
                <button
                    class="btn-excluir"
                    onclick="excluirTransacao(${transacao.id})"
                >
                    Excluir
                </button>
            </td>
        `;

        listaTransacoes.appendChild(linha);

    });

}


// Calcula saldo, receitas e despesas
function atualizarResumo() {

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(function (transacao) {

        if (transacao.tipo === "receita") {

            receitas += transacao.valor;

        } else {

            despesas += transacao.valor;

        }

    });

    const saldo = receitas - despesas;

    receitasElemento.textContent = formatarDinheiro(receitas);
    despesasElemento.textContent = formatarDinheiro(despesas);
    saldoElemento.textContent = formatarDinheiro(saldo);

}


// Excluir uma transação
function excluirTransacao(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta transação?"
    );

    if (!confirmar) {
        return;
    }

    transacoes = transacoes.filter(function (transacao) {

        return transacao.id !== id;

    });

    salvarTransacoes();
    atualizarTela();

}


// Formata valores em reais
function formatarDinheiro(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// Formata a data
function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// Deixa o nome da categoria mais bonito
function formatarCategoria(categoria) {

    const categorias = {
        salario: "Salário",
        alimentacao: "Alimentação",
        transporte: "Transporte",
        lazer: "Lazer",
        estudos: "Estudos",
        outros: "Outros"
    };

    return categorias[categoria] || categoria;

}


// Formata o tipo
function formatarTipo(tipo) {

    if (tipo === "receita") {
        return "Receita";
    }

    return "Despesa";

}


// Quando mudar o filtro
filtro.addEventListener("change", function () {

    mostrarTransacoes();

});


// Mostra os dados salvos quando abrir a página
atualizarTela();