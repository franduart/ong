document.querySelectorAll("button[data-price]").forEach(button => {
    button.addEventListener("click", async () => {
        const amount = Number(button.getAttribute("data-price")); // 🔹 Converte para número antes de enviar

        if (isNaN(amount) || amount <= 0) {
            console.error("Valor inválido para pagamento");
            return;
        }

        try {
            const response = await fetch("https://ong-5wez.onrender.com/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
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
    });
});
