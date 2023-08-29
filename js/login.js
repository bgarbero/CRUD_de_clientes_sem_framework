//capturando os três campos da tela
let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');

//captura do evento clicar botão
btnEntrar.addEventListener('click', () => {

    //pegar o email digitado
    let userEmail = email.value;

    //pegar a senha digitada
    let userSenha = senha.value;

    //validar se o email e senha estão corretos
    if (!userEmail || !userSenha) {
        //caso esteja incorreto, mandar mensagem de usuário e senha inválida
        alert('O campo de e-mail e senha são obrigatórios');
        return;
    }

    //envio de dados para o backend para sabermos se ele poderá usar o sistema
    autenticar(userEmail, userSenha);
})

//criando a função autenticar no backend
function autenticar(email, senha) {
    const urlBase = `http://localhost:3400`;

    fetch(`${urlBase}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response.json())
        .then(response => {
            if (!!response.mensagem) {
                alert(response.mensagem);
                return;
            } else {
                alert('Usuário autenticado com sucesso!');
                salvarToken(response.token);
                salvarUsuario(response.usuario);

                window.open('crud.html', '_self');
            }
        })
}

function salvarToken(token) {
    localStorage.setItem('token', token)
}

function salvarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario))
}

//como acionar o botão com enter?