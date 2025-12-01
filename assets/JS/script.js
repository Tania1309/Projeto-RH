// ---------------- LOGIN ---------------- //
function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const cargo = document.getElementById("cargo").value;

    if (!email || !senha) {
        document.getElementById("msgErro").innerText = "Preencha todos os campos!";
        return;
    }

    // Salva o usuário logado no localStorage
    const usuario = { email, cargo };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    // Redireciona conforme o cargo
    if (cargo === "gerente") {
        window.location.href = "gerente.html";
    } else {
        window.location.href = "funcionario.html";
    }
}

// ---------------- LOGOUT ---------------- //
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// ---------------- PAINEL ---------------- //
window.onload = function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return;

    if (document.getElementById("areaGerente") && usuario.cargo === "gerente") {
        document.getElementById("areaGerente").classList.remove("oculto");
        carregarFuncionarios();
    }

    if (document.getElementById("areaFuncionario") && usuario.cargo === "funcionario") {
        document.getElementById("areaFuncionario").classList.remove("oculto");
        carregarMeusDados(usuario.email);
    }
};

// ---------------- GERENTE ---------------- //
function cadastrarFuncionario() {
    const nome = document.getElementById("nomeFunc").value.trim();
    const email = document.getElementById("emailFunc").value.trim();
    const cargoFunc = document.getElementById("cargoFunc").value;
    const salario = parseFloat(document.getElementById("salarioFunc").value);

    if (!nome || !email || !salario || !cargoFunc) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

    funcionarios.push({ nome, email, cargo: cargoFunc, salario });
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    carregarFuncionarios();
}

function carregarFuncionarios() {
    const lista = document.getElementById("listaFuncionarios");
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

    lista.innerHTML = "";
    funcionarios.forEach(f => {
        const li = document.createElement("li");
        li.textContent = `${f.nome} — ${f.email} — ${f.cargo} — R$ ${f.salario.toFixed(2)}`;
        lista.appendChild(li);
    });
}

// ---------------- FUNCIONÁRIO ---------------- //
function carregarMeusDados(email) {
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const usuario = funcionarios.find(f => f.email === email);

    if (!usuario) return;

    document.getElementById("meuNome").value = usuario.nome;
    document.getElementById("meuEmail").value = usuario.email;
    document.getElementById("meuSalario").value = usuario.salario;
}

function atualizarDadosFuncionario() {
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const emailOriginal = JSON.parse(localStorage.getItem("usuarioLogado")).email;

    const index = funcionarios.findIndex(f => f.email === emailOriginal);
    if (index === -1) return alert("Funcionário não encontrado!");

    funcionarios[index].nome = document.getElementById("meuNome").value;
    funcionarios[index].email = document.getElementById("meuEmail").value;
    funcionarios[index].salario = parseFloat(document.getElementById("meuSalario").value);

    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    alert("Dados atualizados com sucesso!");
}

function consultarDadosFuncionario() {
    const email = JSON.parse(localStorage.getItem("usuarioLogado")).email;
    carregarMeusDados(email);
}

// ---------------- HOLERITE ---------------- //
function gerarHolerite() {
    const salario = parseFloat(document.getElementById("holeriteSalario").value);
    if (!salario || salario <= 0) return alert("Informe um salário válido!");

    const inss = salario * 0.11;
    const liquido = salario - inss;

    document.getElementById("resultadoHolerite").innerText =
        `INSS: R$ ${inss.toFixed(2)} | Líquido: R$ ${liquido.toFixed(2)}`;
}
