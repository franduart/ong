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
export const storage = getStorage(app); 


function hideSpinner() {
    // Espera o conteúdo da página ser completamente carregado
    window.addEventListener('load', () => {
        const divSpinner = document.querySelector('.spinner');
        // Após carregar o DOM, esconde o spinner
        divSpinner.style.display = 'flex'; // Esconde o spinner
        document.body.style.backgroundColor = '#fff'
    });
}



//HERO
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
            const custos = document.getElementById('custos').value

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
                    data: data,
                    custosMensais: custos
                   

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
                   <a href="/pages/formadocao.html?id=${doc.id}">
                    <img src="${dogData.imageUrl}" alt="${dogData.nome}" width="200">
                    <h3>${dogData.nome}</h3>
                    <p>${dogData.sexo}</p>
                    <p>${dogData.idade}</p>
                    <p class="data">No abrigo desde:${dogData.data}</p>
                    <strong>Porte: ${dogData.porte}</strong>
                    <button class="btnAdotar" type="button" onclick="${paginaAdotar()}">Adotar</button>
                    <a class="btnApadrinhar" href="/pages/apadrinhar.html?id=${doc.id}&custos=${dogData.custosMensais}">Apadrinhar</a>

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

                    const apadrinhar = document.getElementById('apadrinhar');
                    apadrinhar.innerHTML = `
                    <img src="${dogData.imageUrl}" alt="${dogData.nome}" width="200">
                    <h3>${dogData.nome}</h3>
                    <p>${dogData.sexo}</p>
                    <p>${dogData.idade}</p>
                    <p class="data">No abrigo desde:${dogData.data}</p>
                    <strong>Porte: ${dogData.porte}</strong>
                    <button class="btnAdotar" type="button" onclick="paginaAdotar()">Adotar</button>
                    <a class="btnApadrinhar"  href="/pages/apadrinhar.html?id=${doc.id}apadrinhar()">Apadrinhar</a>
                    `

                } else {
                    document.body.innerHTML = "<p>Cachorro não encontrado. Por favor, tente novamente mais tarde.</p>";
                }
            } catch (error) {
                console.error("Erro ao buscar dados do cachorro:", error);
                document.body.innerHTML = "<p>Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.</p>";
            }
        });
    }
        async function cachorros() {
            const tableBody = document.getElementById('table');
            if (!tableBody) return;
        
            tableBody.innerHTML = ""; 
        
            try {
                const querySnapshot = await getDocs(collection(db, "cachorros"));
                querySnapshot.forEach((doc) => {
                    const dogData = doc.data();
        
                   
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${doc.id}</td>
                        <td>${dogData.nome}</td>
                        <td>${dogData.idade}</td>
                        <td>${dogData.porte}</td>
                        <td>${dogData.breed || 'Não especificado'}</td>
                        <td>${dogData.description || 'Sem descrição'}</td>
                        <td>
                            <img src="${dogData.imageUrl}" alt="Foto de ${dogData.nome}" 
                                width="50" height="50" style="border-radius: 50%; object-fit: cover;">
                        </td>
                        <td>${new Date().toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric'
                        })}</td>
                        <td>
                            <button class="editar" data-id="${doc.id}">Editar</button>
                            <button class="deletar" data-id="${doc.id}">Deletar</button>
                        </td>
                    `;
        
                    tableBody.appendChild(row);
        
                
                    const deleteButton = row.querySelector('.deletar');
                    deleteButton.addEventListener('click', async () => {
                        const id = deleteButton.getAttribute('data-id');
                        await deleteDog(id);
                        alert(`${dogData.nome} deletado com sucesso`);
                        await cachorros(); 
                    });
                });
            } catch (error) {
                console.error("Erro ao buscar cachorros: ", error);
            }
        }
        
      
        async function deleteDog(id) {
            try {
                const docRef = doc(db, "cachorros", id);
                await deleteDoc(docRef);
                console.log('Dog deletado com sucesso:', id);
            } catch (error) {
                console.error("Erro ao deletar cachorro: ", error);
            }
        }
        
  
        cachorros();
        
  
    const midiaEvent = document.getElementById('midiaEvent');
    const messageEvent = document.getElementById('message');

    if (midiaEvent) {
        midiaEvent.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dataEvent = document.getElementById('dateMidia').value;
            const eventDescription = document.getElementById('midiaDescription').value;
            const eventImageFile = document.getElementById('midiaImage').files[0];

            try {
              
                const storageRefEvent = ref(storage, `midia/${eventImageFile.name}`);
                const snapshot = await uploadBytes(storageRefEvent, eventImageFile);
                const eventImageUrl = await getDownloadURL(snapshot.ref);

               
                const docRef = await addDoc(collection(db, "midia"), {
                    data: dataEvent,
                    description: eventDescription,
                    imageUrl: eventImageUrl
                });

                messageEvent.textContent = `Evento cadastrado com sucesso! ID do documento: ${docRef.id}`;
                messageEvent.style.color = "green";
                midiaEvent.reset();

            } catch (error) {
                console.error("Erro ao cadastrar evento: ", error);
                messageEvent.textContent = "Erro ao cadastrar evento. Tente novamente.";
                messageEvent.style.color = "red";
            }
        });
    }



    async function fetchEvents() {
        const cardsEvents = document.querySelector('.cardsEvents');
        if (!cardsEvents) return;

        cardsEvents.innerHTML = ""; 

        try {
            const querySnapshot = await getDocs(collection(db, "midia"));
            querySnapshot.forEach((doc) => {
                const midiaData = doc.data();
                let data = new Date()
                let dia=  data.getDate()
                let mes=  data.getMonth() + 1
                let ano=  data.getFullYear()
               
                const cardEvent = document.createElement('div');
                cardEvent.classList.add('cardEvent');
                cardEvent.innerHTML = `
                    <p>${dia}/${mes}/${ano} </p>
                    <img src="${midiaData.imageUrl}" alt="">
                    <p class="descriçãoEvent">${midiaData.description}</p>
                `;
                cardsEvents.appendChild(cardEvent);

                pegarId()
                alert('evento cadastrado')
            });
        } catch (error) {
            console.error("Erro ao buscar eventos: ", error);
        }
        
    }

 fetchEvents();


      document.addEventListener('DOMContentLoaded', () =>{
        function midia() {
          
            const evento = document.querySelector('.eventos')
            evento.addEventListener('click', ()=> {
            const cadastrarAnimal = document.querySelector('#cadastrar-animal')
            let data = new Date()
            let dia=  data.getDate()
            let mes=  data.getMonth() + 1
            let ano=  data.getFullYear()
            cadastrarAnimal.style.display = 'none'
            const midia = document.querySelector('#midia')
              let div = document.createElement('div')
              div.innerHTML = `
               <h2>Cadastre os eventos da ong</h2>
                <form id="midiaEvent">
                   
                  
                    <input type="date" id="dateMidia" ><p>${dia}/${mes}/${ano} </p>
                    <textarea id="midiaDescription" placeholder="Descrição"></textarea>
                    <input type="file" id="midiaImage" accept="image/*">
                    <button type="submit" id="midiaEventForm">Publicar</button>
                    <div id="message"></div>
                </form>
            
              `
              midia.appendChild(div)
            })
        }
        
 
      midia()
      })


      //EVENTOS.HTML
document.addEventListener('DOMContentLoaded', ()=>{
    
  document.addEventListener('click', ()=> {
    async  function exibirFormMidia() {
        const midia = document.querySelector('#midia')
        const cadastrarAnimal = document.querySelector('.cadastrar-dog')
        const eventos = document.querySelector('.eventos')
        eventos.addEventListener('click',  ()=>{
            midia.style.display =  'flex'
            cadastrarAnimal.style.display =  'none'
            
        })
    }
    exibirFormMidia()
  })

})


function menuMobile(){
    const btnMenu = document.querySelector('.btnMenu')
    btnMenu.addEventListener('click', ()=>{
        const navBar = document.querySelector('.navBar')
        navBar.classList.toggle('active')
    })
}

menuMobile()

})

document.addEventListener('DOMContentLoaded', function () {
    const agendaFeiraForm = document.getElementById('agendaFeiraForm');
    const messageFeira = document.getElementById('message-feira'); 

    if (agendaFeiraForm && messageFeira) {
        agendaFeiraForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const selectFeira = document.getElementById('selectFeira').value;
            const dataFeira = document.getElementById('data-feira').value;
            const horarioFeira = document.getElementById('horario-feira').value;
            const localFeira = document.getElementById('local-feira').value;
            const descricaoFeira = document.getElementById('descricaoFeira').value;

            // Verificação de campos obrigatórios
            if (!dataFeira || !horarioFeira || !localFeira || !selectFeira || !descricaoFeira) {
                messageFeira.textContent = "Preencha todos os campos obrigatórios corretamente.";
                messageFeira.style.color = "red";
                return;
            }

            try {
                const doc = await addDoc(collection(db, "agenda"), {
                    data: dataFeira,
                    time: horarioFeira,
                    local: localFeira,
                    descricao: descricaoFeira,
                    select: selectFeira
                });

                messageFeira.className = "success";
                messageFeira.textContent = `Evento cadastrado com sucesso! ID do documento: ${doc.id}`;
                messageFeira.style.color = "green";
                agendaFeiraForm.reset(); 

            } catch (error) {
                console.error("Erro ao cadastrar evento: ", error);
                messageFeira.textContent = "Erro ao cadastrar evento. Tente novamente.";
                messageFeira.style.color = "red";
            }

            // Atualiza a tabela de eventos
            tableAgenda();
        });
    } else {
        console.error('Elemento não encontrado: agendaFeiraForm ou message-feira');
    }
});


async function fetchAgenda() {
    const agendaEventos = document.querySelector('.cadastrar-agenda'); 
    agendaEventos.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "agenda")); 
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const eventoCard = document.createElement('div');
            eventoCard.classList.add('evento');

            eventoCard.innerHTML = `
                <h3>${data.select || "Data não informada"}</h3>
                <p><strong>Data:</strong> ${data.data || "Data não informada"}</p>
                <p><strong>Horário:</strong> ${data.time || "Horário não informado"}</p>
                <p><strong>Local:</strong> ${data.local || "Local não informado"}</p>
                <p>${data.descricao || "Local não informado"}</p>
            `;

    
            agendaEventos.appendChild(eventoCard);
        });
    } catch (error) {
        console.error("Erro ao buscar eventos: ", error);
    }

}


document.addEventListener('DOMContentLoaded', fetchAgenda);

async function tableAgenda() {
    const tableBody = document.getElementById('tableAgenda');
    if (!tableBody) return;

    tableBody.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "agenda"));
        console.log(querySnapshot);  // Verifique o que está sendo retornado
        querySnapshot.forEach((doc) => {
            const agendaData = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${agendaData.select}</td>
                <td>${agendaData.data}</td>
                <td>${agendaData.time}</td>
                <td>${agendaData.local || 'Não especificado'}</td>
                <td>${agendaData.descricao || 'Sem descrição'}</td>
                <td>
                    <button class="deletar" data-id="${doc.id}">Deletar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.deletar').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                try {
                    await deleteDoc(doc(db, "agenda", id));
                    alert('Evento deletado com sucesso!');
                    tableAgenda();
                } catch (error) {
                    console.error("Erro ao deletar evento: ", error);
                    alert('Erro ao deletar evento. Tente novamente.');
                }
            });
        });

    } catch (error) {
        console.error("Erro ao buscar eventos na agenda: ", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    tableAgenda();
});


document.addEventListener('DOMContentLoaded', ()=>{
    const formAnteseDepois = document.getElementById('formAnteseDepois')
    formAnteseDepois.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const antesInput = document.querySelector('antes');
        const depoisInput = document.getElementById('depois');
        const historiaResgate = document.getElementById('historiadoResgate').value;
    
        if (!antesInput.files[0] || !depoisInput.files[0] || !historiaResgate) {
            alert("Preencha todos os campos!");
            return;
        }
    
        try {
         
            const antesFile = antesInput.files[0];
            const depoisFile = depoisInput.files[0];
            const timestamp = Date.now();
    
            const antesRef = ref(storage, `resgates/antes/${timestamp}_${antesFile.name}`);
            const depoisRef = ref(storage, `resgates/depois/${timestamp}_${depoisFile.name}`);
    
            await uploadBytes(antesRef, antesFile);
            await uploadBytes(depoisRef, depoisFile);
    
            const antesUrl = await getDownloadURL(antesRef);
            const depoisUrl = await getDownloadURL(depoisRef);
    
    
            await addDoc(collection(db, "resgates"), {
                historia: historiaResgate,
                imagemAntes: antesUrl,
                imagemDepois: depoisUrl,
                data: new Date().toISOString()
            });
    
            alert("Resgate adicionado com sucesso!");
            formAnteseDepois.reset();
            fetchAndRenderResgates(); 
        } catch (error) {
            console.error("Erro ao salvar dados: ", error);
            alert("Ocorreu um erro ao adicionar o resgate. Tente novamente.");
        }
    });
    

    fetchAndRenderResgates();
    
})

document.addEventListener('DOMContentLoaded', () => {
    const formAnteseDepois = document.getElementById('formAnteseDepois');
    const tableResgate = document.getElementById('tableResgate');

    formAnteseDepois.addEventListener('submit', async (e) => {
        e.preventDefault();

        const antesInput = document.getElementById('antes');
        const depoisInput = document.getElementById('depois');
        const historiaResgate = document.getElementById('historiadoResgate').value;

        if (!antesInput.files[0] || !depoisInput.files[0] || !historiaResgate) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
         
            const antesFile = antesInput.files[0];
            const depoisFile = depoisInput.files[0];
            const timestamp = Date.now();

            const antesRef = ref(storage, `resgates/antes/${timestamp}_${antesFile.name}`);
            const depoisRef = ref(storage, `resgates/depois/${timestamp}_${depoisFile.name}`);

            await uploadBytes(antesRef, antesFile);
            await uploadBytes(depoisRef, depoisFile);

            const antesUrl = await getDownloadURL(antesRef);
            const depoisUrl = await getDownloadURL(depoisRef);

    
            await addDoc(collection(db, "resgates"), {
                historia: historiaResgate,
                imagemAntes: antesUrl,
                imagemDepois: depoisUrl,
                data: new Date().toISOString(),
            });

            alert("Resgate adicionado com sucesso!");
            formAnteseDepois.reset();
            renderResgates();
        } catch (error) {
            console.error("Erro ao salvar dados: ", error);
            alert("Ocorreu um erro. Tente novamente.");
        }
    });

  
    async function renderResgates() {
        try {
            const querySnapshot = await getDocs(collection(db, "resgates"));
            tableResgate.innerHTML = ''; 

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = `
                    <tr>
                        <td>${doc.id}</td>
                        <td><img src="${data.imagemAntes}" alt="Antes" width="80" height="60" style="object-fit: cover; border-radius: 8px;"></td>
                        <td>${data.historia || 'Sem história disponível'}</td>
                        <td><img src="${data.imagemDepois}" alt="Depois" width="80" height="60" style="object-fit: cover; border-radius: 8px;"></td>
                        <td><button onclick="deleteResgate('${doc.id}')">Deletar</button></td>
                    </tr>
                `;
                tableResgate.insertAdjacentHTML('beforeend', row);
            });
        } catch (error) {
            console.error("Erro ao buscar dados: ", error);
        }
    }

  
    async function deleteResgate(id) {
        try {
            await deleteDoc(doc(db, "resgates", id));
            alert("Resgate deletado com sucesso!");
            renderResgates(); 
        } catch (error) {
            console.error("Erro ao deletar resgate: ", error);
        }
    }

  
    async function renderBeforeAfterCards() {
        try {
            const querySnapshot = await getDocs(collection(db, "resgates"));
            const beforeAfter = document.querySelector('.before-after');
            beforeAfter.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const card = `
                    <div class="card">
                        <div class="images">
                            <img src="${data.imagemAntes}" alt="Antes" class="before">
                            <img src="${data.imagemDepois}" alt="Depois" class="after">
                        </div>
                        <p class="description">"${data.historia}"</p>
                    </div>
                `;
                beforeAfter.insertAdjacentHTML('beforeend', card);
            });
        } catch (error) {
            console.error("Erro ao carregar cards: ", error);
        }
    }

  
    renderResgates();
    renderBeforeAfterCards();
});


async function exibirAnteseDepoisIncio(){
    try {
        const querySnapshot = await getDocs(collection(db, "resgates"));
        const beforeAfter = document.querySelector('.before-after')
      

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            const eventoCard = document.createElement('div');
            eventoCard.classList.add('card');

            eventoCard.innerHTML = `
                <div class="images">
                <img src="${data.imagemAntes}" alt="Imagem antes do resgate" class="before">
                <img src="${data.imagemDepois}" alt="Imagem depois do resgate" class="after">
              </div>
              <p class="description">"${data.historia}"</p>
      
            `;

       
            beforeAfter.appendChild(eventoCard);
        });
    } catch (error) {
        console.error("Erro ao buscar os dados dos resgates: ", error);
    }
}
exibirAnteseDepoisIncio()
