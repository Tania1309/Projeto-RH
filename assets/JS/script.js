// ---------------- Login ---------------- //
function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const cargo = document.getElementById("cargo").value;

    if (!cargo || !email || !senha) {
        document.getElementById("msgErro").innerText = "Preencha todos os campos!";
        return;
    }

    // Senhas dos cargos
    const senhasCorretas = {
        gerente: "gerente1234",
        funcionario: "F1234"
    };

    // Verifica se a senha está correta
    if (senha !== senhasCorretas[cargo]) {
        document.getElementById("msgErro").innerText = "Senha incorreta!";
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

// ---------------- Sair ---------------- //
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// ---------------- Painel ---------------- //
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

// ---------------- Gerente ---------------- //
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

    // Evita duplicação de funcionário pelo e-mail
    if (funcionarios.some(f => f.email === email)) {
        alert("Funcionário já cadastrado com esse email!");
        return;
    }

    // Cadastro do funcionário
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

// ---------------- Funcionário ---------------- //
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

// ---------------- Contra-Cheque ---------------- //
function gerarHolerite() {
    const nome = document.getElementById("holeriteNome").value.trim();
    const cargo = document.getElementById("holeriteCargo").value.trim();
    const salario = parseFloat(document.getElementById("holeriteSalario").value);

    if (!nome || !cargo || !salario || salario <= 0) {
        return alert("Preencha todos os campos corretamente!");
    }

    // ---------- Verifica se existe o funcionário ----------
    const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
    const funcionario = funcionarios.find(f =>
        f.nome.toLowerCase() === nome.toLowerCase() &&
        f.cargo.toLowerCase() === cargo.toLowerCase()
    );

    if (!funcionario) {
        alert("Funcionário não cadastrado! Não é possível gerar contra-cheque.");
        return;
    }

    // ---------- INSS (Tabela 2024 – Progressivo) ----------
    function calcularINSS(salario) {
        let total = 0;

        const faixas = [
            { limite: 1412.00, aliquota: 0.075 },
            { limite: 2666.68, aliquota: 0.09 },
            { limite: 4000.03, aliquota: 0.12 },
            { limite: 7786.02, aliquota: 0.14 }
        ];

        let restante = salario;
        let inicioFaixa = 0;

        for (let f of faixas) {
            if (salario > inicioFaixa) {
                let baseFaixa = Math.min(restante, f.limite - inicioFaixa);
                total += baseFaixa * f.aliquota;
                restante -= baseFaixa;
            }
            inicioFaixa = f.limite;
        }

        return total;
    }

    // ---------- Imposto de Renda (Atualizado 2024-2025) ----------
    function calcularIRRF(salario, inss) {
        const base = salario - inss; // base real do IRRF
        let aliquota = 0;
        let deducao = 0;

        if (base <= 2259.20) {
            aliquota = 0; deducao = 0;
        }
        else if (base <= 2826.65) {
            aliquota = 0.075; deducao = 169.44;
        }
        else if (base <= 3751.05) {
            aliquota = 0.15; deducao = 381.44;
        }
        else if (base <= 4664.68) {
            aliquota = 0.225; deducao = 662.77;
        }
        else {
            aliquota = 0.275; deducao = 896.00;
        }

        const imposto = base * aliquota - deducao;
        return imposto > 0 ? imposto : 0;
    }

    // ---------- Calcula tudo ----------
    const inss = calcularINSS(salario);
    const ir = calcularIRRF(salario, inss);
    const valeTransporte = salario * 0.06;
    const salarioLiquido = salario - inss - ir - valeTransporte;

    // ---------- Exibir ----------
    document.getElementById("resultadoHolerite").innerHTML = `
        <strong>Contra-Cheque Gerado:</strong><br><br>
        <strong>Nome:</strong> ${nome}<br><br>
        <strong>Cargo:</strong> ${cargo}<br><br>
        <strong>Salário Bruto:</strong> R$ ${salario.toFixed(2)}<br><br>
        <strong>INSS (Progressivo):</strong> R$ ${inss.toFixed(2)}<br><br>
        <strong>Imposto de Renda:</strong> R$ ${ir.toFixed(2)}<br><br>
        <strong>Vale Transporte (6%):</strong> R$ ${valeTransporte.toFixed(2)}<br><br>
        <strong>Salário Líquido:</strong> R$ ${salarioLiquido.toFixed(2)}
    `;
}
