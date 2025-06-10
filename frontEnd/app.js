//const apiUrl = "https://localhost:44381/api/produtos";
//const apiUrl = "https://localhost:7298/api/produtos";
const apiUrl = "http://localhost:5016/api/produtos";

let produtosOriginais = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();

    document.getElementById("produtoForm").addEventListener("submit", salvarProduto);
    document.getElementById("cancelarEdicao").addEventListener("click", cancelarEdicao);
});

async function carregarProdutos() {
    const res = await fetch(apiUrl);
    produtosOriginais = await res.json();
    renderizarProdutos(produtosOriginais);
}

function renderizarProdutos(produtos) {
    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    produtos.forEach(produto => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${produto.nome}</strong> - ${produto.descricao || ""} - 
          ${produto.quantidade} unidades - R$${produto.valor.toFixed(2)}
          <button onclick="editarProduto('${produto.id}')">Editar</button>
          <button onclick="deletarProduto('${produto.id}')">Excluir</button>
        `;
        lista.appendChild(item);
    });
}


function filtrarProdutos() {
    const termo = document.getElementById("filtro").value.toLowerCase();
    const filtrados = produtosOriginais.filter(p => p.nome.toLowerCase().includes(termo));
    renderizarProdutos(filtrados);
}

async function salvarProduto(e) {
    e.preventDefault();

    const id = document.getElementById("produtoId").value;
    const produto = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        valor: parseFloat(document.getElementById("valor").value)
    };

    let method = "POST";
    let url = apiUrl;

    if (id) {
        method = "PUT";
        url += `/${id}`;
        produto.id = id;
    }

    const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });

    if (res.ok) {
        //alert(`Produto ${id ? "atualizado" : "cadastrado"} com sucesso!`);
        mostrarMensagem("Produto cadastrado com sucesso!");

        resetForm();
        carregarProdutos();
    } else {
        alert("Erro ao salvar produto.");
    }
}


function editarProduto(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(produto => {
            document.getElementById("produtoId").value = produto.id;
            document.getElementById("nome").value = produto.nome;
            document.getElementById("descricao").value = produto.descricao;
            document.getElementById("quantidade").value = produto.quantidade;
            document.getElementById("valor").value = produto.valor;
            document.getElementById("cancelarEdicao").style.display = "inline-block";
        });
}

async function deletarProduto(id) {
    if (confirm("Deseja excluir este produto?")) {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (res.ok) {
            carregarProdutos();
        } else {
            alert("Erro ao excluir produto.");
        }
    }
}

function cancelarEdicao() {
    resetForm();
}

function resetForm() {
    document.getElementById("produtoForm").reset();
    document.getElementById("produtoId").value = "";
    document.getElementById("cancelarEdicao").style.display = "none";
}

function exportarParaCSV() {
    const csv = produtosOriginais.map(p => `${p.nome},${p.descricao},${p.quantidade},${p.valor}`).join("\n");
    const blob = new Blob(["Nome,Descricao,Quantidade,Valor\n" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "produtos.csv";
    link.click();
}


// Visual ao salvar - em vez de só usar alert, mostrar uma mensagem na tela por alguns segundos
function mostrarMensagem(mensagem, tipo = 'sucesso') {
    const msg = document.createElement('div');
    msg.innerText = mensagem;
    msg.style.position = 'fixed';
    msg.style.bottom = '20px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.padding = '10px 20px';
    msg.style.borderRadius = '5px';
    msg.style.color = '#fff';
    msg.style.backgroundColor = tipo === 'sucesso' ? '#4CAF50' : '#f44336';
    msg.style.zIndex = '1000';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}