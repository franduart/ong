import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRFQ7hrd2H_RJt12QTXzNysOT7xqTIL70",
  authDomain: "ong-alma-viralata-2951a.firebaseapp.com",
  projectId: "ong-alma-viralata-2951a",
  storageBucket: "ong-alma-viralata-2951a.appspot.com",
  messagingSenderId: "549152571646",
  appId: "1:549152571646:web:6747b8b3df10411880e5af",
  measurementId: "G-QGV0CP4Q6W",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Função para salvar os dados no Firestore
async function saveDataToFirestore(data) {
  try {
    await setDoc(doc(db, "formAdocao", data.email), data);
    document.getElementById("mensagemContainer").innerText =
      "Formulário enviado com sucesso!";
      window.location.href = '/pages/entraremosemcontato.html'
    console.log("Dados salvos no Firebase com sucesso!", data);
  } catch (error) {
    document.getElementById("mensagemContainer").innerText =
      "Erro ao enviar o formulário. Tente novamente.";
    console.error("Erro ao salvar no Firebase:", error);
  }
}

// Função para enviar os dados ao Apps Script
async function sendDataToAppsScript(data) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycby7-PqhBUqUisobxS9moXYxH3b01rxcTdozHJuYzOOIQGA7Ls1M166cCtEuoHpF5wCbOQ/exec', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: 'no-cors',  // Impede o erro de CORS, mas não acessa o conteúdo da resposta
    })
    .then(response => {
      // Resposta não será acessível devido ao 'no-cors'
      console.log("Requisição enviada.");
    })
    .catch(error => {
      console.error("Erro ao enviar dados:", error);
    });
  } catch (error) {
    console.error("Erro ao enviar para o Apps Script:", error);
  }
}

// Event Listener para o envio do formulário
document.getElementById("formAdocao").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  // Coleta os dados do formulário
  const formData = {
    data: new Date(),
    dogName: document.getElementById("dogNameForm").textContent,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    localidade: document.getElementById("localidade").value,
    email: document.getElementById("email").value,
    tel: document.getElementById("tel").value,
    currentWork: document.getElementById("currentWork").value,
    homeStatus: document.getElementById("homeStatus").value,
    ownerApproval:
      document.querySelector('input[name="ownerApproval"]:checked')?.value ||
      "",
    residentsApproval:
      document.querySelector('input[name="residentsApproval"]:checked')?.value ||
      "",
    hasPets: document.querySelector('input[name="hasPets"]:checked')?.value || "",
    vaccination: document.getElementById("vaccination").value,
    houseMembers: document.getElementById("houseMembers").value,
    animalLocation: document.getElementById("animalLocation").value,
    contactAgreement: document.getElementById("contactAgreement").checked,
  };

  // Salva os dados no Firebase e envia para o Apps Script
  saveDataToFirestore(formData);
  sendDataToAppsScript(formData);

  // (Opcional) Reinicia o formulário
  this.reset();
});
