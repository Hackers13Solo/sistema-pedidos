const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Para permitir requisições do frontend
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gestaopedidosambientenobre@gmail.com', // Substitua pelo seu e-mail
        pass: 'acc121322' // Substitua pela sua senha
    }
});

// Rota para enviar e-mail
app.post('/enviar-email', (req, res) => {
    const { nomePedido, dataExpiracao } = req.body;

    const mailOptions = {
        from: 'gestaopedidosambientenobre@gmail.com', // E-mail remetente
        to: 'alexcrystian223@gmail.com', // E-mail destinatário
        subject: `Detalhes do Pedido: ${nomePedido}`,
        text: `O pedido "${nomePedido}" expira em ${dataExpiracao}. Faltam ${calcularDiasRestantes(dataExpiracao)} dias.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar e-mail');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('E-mail enviado com sucesso');
        }
    });
});

function calcularDiasRestantes(dataExpiracao) {
    const hoje = new Date();
    const expiracao = new Date(dataExpiracao);
    const diferenca = expiracao - hoje;
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});