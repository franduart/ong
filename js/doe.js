document.querySelectorAll("button[data-price]").forEach(button => {
  button.addEventListener("click", async () => {
      const amount = button.getAttribute("data-price");

      try {
          const response = await fetch("http://localhost:5500/create_preference", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ amount })
          });

          const data = await response.json();

          if (data.url) {
              window.location.href = data.url; // Redireciona para o pagamento
          } else {
              console.error("Erro ao obter URL de pagamento");
          }
      } catch (error) {
          console.error("Erro ao processar pagamento:", error);
      }
  });
});
