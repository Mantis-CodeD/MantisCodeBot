require('dotenv/config');
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const dailyScrap = require('./scrap.js');
const cron = require('node-cron');

const commands = [
  {
    name: 'service_mantisextract',
    description: 'Inicia a extração de vagas',
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

client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === commands[0].name) {
    try {
      const pushCommand = await dailyScrap();
      for await (const iterator of pushCommand) {
        await interaction.channel.send({ embeds: [iterator] });
      }
      await interaction.channel.send({
        embeds: [{
          footer: {
            text: `*Encerrado o envio de vagas, um total de ${pushCommand.length} vagas encontradas*`
          }
        }]
      });
    } catch (error) {
      console.log('Failed to pull jobs -> puppeteer')
    }
  }
});

cron.schedule('* * 23 * * *', async () => {
  console.log('Starting scheduler');
  try {
    const dailyResults = await dailyScrap();
    const channel = await client.channels.fetch(process.env.DISCORD_GUILD);
    await channel.send({ embeds: [{ footer: { text: `*Iniciado agendador*` } }] });
    for await (const iterator of dailyResults) {
      await channel.send({ embeds: [iterator] });
    }
    await channel.send({
      embeds: [{
        footer: {
          text: `*Encerrado o envio de vagas, um total de ${dailyResults.length} vagas encontradas*`
        }
      }]
    });
  } catch (error) {
    console.log('Failed to pull jobs -> puppeteer')
  }
});

client.login(process.env.DISCORD_TOKEN);
