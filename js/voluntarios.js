import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
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

document.addEventListener('DOMContentLoaded', () => {
    fecthVoluntarios();
});

async function voluntarios() {
    
 const voluntarioForm = document.getElementById('voluntarioForm');
    const messageDiv = document.getElementById('message');

    if (voluntarioForm) {
        voluntarioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const imgVoluntario = document.getElementById('imgVoluntario').files[0];
            const funcao = document.getElementById('funcao').value;
            
            try {
                // Upload da imagem no Firebase Storage
                const storageRef = ref(storage, `voluntarios/${imgVoluntario.name}`);
                const snapshot = await uploadBytes(storageRef, imgVoluntario);
                const imageUrl = await getDownloadURL(snapshot.ref);

                // Adiciona os dados ao Firestore
                const docRef = await addDoc(collection(db, "voluntarios"), {
                    nome: nome,
                    description: funcao,
                    imageUrl: imageUrl,
                   
                   

                });

                messageDiv.textContent = `Voluntário cadastrado com sucesso! ID do documento: ${docRef.id}`;
                messageDiv.style.color = "green";
                voluntarioForm.reset();

                

            } catch (error) {
                console.error("Erro ao cadastrar voluntario: ", error);
                messageDiv.textContent = "Erro ao cadastrar voluntario. Tente novamente.";
                messageDiv.style.color = "red";
            }
            fecthVoluntarios()
          
        });
    }
}

     
voluntarios()

async function fecthVoluntarios() {
    const voluntariosGrid = document.querySelector('.voluntarios-grid');

    if (!voluntariosGrid) {
        console.error("Elemento '.voluntarios-grid' não encontrado.");
        return;
    }

    voluntariosGrid.innerHTML = ''; 

    try {
        const querySnapshot = await getDocs(collection(db, "voluntarios"));
        let count = 0; 

        querySnapshot.forEach((doc) => {
            if (count >= 10) return; // Exibe até 10 voluntários

            const docData = doc.data();

            const nome = docData.nome || 'Nome não disponível';
            const funcao = docData.description || 'Função não especificada';
            const imageUrl = docData.imageUrl || 'images/default-volunteer.jpg';

            // Criação dos elementos do card
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('voluntario-card');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Foto do voluntário ${nome}`;

            const nomeHeading = document.createElement('h3');
            nomeHeading.textContent = nome;

            const funcaoParagraph = document.createElement('p');
            funcaoParagraph.textContent = funcao;

            // Adiciona os elementos ao card
            cardDiv.appendChild(img);
            cardDiv.appendChild(nomeHeading);
            cardDiv.appendChild(funcaoParagraph);

            // Adiciona o card à grid
            voluntariosGrid.appendChild(cardDiv);

            count++;
        });
    } catch (error) {
        console.error("Erro ao buscar voluntários: ", error);
        voluntariosGrid.innerHTML = "<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
    }
}
