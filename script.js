const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Transforma problemas em soluções. Gosta de construir, reparar equipamentos e garantir que todos os sistemas funcionam.",
        imagem: "imagens/perfil-1.jpg",
        recomendacao: "Fica responsável por verificar a nave, reparar equipamentos e manter os sistemas de comunicação e energia operacionais."
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "É curioso, analítico e atento aos detalhes. Gosta de pesquisar, analisar evidências e descobrir como as coisas funcionam.",
        imagem: "imagens/perfil-2.jpg",
        recomendacao: "Analisa amostras do planeta, estuda possíveis formas de vida e regista descobertas científicas importantes para a equipa."
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "É aventureiro, adaptável e observador. Gosta de descobrir lugares, experimentar alternativas e enfrentar desafios novos.",
        imagem: "imagens/perfil-3.jpg",
        recomendacao: "Lidera as expedições pelo terreno, identifica caminhos seguros e procura recursos naturais que possam ajudar a tripulação."
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planeamento",
        descricao: "É organizado, responsável e capaz de avaliar diferentes possibilidades antes de tomar uma decisão.",
        imagem: "imagens/perfil-4.jpg",
        recomendacao: "Coordena a equipa, organiza os recursos, avalia os riscos e define os próximos passos da exploração."
    }
];

// 2. ELEMENTOS DA PÁGINA

const formulario = document.querySelector("#formulario");
const campoNome = document.querySelector("#nome");
const campoNascimento = document.querySelector("#nascimento");

const painelTeste = document.querySelector("#painel-teste");
const painelResultado = document.querySelector("#resultado");

const dadosParticipante = document.querySelector("#dados-participante");
const tituloResultado = document.querySelector("#titulo-resultado");
const mensagemEmpate = document.querySelector("#mensagem-empate");
const areaPerfis = document.querySelector("#perfis-resultado");
const botaoRefazer = document.querySelector("#refazer");

// Impede selecionar uma data futura também no calendário.
const hoje = new Date();

const hojeISO = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
].join("-");

campoNascimento.max = hojeISO;


// 3. CALCULAR A IDADE

function calcularIdade(dataTexto) {
    const partes = dataTexto.split("-").map(Number);

    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    const agora = new Date();

    let idade = agora.getFullYear() - ano;

    const aindaNaoFezAnos =
        agora.getMonth() + 1 < mes ||
        (
            agora.getMonth() + 1 === mes &&
            agora.getDate() < dia
        );

    if (aindaNaoFezAnos) {
        idade--;
    }

    return idade;
}


// 4. CRIAR O CARTÃO DE CADA PERFIL

function criarCartao(perfil) {
    const cartao = document.createElement("article");
    cartao.className = "cartao-perfil";

    const imagem = document.createElement("img");
    imagem.className = "imagem-perfil";
    imagem.src = perfil.imagem;
    imagem.alt = "Ilustração do perfil " + perfil.nome;
    imagem.loading = "lazy";

    // Mostra uma alternativa se o ficheiro da imagem não existir.
    imagem.addEventListener("error", function () {
        imagem.alt = "Imagem não encontrada: " + perfil.nome;
        imagem.style.display = "none";
    }, { once: true });

    const conteudo = document.createElement("div");
    conteudo.className = "conteudo-perfil";

    const categoria = document.createElement("span");
    categoria.className = "categoria";
    categoria.textContent = perfil.categoria;

    const nome = document.createElement("h3");
    nome.textContent = perfil.nome;

    const descricao = document.createElement("p");
    descricao.textContent = perfil.descricao;

    const recomendacao = document.createElement("p");
    recomendacao.className = "recomendacao";
    recomendacao.textContent =
        "Recomendação para a missão: " + perfil.recomendacao;

    conteudo.append(categoria, nome, descricao, recomendacao);
    cartao.append(imagem, conteudo);

    return cartao;
}


// 5. DESCOBRIR O PERFIL

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const nascimento = campoNascimento.value;

    // Validar o nome.
    if (nome.length === 0) {
        alert("Por favor, informa o teu nome.");
        campoNome.focus();
        return;
    }

    // Validar a data.
    if (!nascimento || nascimento > hojeISO) {
        alert("Seleciona uma data de nascimento válida, que não seja futura.");
        campoNascimento.focus();
        return;
    }

    const idade = calcularIdade(nascimento);

    if (idade < 0) {
        alert("A data de nascimento não é válida.");
        campoNascimento.focus();
        return;
    }

    // Validar as quatro respostas.
    const respostas = [];

    for (let i = 1; i <= 4; i++) {
        const selecionada = formulario.querySelector(
            'input[name="p' + i + '"]:checked'
        );

        if (!selecionada) {
            alert("Responde a todas as quatro perguntas antes de continuar.");
            return;
        }

        respostas.push(Number(selecionada.value));
    }

    // Cada perfil começa com zero pontos.
    const pontuacoes = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    // Cada resposta acrescenta um ponto ao perfil escolhido.
    respostas.forEach(function (idPerfil) {
        pontuacoes[idPerfil]++;
    });

    // Descobrir a maior pontuação.
    const maiorPontuacao = Math.max(
        ...Object.values(pontuacoes)
    );

    // Tratar empates: guardar todos os perfis com a maior pontuação.
    const idsVencedores = Object.keys(pontuacoes)
        .filter(function (id) {
            return pontuacoes[id] === maiorPontuacao;
        })
        .map(Number);

    // Procurar os dados no array de objetos.
    const vencedores = perfis.filter(function (perfil) {
        return idsVencedores.includes(perfil.id);
    });

    // Preparar a tela de resultado.
    dadosParticipante.textContent =
        "Participante: " + nome + " | Idade: " + idade + " anos.";

    areaPerfis.replaceChildren();

    if (vencedores.length === 1) {
        tituloResultado.textContent = "Perfil identificado";
        mensagemEmpate.hidden = true;
    } else {
        tituloResultado.textContent = "Perfis compatíveis";

        mensagemEmpate.textContent =
            "Empate! As tuas respostas combinaram igualmente com " +
            vencedores.length +
            " perfis. Conhece as possibilidades abaixo.";

        mensagemEmpate.hidden = false;
    }

    vencedores.forEach(function (perfil) {
        areaPerfis.appendChild(criarCartao(perfil));
    });

    // Mostrar o resultado e esconder o formulário.
    painelTeste.hidden = true;
    painelResultado.hidden = false;

    painelResultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// 6. REFAZER O TESTE

botaoRefazer.addEventListener("click", function () {
    formulario.reset();

    painelResultado.hidden = true;
    painelTeste.hidden = false;

    mensagemEmpate.hidden = true;
    areaPerfis.replaceChildren();

    campoNascimento.max = hojeISO;

    painelTeste.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    campoNome.focus();
});