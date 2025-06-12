const apiProdutosUrl = "https://localhost:44346/api/Produtos";
const apiFornecedoresUrl = "https://localhost:44346/api/Fornecedors";

let produtosOriginais = [];
let fornecedoresOriginais = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    carregarFornecedores();

    // Produtos
    document.getElementById("produtoForm").addEventListener("submit", salvarProduto);
    document.getElementById("cancelarEdicao").addEventListener("click", cancelarEdicaoProduto);

    // Fornecedores
    document.getElementById("fornecedorForm").addEventListener("submit", salvarFornecedor);
    document.getElementById("cancelarEdicaoFornecedor").addEventListener("click", cancelarEdicaoFornecedor);
});

// --- Produtos ---

async function carregarProdutos() {
    const res = await fetch(apiProdutosUrl);
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

async function salvarProduto(e) {
    e.preventDefault();

    const id = document.getElementById("produtoId").value;
    const produto = {
        nome: document.getElementById("nomeProduto").value,
        descricao: document.getElementById("descricao").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        valor: parseFloat(document.getElementById("valor").value)
    };

    let method = "POST";
    let url = apiProdutosUrl;

    if (id) {
        method = "PUT";
        url += `/${id}`;
        produto.id = id;
    }

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });

    if (res.ok) {
        mostrarMensagem(`Produto ${id ? "atualizado" : "cadastrado"} com sucesso!`);
        resetFormProduto();
        carregarProdutos();
    } else {
        mostrarMensagem("Erro ao salvar produto.", "erro");
    }
}

function editarProduto(id) {
    fetch(`${apiProdutosUrl}/${id}`)
        .then(res => res.json())
        .then(produto => {
            document.getElementById("produtoId").value = produto.id;
            document.getElementById("nomeProduto").value = produto.nome;
            document.getElementById("descricao").value = produto.descricao;
            document.getElementById("quantidade").value = produto.quantidade;
            document.getElementById("valor").value = produto.valor;
            document.getElementById("cancelarEdicao").style.display = "inline-block";
        });
}

async function deletarProduto(id) {
    if (confirm("Deseja excluir este produto?")) {
        const res = await fetch(`${apiProdutosUrl}/${id}`, { method: "DELETE" });
        if (res.ok) {
            carregarProdutos();
        } else {
            mostrarMensagem("Erro ao excluir produto.", "erro");
        }
    }
}

function cancelarEdicaoProduto() {
    resetFormProduto();
}

function resetFormProduto() {
    document.getElementById("produtoForm").reset();
    document.getElementById("produtoId").value = "";
    document.getElementById("cancelarEdicao").style.display = "none";
}

// --- Fornecedores ---

async function carregarFornecedores() {
    const res = await fetch(apiFornecedoresUrl);
    fornecedoresOriginais = await res.json();
    renderizarFornecedores(fornecedoresOriginais);
}

function renderizarFornecedores(fornecedores) {
    const lista = document.getElementById("listaFornecedores");
    lista.innerHTML = "";

    fornecedores.forEach(fornecedor => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${fornecedor.nome}</strong> - CNPJ: ${fornecedor.cnpj || ""} - Telefone: ${fornecedor.telefone || ""} - Email: ${fornecedor.email || ""}
          <button onclick="editarFornecedor('${fornecedor.id}')">Editar</button>
          <button onclick="deletarFornecedor('${fornecedor.id}')">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

async function salvarFornecedor(e) {
    e.preventDefault();

    const id = document.getElementById("fornecedorId").value;
    const fornecedor = {
        nome: document.getElementById("nomeFornecedor").value,
        cnpj: document.getElementById("cnpj").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
    };

    let method = "POST";
    let url = apiFornecedoresUrl;

    if (id) {
        method = "PUT";
        url += `/${id}`;
        fornecedor.id = id;
    }

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
    });

    if (res.ok) {
        mostrarMensagem(`Fornecedor ${id ? "atualizado" : "cadastrado"} com sucesso!`);
        resetFormFornecedor();
        carregarFornecedores();
    } else {
        mostrarMensagem("Erro ao salvar fornecedor.", "erro");
    }
}

function editarFornecedor(id) {
    fetch(`${apiFornecedoresUrl}/${id}`)
        .then(res => res.json())
        .then(fornecedor => {
            document.getElementById("fornecedorId").value = fornecedor.id;
            document.getElementById("nomeFornecedor").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj;
            document.getElementById("telefone").value = fornecedor.telefone;
            document.getElementById("email").value = fornecedor.email;
            document.getElementById("cancelarEdicaoFornecedor").style.display = "inline-block";
        });
}

async function deletarFornecedor(id) {
    if (confirm("Deseja excluir este fornecedor?")) {
        const res = await fetch(`${apiFornecedoresUrl}/${id}`, { method: "DELETE" });
        if (res.ok) {
            carregarFornecedores();
        } else {
            mostrarMensagem("Erro ao excluir fornecedor.", "erro");
        }
    }
}

function cancelarEdicaoFornecedor() {
    resetFormFornecedor();
}

function resetFormFornecedor() {
    document.getElementById("fornecedorForm").reset();
    document.getElementById("fornecedorId").value = "";
    document.getElementById("cancelarEdicaoFornecedor").style.display = "none";
}

// --- Mensagem de feedback ---

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
