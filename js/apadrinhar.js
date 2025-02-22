import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

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

document.addEventListener('DOMContentLoaded', async ()=>{
    const dogForm = document.getElementById('dogForm');
    const messageDiv = document.getElementById('message');

    if (dogForm) {
        dogForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dogName = document.getElementById('dogName').value;
            const dogAge = document.getElementById('dogAge').value;
            const dogBreed = document.getElementById('dogBreed').value;
            const dogDescription = document.getElementById('dogDescription').value;
            const dogImage = document.getElementById('dogImage').files[0];
            const porte = document.getElementById('porte').value;
            const dogSex = document.getElementById('sexo').value
            const data = document.getElementById('data').value

            try {
                // Upload da imagem no Firebase Storage
                const storageRef = ref(storage, `dogs/${dogImage.name}`);
                const snapshot = await uploadBytes(storageRef, dogImage);
                const imageUrl = await getDownloadURL(snapshot.ref);

                // Adiciona os dados ao Firestore
                const docRef = await addDoc(collection(db, "cachorros"), {
                    nome: dogName,
                    idade: dogAge,
                    breed: dogBreed,
                    description: dogDescription,
                    imageUrl: imageUrl,
                    porte: porte ,
                    sexo: dogSex,
                    data: data
                   

                });

                messageDiv.textContent = `Cachorro cadastrado com sucesso! ID do documento: ${docRef.id}`;
                messageDiv.style.color = "green";
                dogForm.reset();

                

            } catch (error) {
                console.error("Erro ao cadastrar cachorro: ", error);
                messageDiv.textContent = "Erro ao cadastrar cachorro. Tente novamente.";
                messageDiv.style.color = "red";
            }
            fetchCachorros()
        });
    }

    async function fetchCachorros() {
        const adotarDiv = document.querySelector('.card-dog');
        if (!adotarDiv) return;
    
        adotarDiv.innerHTML = ""; // Limpa a área antes de renderizar
       
    
        try {
            const querySnapshot = await getDocs(collection(db, "cachorros"));
            let count = 0; // Contador para limitar a 10 cards
    
            querySnapshot.forEach((doc) => {
                if (count >= 10) return;
    
                const dogData = doc.data();
    
                // Valores padrão
                const nome = dogData.nome || 'Nome não disponível';
                const idade = dogData.idade || 'Idade desconhecida';
                const porte = dogData.porte || 'Porte não informado';
                const imageUrl = dogData.imageUrl || 'images/default-dog.jpg';
    
                // Cria o card
                const dogCard = document.createElement('div');
                dogCard.classList.add('dog-card');
    
                // Adiciona o evento de clique
                dogCard.addEventListener('click', () => paginaAdotar(dogData.id));
    
                // Preenche o HTML do card
                dogCard.innerHTML = `
                   <a href="/pages/apadrinhar.html?id=${doc.id}">
                    <img src="${dogData.imageUrl}" alt="${dogData.nome}" width="200">
                    <h3>${dogData.nome}</h3>
                    <p>${dogData.sexo}</p>
                    <p>${dogData.idade}</p>
                    <p class="data">No abrigo desde:${dogData.data}</p>
                    <strong>Porte: ${dogData.porte}</strong>
                    <button class="btnAdotar" type="button" onclick="${paginaAdotar()}">Adotar</button>
                    <a class="btnApadrinhar"  href="/pages/pagamento.html?id=${doc.id}">Apadrinhar</a>
                </a>
                `;
    
                adotarDiv.appendChild(dogCard);
                count++;
                
            });
        } catch (error) {
            console.error("Erro ao buscar cachorros: ", error);
            adotarDiv.innerHTML = "<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
            
        }
       
    }
    
  
    fetchCachorros();
    
    
    async function paginaAdotar() {
        document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id'); 
        
            if (!id) {
                document.body.innerHTML = "<p>ID do cachorro não encontrado. Por favor, volte para a página anterior.</p>";
                return;
            }
        
            try {
                const docRef = doc(db, "cachorros", id);
                const snapshot = await getDoc(docRef);
        
                if (snapshot.exists()) {
                    const dogData = snapshot.data();
    
                    const dogNameElement = document.getElementById('dogNameHeader');
                    const dogImageElement = document.getElementById('dogImageUrl');
                    const dogDescriptionElement = document.getElementById('dogDescription');
    
                    if (dogNameElement) {
                        dogNameElement.innerText = `Interesse em adotar: ${dogData.nome}`;
                    }
                    if (dogImageElement) {
                        dogImageElement.src = dogData.imageUrl;
                    }
                    if (dogDescriptionElement) {
                        dogDescriptionElement.innerText = dogData.description;
                    }

                } else {
                    document.body.innerHTML = "<p>Cachorro não encontrado. Por favor, tente novamente mais tarde.</p>";
                }
            } catch (error) {
                console.error("Erro ao buscar dados do cachorro:", error);
                document.body.innerHTML = "<p>Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.</p>";
            }
        });
    }
    
 
paginaAdotar()
})