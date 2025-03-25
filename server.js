import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig } from 'mercadopago';
import helmet from 'helmet'; 
import fetch from 'node-fetch';

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "script-src": [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "blob:",
                    "*.mercadopago.com",
                    "*.gstatic.com",
                    "*.google.com",
                    "https://http2.mlstatic.com"
                ],
                "frame-src": ["'self'", "*.mercadopago.com"],
            },
        },
    })
);

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
});

app.post('/create_preference', async (req, res) => {
    let { amount } = req.body;
    
    console.log("Valor recebido:", amount, "Tipo:", typeof amount); // 👀 Debug

    if (!amount) {
        return res.status(400).json({ error: 'Valor não informado' });
    }

    amount = Number(amount); // 🔹 Converte para número

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Valor inválido' });
    }

    try {
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer APP_USR-8666948195976425-022020-cc28dd9627cd9d344bd531477d09679b-2234279670`
            },
            body: JSON.stringify({
                items: [
                    {
                        id: '1234',
                        title: 'Doação Alma Viralata',
                        description: 'Doação para instituição Alma Viralata',
                        picture_url: 'https://www.myapp.com/myimage.jpg',
                        quantity: 1,
                        currency_id: 'BRL',
                        unit_price: amount, 
                    },
                ],
                payment_methods: {
                    excluded_payment_types: [], // 🔹 Permite todos os métodos de pagamento
                    installments: 1 
                },
                back_urls: {
                    success: 'https://ong-alma-viralata-2951a.web.app/pages/success.html',
                    failure: 'https://ong-alma-viralata-2951a.web.app/pages/failure.html',
                    pending: 'https://ong-alma-viralata-2951a.web.app/pages/pending.html',
                },
                auto_return: 'all',
            })
        });

        const data = await response.json();
        console.log("Resposta Mercado Pago:", data);

        if (data.init_point) {
            return res.json({ url: data.init_point });
        } else {
            return res.status(500).json({ error: "URL de pagamento não encontrada" });
        }

    } catch (error) {
        console.error("Erro ao criar a preferência:", error);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(5500, () => console.log('🔥 Servidor rodando na porta 5500'));
