const URL = 'http://localhost:3400/clientes';

let modoEdicao = false;
let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaCliente = document.querySelector('table>tbody');//observar essa variável
let modalCliente = new bootstrap.Modal(document.getElementById('modal-cliente'), {});
let tituloModal = document.querySelector('h4.modal-title');

//botão adicionar funcionando
btnAdicionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = 'Adicionar Cliente';
    modalCliente.show();
});

//função para obter os clientes da API
function obterClientes() {
    fetch(URL, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            popularTabela(response)
        })
        .catch()
};

//função para editar clientes
function editarClientes(id) {
    modoEdicao = true;
    tituloModal.textContent = 'Editar Cliente';
    modalCliente.show();
}

function excluirCliente(id) {
    alert('Aqui vou exclir o cliente ' + id);
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
    tdDataCadastro.textContent = cliente.dataCadastro;

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

function popularTabela(clientes){
    console.log(clientes)
    clientes.forEach(cliente =>  {
        criarLinhaNaTabela(cliente)
    });
}

obterClientes();