const URL = 'http://localhost:3400/clientes';
let modoEdicao = false;

let listaClientes = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let tabelaCliente = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById('modal-cliente'), {});
let tituloModal = document.querySelector('h4.modal-title');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    telefone: document.getElementById('telefone'),
    cpf: document.getElementById('cpf'),
    dataCadastro: document.getElementById('dataCadastro'),
}

//botão adicionar funcionando
btnAdicionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = 'Adicionar Cliente';
    limparModalCliente();
    modalCliente.show();
});

btnSalvar.addEventListener('click', () => {
    //capturar os dados do modal
    let cliente = obterClienteDoModal();

    //se os campos obrigatórios foram preenchidos
    if (!cliente.nome || !cliente.telefone) {
        alert('Nome e telefone são obrigatórios!');
        return;
    }

    // if(modoEdicao == true){
    //     atualizarClienteBackEnd(cliente);
    // }else{
    //     adicionarClienteBackEnd(cliente);
    // }

    (modoEdicao) ? atualizarClienteBackEnd(cliente) : adicionarClienteBackEnd(cliente);
    //enviar o cadastro para o back end
    //adicionarClienteBackEnd(cliente); 
    //atualizar a tabela com o novo cliente

});

btnCancelar.addEventListener('click', () => {
    modalCliente.hide();
});

function obterClienteDoModal() {
    return new Cliente({
        id: formModal.id.value,
        email: formModal.email.value,
        nome: formModal.nome.value,
        telefone: formModal.telefone.value,
        cpfOuCnpj: formModal.cpf.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    })
}

function obterClientes() {
    fetch(URL, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(clientes => {
            listaClientes = clientes;
            popularTabela(clientes)
        })
        .catch()
};

function editarCliente(id) {
    modoEdicao = true;
    tituloModal.textContent = 'Editar Cliente';

    let cliente = listaClientes.find(cliente => cliente.id == id);

    atualizarModalCliente(cliente);

    modalCliente.show();

}

function atualizarModalCliente(cliente) {

    formModal.id.value = cliente.id;
    formModal.nome.value = cliente.nome;
    formModal.telefone.value = cliente.telefone;
    formModal.email.value = cliente.email;
    formModal.cpf.value = cliente.cpfOuCnpj;
    formModal.dataCadastro.value = cliente.dataCadastro.substring(0, 10);
}

function limparModalCliente() {

    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.telefone.value = "";
    formModal.email.value = "";
    formModal.cpf.value = "";
    formModal.dataCadastro.value = "";
}

function excluirCliente(id) {
    let cliente = listaClientes.find(c => c.id == id);

    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)){
        excluirClienteBackEnd(cliente);
    }

}

function criarLinhaNaTabela(cliente) {
    let tr = document.createElement('tr');

    //criando tds
    let tdID = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdCPF = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdTelefone = document.createElement('td');
    let tdAcoes = document.createElement('td');
    let tdDataCadastro = document.createElement('td');

    //atualizar as tds com os valores do cliente
    tdID.textContent = cliente.id;
    tdNome.textContent = cliente.nome;
    tdCPF.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdTelefone.textContent = cliente.telefone;
    tdDataCadastro.textContent = new Date(cliente.dataCadastro).toLocaleDateString();

    tdAcoes.innerHTML = `<button id="btn-editar" onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                            Editar
                        </button>
                        <button id="btn-excluir" onclick="excluirCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                            Excluir
                        </button>`;

    //adicionar as tds dentro da linha que eu criei
    tr.appendChild(tdID);
    tr.appendChild(tdNome);
    tr.appendChild(tdCPF);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    //adicionar a linha na tabela
    tabelaCliente.appendChild(tr);
}

function popularTabela(clientes) {
    tabelaCliente.textContent = "";
    clientes.forEach(cliente => {
        criarLinhaNaTabela(cliente)
    });
}

function adicionarClienteBackEnd(cliente) {
    cliente.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => response.json())
        .then(response => {
            let novoCliente = new Cliente(response);
            listaClientes.push(novoCliente);
            popularTabela(listaClientes);
            modalCliente.hide();
        })
        .catch(error => {
            console.log(error)
        })
}

function atualizarClienteBackEnd(cliente) {

    fetch(`${URL}/${cliente.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        },
        body: JSON.stringify(cliente)
    })
        .then(response => response.json())
        .then(() => {
            atualizarClienteNaLista(cliente, false);
            modalCliente.hide();
        })
        .catch(error => {
            console.log(error)
        })
}

function atualizarClienteNaLista(cliente, removerCliente) {
    let indice = listaClientes.findIndex((c) => c.id == cliente.id);

    (removerCliente) 
    ? listaClientes.splice(indice, 1, )
    : listaClientes.splice(indice, 1, cliente);

    popularTabela(listaClientes);
}

function excluirClienteBackEnd(cliente) {

    fetch(`${URL}/${cliente.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token'
        },
    })
        .then(response => response.json())
        .then(() => {
            atualizarClienteNaLista(cliente, true);
            modalCliente.hide();
        })
        .catch(error => {
            console.log(error)
        })
}

obterClientes();