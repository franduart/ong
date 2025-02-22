import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

// Inicializando o Firebase fora do DOMContentLoaded para garantir que `storage` esteja disponível globalmente
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

async function dashBoard() {
    try {
        const querySnapshot = await getDocs(collection(db, "cachorros"));
        const cachorrosCount = querySnapshot.size;

        // Exibe o número de cachorros
        document.getElementById('salesCount').textContent = cachorrosCount; 

        // Inicializa o total das doações
        let totalDoacoes = 0;
        const totalDoacoesElement = document.getElementById('profit'); // Elemento para exibir o total

        // Busca as doações no Firestore e soma os valores
        const doacaoSnapshot = await getDocs(collection(db, "doacao"));
        doacaoSnapshot.forEach((doc) => {
            const doacaoData = doc.data();
            const valorDoacao = parseFloat(doacaoData.valorDoacao) || 0;
            totalDoacoes += valorDoacao;
        });

        // Atualiza o total de doações na página
        if (totalDoacoesElement) {
            totalDoacoesElement.textContent = `Total arrecadado: R$ ${totalDoacoes.toFixed(2)}`;
        }

        // Exibe o número de usuários (fixo)
        document.getElementById('userCount').textContent = 1200; // Exemplo fixo

        // Criar um gráfico usando Chart.js
        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Gráfico Mensal de adoções',
                    data: [5, 10, 5, 7, 8, 4], // Dados fixos do gráfico (pode ser dinâmico conforme sua necessidade)
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
    }
}

// Chama a função para renderizar o dashboard
dashBoard();



function btnDashboard() {
    let btnDash = document.getElementById('btnDash');
    let sidebar = document.querySelector('.sidebar');

    if (btnDash && sidebar) {
        btnDash.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            
            // Atualiza o atributo de acessibilidade
            const expanded = btnDash.getAttribute('aria-expanded') === 'true';
            btnDash.setAttribute('aria-expanded', !expanded);
        });
    } else {
        console.error('Botão ou sidebar não encontrados!');
    }
}

btnDashboard();
