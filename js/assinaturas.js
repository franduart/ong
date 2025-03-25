document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById('checkout-btn');

  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
          window.location.href = 'assinaturas.html';
      });
  } else {
      console.warn('O botão de checkout não foi encontrado no DOM.');
  }

  // Criando a instância do Mercado Pago apenas uma vez
  if (window.MercadoPago) {
      var mp = new MercadoPago("APP_USR-b911b131-72e2-4c0f-8419-7edcdd988a99", { locale: "pt-BR" });
  } else {
      console.error("Erro: MercadoPago não foi carregado.");
  }

});

document.querySelectorAll(".btnAssinar").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const valor = btn.value;
        const email = prompt("Digite seu e-mail para a assinatura:");

        if (!email) {
            alert("E-mail obrigatório!");
            return;
        }

        try {
            // Envia para o backend, que irá fazer a requisição ao Mercado Pago
            const response = await fetch("http://localhost:5500/preapproval_plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, valor })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redireciona para o link de pagamento
            } else {
                alert("Erro ao criar assinatura!");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Falha na assinatura.");
        }
    });
});


(function() {
    function $MPC_load() {
       window.$MPC_loaded !== true && (function() {
       var s = document.createElement("script");
       s.type = "text/javascript";
       s.async = true;
       s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
       var x = document.getElementsByTagName('script')[0];
       x.parentNode.insertBefore(s, x);
       window.$MPC_loaded = true;
    })();
 }
 window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
 })();

  
      function $MPC_message(event) {
     
      {event.data} preapproval_id 
      }
      window.$MPC_loaded !== true ? (window.addEventListener("message", $MPC_message)) : null; 
      