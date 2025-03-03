const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Configuração para servir arquivos estáticos
app.use(express.static('public'));

app.use(bodyParser.json());

let pedidos = [];

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gestaopedidosambientenobre@gmail.com', // Substitua pelo seu e-mail
        pass: 'acc121322' // Substitua pela sua senha
    }
});

// Rota para adicionar pedidos
app.post('/adicionarPedido', (req, res) => {
    const { nomePedido, dataExpiracao } = req.body;
    const novoPedido = { nomePedido, dataExpiracao };
    pedidos.push(novoPedido);

    // Verificar se a data de expiração está próxima
    const dataExpiracaoObj = new Date(dataExpiracao);
    const hoje = new Date();
    const diferencaDias = Math.ceil((dataExpiracaoObj - hoje) / (1000 * 60 * 60 * 24));

    if (diferencaDias <= 2) {
        const mailOptions = {
            from: 'gestaopedidosambientenobre@gmail.com',
            to: 'alexcrystian223@gmail.com',
            subject: 'Alerta de Pedido Próximo da Expiração',
            text: `O pedido "${nomePedido}" expira em ${dataExpiracao}. Faltam ${diferencaDias} dias.`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('E-mail enviado: ' + info.response);
            }
        });
    }

    res.json({ success: true });
});

// Rota para listar pedidos
app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});