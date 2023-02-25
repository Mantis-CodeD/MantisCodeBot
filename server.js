//Aqui importamos o arquivo responsável por iniciar o bot do discord e outros modulos
require('./src/bot/index');
require('dotenv/config');
// const http = require('http').createServer()



//Estamos iniciando nossa aplicação que rodara na porta configura no arquivo .env
// Pra este projeto a utilização do modulo http não e necessário somente o arquivo do discord sera suficiente, 
// porém para projetos futuros utilizaremos o modulo portanto ele esta aqui somente para acelerar a produção.
//Fique a vontade para retirar toda a logica do modulo http contida neste arquivo
// http.listen(process.env.SERVER_PORT, () => {
//   console.log("Servidor MantisBot");
// })

console.log("Iniciado")