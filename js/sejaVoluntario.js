import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

function sejaVoluntario() {
    const formSejaVoluntario = document.getElementById('formSejaVoluntario');
    formSejaVoluntario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const disponibilidade = document.getElementById('disponibilidade').value.trim();
        const habilidades = document.getElementById('habilidades').value.trim();
        const messageDiv = document.getElementById('messageDiv');

        if (!nome || !email || !telefone || !disponibilidade || !habilidades) {
            messageDiv.textContent = "Por favor, preencha todos os campos.";
            messageDiv.style.color = "red";
            return;
        }

        try {
            // Adicionar ao Firestore
            await addDoc(collection(db, "voluntariado"), {
                nome,
                email,
                telefone,
                disponibilidade,
                habilidades,
                timestamp: new Date() // Adiciona um timestamp para controle
            });

            // Enviar para Google Apps Script
            const data = { nome, email, telefone, disponibilidade, habilidades };
            await fetch('https://script.google.com/macros/s/AKfycbwmo-0Ph5I-JxgLTO3eoOamCr3iUxmy0_tvu6hYfswf7Vz952IMIUycSSa6gzrMY7nN/exec', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                mode: 'no-cors'
            });

            // Feedback para o usuário
            messageDiv.textContent = "Formulário enviado com sucesso!";
            messageDiv.style.color = "green";
            formSejaVoluntario.reset();

            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'voluntariadoContato.html';
            }, 2000);
        } catch (error) {
            console.error("Erro ao cadastrar voluntário:", error);
            messageDiv.textContent = "Ocorreu um erro ao realizar o cadastro. Tente novamente.";
            messageDiv.style.color = "red";
        }
    });
}

sejaVoluntario();
