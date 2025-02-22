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
              <button class="btnAdotarForm">Adotar ${dogData.nome}</button>
            </div>
            <p id="dogDescription" class="descricao">${dogData.description || "Descrição não disponível."}</p>
          </div>
        `;

        // Adiciona o evento ao botão de adoção
        const btnAdotarForm = document.querySelector('.btnAdotarForm');
        btnAdotarForm.addEventListener('click', abrirModalForm);

    } catch (error) {
        console.error("Erro ao buscar dados do cachorro:", error);
        formAdocao.innerHTML = `<p>Ocorreu um erro ao carregar as informações. Tente novamente mais tarde.</p>`;
    }

    // Função para abrir o modal
    function abrirModalForm() {
        // Crie ou exiba um modal
        const modal = document.querySelector('#formAdocao'); // Verifique se existe um modal com ID #modal
        if (modal) {
            modal.style.display = 'flex'; // Mostra o modal
        } else {
            alert('Modal ainda não implementado.');
        }
    }

    
});


// Função para abrir o modal
function fecharModal() {
       
    const modal = document.querySelector('#close'); 
    modal.addEventListener('click', ()=>{
        const form = document.getElementById('formAdocao')
        if (form) {
            form.style.display = 'none'; 
           
        } else {
            alert('Modal ainda não implementado.');
        }
    })
}
fecharModal()