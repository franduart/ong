import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRFQ7hrd2H_RJt12QTXzNysOT7xqTIL70",
  authDomain: "ong-alma-viralata-2951a.firebaseapp.com",
  projectId: "ong-alma-viralata-2951a",
  storageBucket: "ong-alma-viralata-2951a.appspot.com",
  messagingSenderId: "549152571646",
  appId: "1:549152571646:web:6747b8b3df10411880e5af",
  measurementId: "G-QGV0CP4Q6W"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); 
const storage = getStorage(app);

export { db, auth, storage };

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const errorMessage = document.getElementById('error-message');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                errorMessage.style.display = "none";
                console.log('Login realizado com sucesso!', userCredential);

                document.getElementById('email').value = '';
                document.getElementById('password').value = '';

                

                // Redireciona para a página 'admin.html'
                window.location.href = "admin.html";
                // Exibir o email do usuário na página
                document.getElementById('user').innerText = userCredential.user.email;

            } catch (error) {
                errorMessage.style.display = "block";
                console.error('Erro ao realizar login', error);
                if (errorMessage) {
                    errorMessage.style.display = "block";
                    errorMessage.textContent = "Erro ao realizar login. Verifique suas credenciais.";
                }
            }
        });
    } else {
        console.log("Elemento 'loginForm' não encontrado no DOM.");
    }
});
