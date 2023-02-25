//Modulos e importações de config
require('dotenv/config');
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
const cron = require('node-cron');

//Nesta logica verificamos qual comando foi acionado e oque ele fara em seguida


// let imageUrl = []

const requestProm = (page) => {
  return new Promise((resolve, reject) => {
    request(`https://programathor.com.br/jobs-city/remoto?contract_type=CLT&page=${page}`, async (err, response, body) => {
      console.log(`Puxando pagina ${page}`)
      const $ = cheerio.load(body)
      let vagas = []

      //Aqui selecionamos os elementos html através do cheerio e o JQuery e capturamos cada um e enviamos a um array que sera formatado
      $('.cell-list').each(async (index, element) => {
        const name = $(element).find('h3').text().replace('NOVA', '')
        if (!name || name.includes('Vencida')) {
          return null
        }
        vagas.push({ title: `Vaga: ${name}`, url: String("https://programathor.com.br" + element.firstChild.next.attribs.href) })
      })

      console.log(`Aguardando envio para discord`)
      resolve(vagas)
    })

  })
}

//Objeto contendo o comando e a descrição
//Name e o comando que sera usado a após a / exemplo /start_scrap
const commands = [
  {
    name: 'start_scrap',
    description: 'Start Scrap Jobs',
  },
];



//A logica abaixo ira definir quais comandos foram configurados
//Configure a chave token no .env conforme criada em https://discord.com/developers/applications
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);



//Esta função ira definir e setar os paramentros dos comandos criados
(async () => {
  try {
    console.log('Iniciado alteração de comandos (/)');



    //Aqui devera ser configurado conforme .env e seguindo também a chave criada em https://discord.com/developers/applications
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT), { body: commands });



    console.log('Alteração de comandos feitas com sucesso em (/)');
  } catch (error) {
    console.error(error);
  }
})();



//Aqui esta sendo definido client como um objeto da classe Client do modulo discord.js
const client = new Client({ intents: [GatewayIntentBits.Guilds] });



//A função abaixo utiliza o evento ready que verifica se o login com o bot foi bem sucedido
client.on('ready', () => {
  console.log(`Logado como ${client.user.tag}!`);
});



//A função abaixo utiliza o evento intectionCreate para interagir com mensagens recebidas ao bot em algum canal
//Através desta função também e possível criar e responder mensagens diretas no canal definido
client.on('interactionCreate', async interaction => {
  let initialized = false


  if(initialized === false){
    initialized = true
    const vagas = await Promise.all([requestProm('1'), requestProm('2'), requestProm('3'), requestProm('4'), requestProm('5')]).then((result) => {
      return result.flat()
    })
  
    const vagasEmb = vagas.map((vagas) => {
      return {
        ...vagas,
        color: 5763719,
        author: {
          name: 'ProgramaThor',
          icon_url: 'https://programathor.com.br/assets/thor-91ae45b43c0df483b3ada7728d09a3458d40119e8cdb47abadd9f15a0f62172c.png',
          url: 'https://programathor.com.br',
        },
        footer: {
          text: 'Todas as vagas são retiradas do site ProgramaThor, todas as vagas presentes aqui são para trabalho remoto e devem ser consultadas diretamente no site responsável'
        },
  
      }
    })
  
  
  
    //Esta função ira capturar em qual canal o bot foi iniciado e enviara cada um dos items pro mesmo canal no formato que desejar
  
    for (let index = 0; index < vagasEmb.length; index++) {
      //Fique atento para a formatação do texto, textos grandes podem não respeitar as linhas no discord
      await interaction.channel.send({ embeds: [vagasEmb[index]] })
    }
  }


  //Aqui verificamos se a mensagem recebida e um comando ou apenas uma mensagem de texto
  if (!interaction.isChatInputCommand()) return;

  cron.schedule('* * 23 * * *', async () => {
    const vagas = await Promise.all([requestProm('1'), requestProm('2'), requestProm('3'), requestProm('4'), requestProm('5')]).then((result) => {
      return result.flat()
    })

    const vagasEmb = vagas.map((vagas) => {
      return {
        ...vagas,
        color: 5763719,
        author: {
          name: 'ProgramaThor',
          icon_url: 'https://programathor.com.br/assets/thor-91ae45b43c0df483b3ada7728d09a3458d40119e8cdb47abadd9f15a0f62172c.png',
          url: 'https://programathor.com.br',
        },
        footer: {
          text: 'Todas as vagas são retiradas do site ProgramaThor, todas as vagas presentes aqui são para trabalho remoto e devem ser consultadas diretamente no site responsável'
        },

      }
    })


    //Esta função ira capturar em qual canal o bot foi iniciado e enviara cada um dos items pro mesmo canal no formato que desejar

    for (let index = 0; index < vagasEmb.length; index++) {
      //Fique atento para a formatação do texto, textos grandes podem não respeitar as linhas no discord
      await interaction.channel.send({ embeds: [vagasEmb[index]] })


    }
  })
}
);



//Aqui definimos que tudo esta OK e o bot podera logar e iniciar as operações
//A chave aqui deve ser configurada no arquivo .env conforme criada no https://discord.com/developers/applications
client.login(process.env.DISCORD_TOKEN);