// ====================================================================
// FUNÇÕES DE SEGURANÇA (LOGIN/LOGOUT)
// ====================================================================

// Funções Auxiliares de Navegação (CORRIGIDAS PARA AMBIENTE LOCAL)
// Esta função lida com o redirecionamento para a página principal
function irParaPrincipal() {
    // Tenta encontrar a URL base para garantir que o link funcione, mesmo em subpastas
    const urlBase = window.location.href.split('/usuarios/')[0] 
                    || window.location.href.split('/livros/')[0]
                    || window.location.href.split('/autores/')[0];
    
    // Se a URLBase foi encontrada (em uma subpasta), usa o caminho completo
    if (urlBase && !urlBase.includes('principal.html')) {
        window.location.href = `${urlBase}/principal.html`;
    } 
    // Se estiver na raiz ou a lógica falhou, usa o caminho relativo
    else {
        window.location.href = '../principal.html'; 
    }
}

// Esta função lida com o redirecionamento para a página de login
function irParaLogin() {
    const urlBase = window.location.href.split('/usuarios/')[0] 
                    || window.location.href.split('/livros/')[0]
                    || window.location.href.split('/autores/')[0];

    // Se a URLBase foi encontrada, usa o caminho completo para a raiz
    if (urlBase && !urlBase.includes('login.html')) {
        window.location.href = `${urlBase}/login.html`;
    } 
    // Se estiver na raiz, usa o caminho relativo
    else {
        window.location.href = './login.html'; 
    }
}

// 1. Verificar Status de Login (Requisito 3 - COM CORREÇÃO)
function verificarLogin() {
    const path = window.location.pathname;
    
    // CORREÇÃO: Permite o acesso a login e ao cadastro de usuário sem ser redirecionado
    if (path.includes('login.html') || path.includes('cadastro_usuarios.html')) {
        return; 
    }

    const usuarioLogado = sessionStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        // Redireciona para o login se não estiver logado
        irParaLogin();
    }
}

// 2. Fazer Login (Requisito 2)
function fazerLogin(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        sessionStorage.setItem('usuarioLogado', usuarioEncontrado.email);
        window.location.href = 'principal.html';
        return true;
    } else {
        alert('E-mail ou senha incorretos.');
        return false;
    }
}

// 3. Fazer Logout (Requisito 6)
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    irParaLogin();
}

// ====================================================================
// FUNÇÕES DE CRUD (Requisito 4)
// ====================================================================

// Função Genérica para Inclusão de Dados
function incluirRegistro(tipo, dados) {
    let registros = JSON.parse(localStorage.getItem(tipo)) || [];
    dados.id = Date.now(); 
    registros.push(dados);
    localStorage.setItem(tipo, JSON.stringify(registros));
    alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} incluído com sucesso!`);
    
    // Após a inclusão, redireciona para a página principal
    irParaPrincipal();
}

// Funções Específicas de Cadastro (Chamadas pelos botões)

function incluirUsuario(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.some(u => u.email === email)) {
        alert('Erro: Este e-mail já está cadastrado.');
        return;
    }
    // O nome é opcional, mas o email e senha são obrigatórios.
    incluirRegistro('usuarios', { email: email, senha: senha }); 
}

function incluirLivro(titulo, autor) {
    incluirRegistro('livros', { titulo: titulo, autor: autor });
}

function incluirAutor(nome) {
    incluirRegistro('autores', { nome: nome });
}


// ====================================================================
// INICIALIZAÇÃO
// ====================================================================

// Chamada da função de segurança ao carregar qualquer página
document.addEventListener('DOMContentLoaded', verificarLogin);