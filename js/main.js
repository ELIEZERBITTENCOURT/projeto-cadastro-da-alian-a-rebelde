const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

//armazena no localstorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_cadete')) ?? []
const setLocalStorage = (dbCadete) => localStorage.setItem("db_cadete", JSON.stringify(dbCadete))

// CRUD - criar - ler - alterar - deletar
//deletar
const deleteCadete = (index) => {
    const dbCadete = readCadete()
    dbCadete.splice(index, 1)
    setLocalStorage(dbCadete)
}
//sobe alterações
const updateCadete = (index, cadete) => {
    const dbCadete = readCadete()
    dbCadete[index] = cadete
    setLocalStorage(dbCadete)
}
//lê o banco
const readCadete = () => getLocalStorage()
//criar
const createCadete = (cadete) => {
    const dbCadete = getLocalStorage()
    dbCadete.push(cadete)
    setLocalStorage(dbCadete)
}
//valida informação
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout
//limpa informações
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('name').dataset.index = 'new'
}
//salva informação
const saveCadete = () => {
    debugger
    if (isValidFields()) {
        const cadete = {
            nome: document.getElementById('name').value,
            planeta: document.getElementById('planeta').value,
            date: document.getElementById('date').value,
            motivo: document.getElementById('motivo').value
        }
        const index = document.getElementById('name').dataset.index
        if (index == 'new') {
            createCadete(cadete)
            updateTable()
            closeModal()
        } else {
            updateCadete(index, cadete)
            updateTable()
            closeModal()
        }
    }
}
// cria novas linhas no HTML

const createRow = (cadete, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${cadete.nome}</td>
        <td>${cadete.planeta}</td>
        <td>${cadete.date}</td>
        <td>${cadete.motivo}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableCadete>tbody').appendChild(newRow)
}

//limpa tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tableCadete>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))//pega pai de cada linha e remove o filho chamado row
}
//altera tabela
const updateTable = () => {
    const dbCadete = readCadete()
    clearTable()
    dbCadete.forEach(createRow)
}
//lista informações = preencher campos
const fillFields = (cadete) => {
    document.getElementById('name').value = cadete.nome
    document.getElementById('planeta').value = cadete.planeta
    document.getElementById('date').value = cadete.date
    document.getElementById('motivo').value = cadete.motivo
    document.getElementById('name').dataset.index = cadete.index // index para preencher campo
}

const editCadete = (index) => {
    const cadete = readCadete()[index]
    cadete.index = index
    fillFields(cadete)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editCadete(index)
        } else {
            const cadete = readCadete()[index]
            const response = confirm(`Deseja realmente excluir o cadete ${cadete.nome}`)
            if (response) {
                deleteCadete(index)
                updateTable()
            }
        }
    }
}

updateTable()

const filtrarTabela = () => {
    const input = document.getElementById('filter');
    const trs = [...document.querySelectorAll('tbody tr')];

    input.addEventListener('input', () => {
        const search = input.value.toLowerCase();
        trs.forEach(el => {
            const matches = el.textContent.toLowerCase().includes(search);
            el.style.display = matches ? ' ' : 'none';
        });
    });
};


// Eventos
document.getElementById('cadastrarCadete')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveCadete)

document.querySelector('#tableCadete>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.getElementById('filter')
    .addEventListener('keyup', filtrarTabela)