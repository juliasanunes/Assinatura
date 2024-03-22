const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o upload de arquivos
app.post('/upload', upload.single('document'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Por favor, selecione um arquivo.');
  }

  // Aqui você pode adicionar código para integrar com um serviço de assinatura eletrônica

  // Exemplo de envio de e-mail com o arquivo anexado
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'seuemail@gmail.com',
      pass: 'suasenha'
    }
  });

  const mailOptions = {
    from: 'seuemail@gmail.com',
    to: 'destinatario@email.com',
    subject: 'Documento para assinatura',
    text: 'Por favor, assine o documento anexo.',
    attachments: [
      {
        filename: file.originalname,
        path: file.path
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
      res.status(500).send('Erro ao enviar e-mail.');
    } else {
      console.log('E-mail enviado:', info.response);
      res.send('Documento enviado por e-mail com sucesso.');
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
