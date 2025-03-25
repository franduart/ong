import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

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
const storage = getStorage(app);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

document.addEventListener("DOMContentLoaded", () => {
    buscarDados(id);
});

// ✅ Buscar dados do Firestore
async function buscarDados(id) {
    if (!id) {
        console.error("ID não encontrado na URL");
        return;
    }

    try {
        const docRef = doc(db, "cachorros", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data();
            console.log("Dados do Firebase:", dados);
            exibirNaTela(dados);
        } else {
            console.warn("Nenhum documento encontrado!");
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }
}

// ✅ Exibir os dados na tela
async function exibirNaTela(dados) {
    console.log("Exibindo dados na tela:", dados);

    const nomeDog = document.getElementById("nome");
    const imgDog = document.getElementById("dogImage");
    const descricao = document.getElementById("descricao");
    const temponaong = document.getElementById("temponaong");
    const custos = document.getElementById("custosMensais");

    if (!nomeDog || !descricao || !temponaong || !imgDog || !custos) {
        console.error("Erro: Elementos do DOM não encontrados!");
        return;
    }

    nomeDog.textContent = dados.nome || "Nome não disponível";
    descricao.textContent = dados.description || "Descrição não disponível";
    temponaong.textContent = "Na Ong desde: " + dados.data  || "Data não disponível";
    custos.textContent = dados.custosMensais ? `Custos mensais: R$ ${dados.custosMensais},00` : "Custos não disponíveis";

    // ✅ Verifica se há uma URL de imagem válida
    if (dados.imageUrl) {
        try {
            console.log("Buscando imagem:", dados.imageUrl);
            const imagePath = ref(storage, dados.imageUrl);
            const url = await getDownloadURL(imagePath);
            imgDog.src = url;
            imgDog.alt = `Foto de ${dados.nome}`;
        } catch (error) {
            console.error("Erro ao carregar imagem do Firebase Storage:", error);
        }
    } else {
        console.warn("Nenhuma URL de imagem encontrada no Firestore.");
    }

    // ✅ Adiciona evento ao botão "Apadrinhar"
    const btnApadrinhar = document.getElementById("apadrinhar");

    if (btnApadrinhar) {
        btnApadrinhar.addEventListener("click", async (e) => {
            e.preventDefault();
            if (dados.custosMensais) {
                processarPagamento(dados.custosMensais); 
            } else {
                console.error("Erro: Custos mensais não encontrados!");
            }
        });
}
}

// ✅ Função para processar pagamento
async function processarPagamento(custos) {
    if (!custos) {
        console.error("Erro: Custos não disponíveis para o apadrinhamento.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5500/create_preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: custos }) 
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url; 
        } else {
            console.error("Erro ao obter URL de pagamento");
        }
    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
    }
}

