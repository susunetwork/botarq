const venom = require('venom-bot');
const express = require('express');
const cors = require('cors');
const port = 3000

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

venom.create({
    session: 'bt' //Nome da sessão
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
});

let cliente;

const start = async (client) => {
  cliente = client;
}

//Validar se a mensagem e o número são válidos (se foram enviados no corpo da requisição, e se são válidos)
const ValidarMsg = (req, res, next) => {
  
  const { body } = req;

  if(body.mensagem == undefined || body.mensagem == "")
  {
    return res.status(400).json({code:400, message: "Mensagem não informada/válida."});
  }

  if(body.numero == undefined || body.numero == "")
  {
    return res.status(400).json({code:400, message: "Número não informado"});
  }
  
  if(body.numero.length != 11)
  {
    return res.status(400).json({code:400, message: "Número não é válido, deve ser nesse formato: 84912345678"});
  }


  next();

};

const EnviarMsg = async (msg) => {

  const { mensagem, numero } = msg;

  let resultado;
  if(cliente != undefined)
  {
    await cliente
    .sendText('55'+numero+'@c.us', mensagem)
    .then((_result) => {
      resultado = {code:200,mensage:"Mensagem enviada com sucesso" };
    })
    .catch((_erro) => {
      resultado = {code:400, mensage:"Algum erro aconteceu, tente novamente."};
    });
  }
  else
  {
    resultado = {code:400, mensage:"Cliente do Whatsapp não conectado!"};
  }
  
  return resultado;

};

const reqEnviarMsg = async (req, res) => {
  let criado = await EnviarMsg(req.body);
  return res.status(criado.code).json(criado);
};

app.post('/msg', ValidarMsg, reqEnviarMsg);

app.listen(port, () => {
  console.log("Servidor iniciado na porta: "+port)
});