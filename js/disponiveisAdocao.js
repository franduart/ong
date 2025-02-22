import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRFQ7hrd2H_RJt12QTXzNysOT7xqTIL70",
  authDomain: "ong-alma-viralata-2951a.firebaseapp.com",
  projectId: "ong-alma-viralata-2951a",
  storageBucket: "ong-alma-viralata-2951a.appspot.com",
  messagingSenderId: "549152571646",
  appId: "1:549152571646:web:6747b8b3df10411880e5af",
  measurementId: "G-QGV0CP4Q6W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos do DOM
const adotarDiv = document.getElementById('resultados');
const porteSelect = document.getElementById("porte");
const idadeSelect = document.getElementById("idade");
const sexoSelect = document.getElementById("sexo");

let lastVisible = null;  // Último cachorro da página
let currentPage = 1;    // Página atual
const PAGE_SIZE = 4;    // Número de cachorros por página

// Função auxiliar para criar cards
function criarDogCard(data, id) {
    const dogCard = document.createElement('div');
    dogCard.classList.add('dog');

    dogCard.innerHTML = `
        <a href="formadocao.html?id=${id}">
            <img src="${data.imageUrl}" alt="${data.nome}" width="200">
            <h3>${data.nome}</h3>
            <p>Idade: ${data.idade}</p>
            <p>Sexo: ${data.sexo}</p>
            <strong>Porte: ${data.porte}</strong>
            <button class="btnAdotarForm" type="button">Conheça minha história</button>
        </a>`;
    return dogCard;
}

// Função para construir os filtros com base nas seleções
function construirFiltros() {
    const filtros = [];
    
    if (porteSelect && porteSelect.value) {
        filtros.push(where("porte", "==", porteSelect.value)); // Filtro por porte
    }
    if (idadeSelect && idadeSelect.value) {
        filtros.push(where("idade", "==", idadeSelect.value)); // Filtro por idade
    }
    if (sexoSelect && sexoSelect.value) {
        filtros.push(where("sexo", "==", sexoSelect.value)); // Filtro por sexo
    }

    return filtros;
}

// Função para executar consultas ao Firestore com filtros
async function executarConsulta(filtros = [], lastVisible = null) {
    let queryRef = collection(db, "cachorros");

    // Aplica a ordenação por nome (ou outro campo relevante)
    queryRef = query(queryRef, orderBy("nome"), limit(PAGE_SIZE));

    // Aplica os filtros (porte, idade, sexo)
    if (filtros.length > 0) {
        queryRef = query(queryRef, ...filtros);
    }

    // Se estamos em uma página posterior, usa startAfter(lastVisible)
    if (lastVisible) {
        queryRef = query(queryRef, startAfter(lastVisible));
    }

    return await getDocs(queryRef);
}

// Função para carregar cachorros com paginação e filtros
async function carregarCachorrosComPaginacao() {
    try {
        const filtros = construirFiltros();  // Constrói filtros com base na seleção
        const querySnapshot = await executarConsulta(filtros, lastVisible);

        if (querySnapshot.empty) {
            adotarDiv.innerHTML = "<p>Nenhum cachorro encontrado.</p>";
            return;
        }

        adotarDiv.innerHTML = "";  // Limpa os cards existentes
        querySnapshot.forEach((doc) => {
            const dogCard = criarDogCard(doc.data(), doc.id);
            adotarDiv.appendChild(dogCard);
        });

        // Atualiza o ponto de início para a próxima página
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    } catch (error) {
        console.error("Erro ao buscar cachorros: ", error);
        adotarDiv.innerHTML = "<p>Erro ao carregar os cachorros. Tente novamente mais tarde.</p>";
    }
}

// Função para carregar a próxima página
async function carregarProximaPagina() {
    if (!lastVisible) return;  // Se não houver mais cachorros, não faz nada
    currentPage++;
    await carregarCachorrosComPaginacao();  // Chama a consulta com a última posição
}

// Função para carregar a página anterior
async function carregarPaginaAnterior() {
    if (currentPage <= 1) return;  // Não pode ir para página anterior se estiver na primeira
    currentPage--;
    lastVisible = null;  // Limpa o último documento para resetar a consulta
    await carregarCachorrosComPaginacao();  // Recarrega os cachorros
}

// Função para buscar cachorros filtrados
async function buscarDados() {
    currentPage = 1; // Resetar para a primeira página ao aplicar filtros
    lastVisible = null; // Limpar o ponto de início da consulta
    await carregarCachorrosComPaginacao();  // Chama a função para carregar cachorros com filtros
}

// Eventos de filtro
[porteSelect, idadeSelect, sexoSelect].forEach((select) => {
    if (select) {
        select.addEventListener("change", buscarDados);  // Recarregar os cachorros ao mudar filtro
    }
});

// Eventos de paginação
document.getElementById("nextPage").addEventListener("click", carregarProximaPagina);
document.getElementById("prevPage").addEventListener("click", carregarPaginaAnterior);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarCachorrosComPaginacao();  
});


function menuMobile(){
    const btnMenu = document.querySelector('.btnMenu')
    btnMenu.addEventListener('click', ()=>{
        const navBar = document.querySelector('.navBar')
        navBar.classList.toggle('active')
    })
}

menuMobile()