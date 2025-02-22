import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'pages')));  // Serve arquivos estáticos da pasta 'pages'

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-2290553985331782-020117-9b908f9de88f82db668885ad951ef329-2243057391',
});

const preference = new Preference(client);

app.post('/create_preference', async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Valor não informado' });
    }

    const body = {
        items: [
            {
                id: '1',
                title: 'Doação Alma Viralata',
                description: 'Doação para ajudar animais resgatados',
                picture_url: 'https://www.myapp.com/myimage.jpg',
                category_id: 'donations',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(amount),
            },
        ],
        back_urls: {
            success: "https://4601-2804-14d-7e40-8354-8c84-3b88-241e-89c7.ngrok-free.app/success.html",
            failure: "https://6f79-2804-14d-7e40-8354-8c84-3b88-241e-89c7.ngrok-free.app/pages/failure.html",
            pending: "https://6f79-2804-14d-7e40-8354-8c84-3b88-241e-89c7.ngrok-free.app/pages/pending.html"
        
        },
        auto_return: "all",
        "payment": {
        "installments": 1,
        "type": "credit_card",
        "installments_cost": "seller"
  },
    };

    try {
		const response = await preference.create({ body });
		res.json({ url: response.init_point });
	} catch (error) {
		console.error("Erro ao criar a preferência:", error);
		res.status(500).json({ error: error.message });
	}
});

app.listen(5500, () => console.log('Servidor rodando na porta 5500'));
