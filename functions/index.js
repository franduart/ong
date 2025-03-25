const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const helmet = require("helmet");
const { MercadoPagoConfig } = require("mercadopago");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-SEU-TOKEN-AQUI"
});

app.post("/create_preference", async (req, res) => {
    let { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Valor inválido" });
    }

    try {
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer APP_USR-SEU-TOKEN-AQUI`
            },
            body: JSON.stringify({
                items: [
                    {
                        title: "Doação Alma Viralata",
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: Number(amount),
                    },
                ],
                back_urls: {
                    success: "https://ong-alma-viralata-2951a.web.app/pages/success.html",
                    failure: "https://ong-alma-viralata-2951a.web.app/pages/failure.html",
                    pending: "https://ong-alma-viralata-2951a.web.app/pages/pending.html",
                },
                auto_return: "all",
            })
        });

        const data = await response.json();
        if (data.init_point) {
            return res.json({ url: data.init_point });
        } else {
            return res.status(500).json({ error: "Erro ao gerar link de pagamento" });
        }
    } catch (error) {
        console.error("Erro ao criar preferência:", error);
        return res.status(500).json({ error: error.message });
    }
});

// 🔥 Exportando a função para o Firebase
exports.api = functions.https.onRequest(app);
