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

    if (!nome || !email || !cargoFunc || !salario) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

    // Prevenir emails duplicados
    if (funcionarios.some(f => f.email === email)) {
        alert("Funcionário já cadastrado com esse email!");
        return;
    }

    // Cria funcionário com todos os campos necessários
    funcionarios.push({
        nome,
        email,
        usuario: "",
        telefone: "",
        data: "",
        endereco: "",
        cargo: cargoFunc,
        salario
    });

    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

    alert("Funcionário cadastrado com sucesso!");
    carregarFuncionarios();
}

function carregarFuncionarios() {
    const lista = document.getElementById("listaFuncionarios");
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];

    lista.innerHTML = "";

    if (funcionarios.length === 0) {
        lista.innerHTML = "<li>Nenhum funcionário cadastrado.</li>";
        return;
    }

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

    if (!usuario) {
        alert("Funcionário não encontrado!");
        return;
    }

    document.getElementById("meuNome").value = usuario.nome;
    document.getElementById("meuId").value = usuario.usuario;
    document.getElementById("data").value = usuario.data;
    document.getElementById("tel").value = usuario.telefone;
    document.getElementById("endereco").value = usuario.endereco;
    document.getElementById("cargo").value = usuario.cargo;
}

function atualizarDadosFuncionario() {
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const emailOriginal = JSON.parse(localStorage.getItem("usuarioLogado")).email;

    const index = funcionarios.findIndex(f => f.email === emailOriginal);
    if (index === -1) return alert("Funcionário não encontrado!");

    // Validação simples
    const nome = document.getElementById("meuNome").value.trim();
    if (!nome) return alert("O nome não pode estar vazio!");

    funcionarios[index].nome = nome;
    funcionarios[index].usuario = document.getElementById("meuId").value.trim();
    funcionarios[index].data = document.getElementById("data").value;
    funcionarios[index].telefone = document.getElementById("tel").value.trim();
    funcionarios[index].endereco = document.getElementById("endereco").value.trim();
    funcionarios[index].cargo = document.getElementById("cargo").value.trim();

    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    alert("Dados atualizados com sucesso!");
}

function consultarDadosFuncionario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return alert("Usuário não logado!");
    carregarMeusDados(usuario.email);
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
