import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const formAdocao = document.querySelector('.descricao-dog');

    // Obter o ID do cachorro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const dogId = urlParams.get('id');

    // Verifica se o ID está presente
    if (!dogId) {
        formAdocao.innerHTML = `<p>O ID do cachorro não foi fornecido.</p>`;
        return;
    }

    try {
        // Busca o documento no Firestore usando o ID
        const dogRef = doc(db, "cachorros", dogId);
        const dogSnap = await getDoc(dogRef);

        // Verifica se o documento existe
        if (!dogSnap.exists()) {
            formAdocao.innerHTML = `<p>Cachorro não encontrado.</p>`;
            return;
        }

        // Recupera os dados do documento
        const dogData = dogSnap.data();

        // Renderiza os dados na página
        formAdocao.innerHTML = `
          <div class="descricao-dog">
            <div class="descricao-div">
              <label id="dogName" class="Interesse">Interesse em adotar: ${dogData.nome}</label>
              <img id="dogImageUrl" width="200" alt="${dogData.nome}" class="dogImageUrl" src="${dogData.imageUrl}">
              <div class="miniimages">
                <a href="#"> <img src="/assets/IMG-20241002-WA0008.jpg" width="50"></a>
                <a href="#"> <img src="/assets/IMG-20241002-WA0008.jpg" width="50"></a>
              </div>
              <button class="btnAdotarForm" onclick="preencherNomeCachorro()">Adotar ${dogData.nome}</button>
            </div>
            <p id="dogDescription" class="descricao">${dogData.description || "Descrição não disponível."}</p>
          </div>
        `;

        // Adiciona o evento ao botão de adoção
        const btnAdotarForm = document.querySelector('.btnAdotarForm');
        if (btnAdotarForm) {
            btnAdotarForm.addEventListener('click', abrirModalForm);
        }

    } catch (error) {
        console.error("Erro ao buscar dados do cachorro:", error);
        formAdocao.innerHTML = `<p>Ocorreu um erro ao carregar as informações. Tente novamente mais tarde.</p>`;
    }
});

// ✅ Função para abrir o modal
function abrirModalForm() {
    const modal = document.querySelector('#formAdocao');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert('Modal ainda não implementado.');
    }
}

// ✅ Função para fechar o modal
function fecharModal() {
    const btnFechar = document.querySelector('#close');
    if (!btnFechar) {
        console.error("Botão de fechar modal não encontrado.");
        return;
    }

    btnFechar.addEventListener('click', () => {
        const form = document.getElementById('formAdocao');
        if (form) {
            form.style.display = 'none';
        } else {
            console.error("Modal não encontrado.");
        }
    });
}

// Chamar a função apenas quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", fecharModal);

// ✅ Função corrigida para preencher o nome do cachorro no formulário
function preencherNomeCachorro() {
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('id'); 

    const dogNameForm = document.getElementById('dogNameForm');
    if (dogNameForm) {
        dogNameForm.textContent = nome || "Nome não disponível"; 
    } else {
        console.error("Elemento dogNameForm não encontrado.");
    }
}
