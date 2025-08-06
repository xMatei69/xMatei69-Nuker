require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const prefix = '[xMatei69 Nuker]';

const commandPrefix = '#';

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.MessageContent,

    GatewayIntentBits.GuildMembers,

  ],

});

client.commands = new Collection();

// Example commands loaded into the collection (you can expand this)

const commands = [

  'help',

  'reset',

  'banall',

  'spamchannels',

  'massrole',

  'massban',

  'masskick',

  'say',

  'mock',

  'rickroll',

  'togglemute',

];

commands.forEach((cmd) => client.commands.set(cmd, true)); // dummy value, you can add actual command handlers

client.once('ready', () => {

  console.clear();

  console.log(`${prefix} Bot started and logged in.`);

  console.log(`${prefix} Language: English`);

  console.log(`${prefix} Using libraries: discord.js v14, dotenv`);

  console.log(`${prefix} Total commands loaded: ${client.commands.size}`);

  console.log(`${prefix} Slash commands support: ENABLED`);

  console.log(`${prefix} Command prefix: ${commandPrefix}`);

  console.log(`${prefix} Available commands:`);

  commands.forEach((cmd) => {

    console.log(`  - ${commandPrefix}${cmd}`);

  });

  console.log(`${prefix} Ready to serve!`);

});

client.login(process.env.TOKEN);

