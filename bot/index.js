require('dotenv/config');
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const dailyScrap = require('./scrap.js');
const cron = require('node-cron');

const commands = [
  {
    name: 'service_mantisextract',
    description: 'Inicia a extração de vagas',
  },
  {
    name: 'jobs',
    description: 'Filtre vagas por senioridade'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Start change commands (/)');

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT), { body: commands });

    console.log('Success change commands (/)');
  } catch (error) {
    console.error(error);
  }
})();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.on('ready', () => {
  console.log(`Logado como ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
  if (interaction.commandName === commands[0].name) {
    cron.schedule('* * 23 * * *', async () => {
      interaction.channel.send("Buscando vagas")
      const dailyResults = await dailyScrap()
      for (let index = 0; index < dailyResults.length; index++) {
        await interaction.channel.send({ embeds: [dailyResults[index]] })
      }
    })
  }
}
);



client.login(process.env.DISCORD_TOKEN);