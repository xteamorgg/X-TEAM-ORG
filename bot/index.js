import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const CONFIG_FILE = './bot/config.json';
const DATA_FILE = './bot/data.json';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function loadConfig() {
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  }
  return {
    roleIds: {
      leaders: null,
      investigators: null,
      agents: null,
      newbies: null
    },
    discordInvite: null
  };
}

function saveConfig(config) {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function loadData() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  }
  return {
    suspiciousServers: [],
    investigatedServers: [],
    terminatedServers: [],
    members: {
      leaders: [],
      investigators: [],
      agents: [],
      newbies: []
    },
    visitors: {
      total: 0
    },
    doxRecords: []
  };
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let botConfig = loadConfig();
let botData = loadData();

async function syncMembers(guild) {
  const members = {
    leaders: [],
    investigators: [],
    agents: [],
    newbies: []
  };

  if (!guild) {
    console.log('❌ Guild não encontrada');
    return members;
  }

  try {
    console.log('🔄 Iniciando sincronização de membros...');
    console.log('📋 Config de cargos:', botConfig.roleIds);
    
    // Buscar membros do servidor
    await guild.members.fetch();
    console.log(`👥 Total de membros no servidor: ${guild.memberCount}`);

    for (const [key, roleId] of Object.entries(botConfig.roleIds)) {
      if (!roleId) {
        console.log(`⚠️ Cargo ${key} não configurado`);
        continue;
      }

      const role = guild.roles.cache.get(roleId);
      if (!role) {
        console.log(`❌ Cargo ${key} (ID: ${roleId}) não encontrado no servidor`);
        continue;
      }

      console.log(`✅ Cargo ${key} encontrado: ${role.name} (${role.members.size} membros)`);

      members[key] = role.members.map(member => ({
        nick: member.user.username,
        avatar: member.user.displayAvatarURL({ size: 128 }),
        role: role.name
      }));
    }

    // Salvar membros no arquivo de dados
    botData.members = members;
    saveData(botData);

    console.log('✅ Membros sincronizados e salvos');
  } catch (error) {
    console.error('Erro ao sincronizar membros:', error);
  }

  return members;
}

app.get('/api/auth/discord', (req, res) => {
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.members.read`;
  res.redirect(authUrl);
});

app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}?error=no_code`);
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.redirect(`${FRONTEND_URL}?error=no_token`);
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    const userEncoded = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${FRONTEND_URL}?token=${tokenData.access_token}&user=${userEncoded}`);
  } catch (error) {
    console.error('Erro no OAuth:', error);
    res.redirect(`${FRONTEND_URL}?error=auth_failed`);
  }
});

app.get('/api/data', async (req, res) => {
  // Retornar dados salvos (sem buscar do Discord para evitar rate limit)
  const responseData = {
    ...botData,
    discordInvite: botConfig.discordInvite,
    visitors: {
      total: botData.visitors?.total || 0
    }
  };
  res.json(responseData);
});

app.post('/api/visit', (req, res) => {
  if (!botData.visitors) {
    botData.visitors = {
      total: 0
    };
  }
  
  // Incrementar total de visitas (sempre, mesmo IP)
  botData.visitors.total = (botData.visitors.total || 0) + 1;
  
  // Salvar dados
  saveData(botData);
  
  res.json({ 
    success: true,
    total: botData.visitors.total
  });
});

app.post('/api/servers/:type', (req, res) => {
  const { type } = req.params;
  const server = req.body;

  if (type === 'suspicious') {
    botData.suspiciousServers.push(server);
  } else if (type === 'investigated') {
    botData.investigatedServers.push(server);
  } else if (type === 'terminated') {
    botData.terminatedServers.push(server);
  }

  saveData(botData);
  res.json({ success: true });
});

// Endpoint para receber denúncias
app.post('/api/report', async (req, res) => {
  const { inviteCode, message, reporter } = req.body;
  
  if (!inviteCode || !message || !reporter) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  try {
    // Buscar informações do servidor pelo convite
    const inviteResponse = await fetch(`https://discord.com/api/v10/invites/${inviteCode}`);
    
    if (!inviteResponse.ok) {
      return res.status(404).json({ error: 'Convite inválido ou expirado' });
    }
    
    const inviteData = await inviteResponse.json();
    const guild = inviteData.guild;
    
    // Enviar mensagem para o canal de denúncias
    const REPORT_CHANNEL_ID = process.env.REPORT_CHANNEL_ID || '1474003329934819369';
    
    try {
      const channel = await client.channels.fetch(REPORT_CHANNEL_ID);
      
      if (channel) {
        const reportEmbed = new EmbedBuilder()
          .setColor('#ef4444')
          .setTitle('🚨 Nova Denúncia de Servidor')
          .setDescription(`**Servidor Denunciado:**\n${guild.name} (ID: ${guild.id})`)
          .addFields(
            { name: '📝 Motivo', value: message, inline: false },
            { name: '👤 Denunciante', value: `${reporter.username}${reporter.discriminator !== '0' ? '#' + reporter.discriminator : ''} (ID: ${reporter.id})`, inline: false },
            { name: '🔗 Convite', value: `discord.gg/${inviteCode}`, inline: false }
          )
          .setThumbnail(guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null)
          .setTimestamp()
          .setFooter({ text: 'X TEAM - Sistema de Denúncias' });
        
        await channel.send({ embeds: [reportEmbed] });
        
        res.json({ 
          success: true, 
          message: 'Denúncia enviada com sucesso',
          serverName: guild.name
        });
      } else {
        res.status(500).json({ error: 'Canal de denúncias não configurado' });
      }
    } catch (channelError) {
      console.error('Erro ao enviar para o canal:', channelError);
      res.status(500).json({ error: 'Erro ao enviar denúncia para o canal' });
    }
  } catch (error) {
    console.error('Erro ao processar denúncia:', error);
    res.status(500).json({ error: 'Erro ao processar denúncia' });
  }
});



const commands = [
  new SlashCommandBuilder()
    .setName('xteam-config-role')
    .setDescription('Configura um cargo da hierarquia')
    .addStringOption(option =>
      option.setName('cargo')
        .setDescription('Tipo de cargo')
        .setRequired(true)
        .addChoices(
          { name: 'X LEADERS – FOUNDERS', value: 'leaders' },
          { name: 'X INVESTIGADORES', value: 'investigators' },
          { name: 'X AGENTS', value: 'agents' },
          { name: 'X NEWBIES', value: 'newbies' }
        ))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Cargo do Discord')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('xteam-config-invite')
    .setDescription('Define o link de convite do Discord')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Link de convite')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('adicionarservidorsuspeito')
    .setDescription('Adiciona um servidor suspeito ao painel')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do servidor Discord')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do servidor')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Status/descrição da investigação')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('foto')
        .setDescription('URL da foto do servidor (opcional)')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('adicionarservidorinvestigado')
    .setDescription('Adiciona um servidor investigado ao painel')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do servidor Discord')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do servidor')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Relatório da investigação')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('foto')
        .setDescription('URL da foto do servidor (opcional)')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('adicionarservidordesativado')
    .setDescription('Adiciona um servidor desativado ao painel')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do servidor Discord')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do servidor')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Motivo da desativação')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('foto')
        .setDescription('URL da foto do servidor (opcional)')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('xteam-sync')
    .setDescription('Sincroniza membros manualmente'),

  new SlashCommandBuilder()
    .setName('setpainelcargo')
    .setDescription('Configura o painel de verificação de cargo X NEWBIES')
];

client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const GUILD_ID = process.env.MAIN_GUILD_ID || '1473718425749688442';

  try {
    // Registrar comandos no servidor específico
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, GUILD_ID),
      { body: commands.map(cmd => cmd.toJSON()) }
    );
    console.log('✅ Comandos registrados no servidor');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }

  console.log('✅ Bot pronto - use /xteam-sync para sincronizar membros');

  app.listen(3000, () => {
    console.log('✅ API rodando na porta 3000');
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'xteam-config-role') {
    try {
      const cargo = interaction.options.getString('cargo');
      const role = interaction.options.getRole('role');

      botConfig.roleIds[cargo] = role.id;
      saveConfig(botConfig);

      await interaction.reply({
        content: `✅ Cargo **${role.name}** configurado como **${cargo}**`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar cargo:', error);
      await interaction.reply({
        content: `❌ Erro ao configurar cargo: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'xteam-config-invite') {
    try {
      const link = interaction.options.getString('link');
      botConfig.discordInvite = link;
      saveConfig(botConfig);

      await interaction.reply({
        content: `✅ Link de convite configurado`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao configurar convite:', error);
      await interaction.reply({
        content: `❌ Erro ao configurar convite: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'adicionarservidorsuspeito') {
    try {
      const serverId = interaction.options.getString('id');
      const serverName = interaction.options.getString('nome');
      const status = interaction.options.getString('status');
      const customPhoto = interaction.options.getString('foto');

      const server = {
        name: serverName,
        id: serverId,
        status: status,
        icon: customPhoto || '🔍'
      };

      botData.suspiciousServers.push(server);
      saveData(botData);

      await interaction.reply({
        content: `✅ Servidor **${serverName}** (ID: ${serverId}) adicionado aos suspeitos`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao adicionar servidor suspeito:', error);
      await interaction.reply({
        content: `❌ Erro ao adicionar servidor: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'adicionarservidorinvestigado') {
    try {
      const serverId = interaction.options.getString('id');
      const serverName = interaction.options.getString('nome');
      const status = interaction.options.getString('status');
      const customPhoto = interaction.options.getString('foto');

      const server = {
        name: serverName,
        id: serverId,
        status: status,
        icon: customPhoto || '✅'
      };

      botData.investigatedServers.push(server);
      saveData(botData);

      await interaction.reply({
        content: `✅ Servidor **${serverName}** (ID: ${serverId}) adicionado aos investigados`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao adicionar servidor investigado:', error);
      await interaction.reply({
        content: `❌ Erro ao adicionar servidor: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'adicionarservidordesativado') {
    try {
      const serverId = interaction.options.getString('id');
      const serverName = interaction.options.getString('nome');
      const status = interaction.options.getString('status');
      const customPhoto = interaction.options.getString('foto');

      const server = {
        name: serverName,
        id: serverId,
        status: status,
        icon: customPhoto || '❌'
      };

      botData.terminatedServers.push(server);
      saveData(botData);

      await interaction.reply({
        content: `✅ Servidor **${serverName}** (ID: ${serverId}) adicionado aos desativados`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Erro ao adicionar servidor desativado:', error);
      await interaction.reply({
        content: `❌ Erro ao adicionar servidor: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'xteam-sync') {
    try {
      await interaction.deferReply({ ephemeral: true });
      
      const guild = interaction.guild;
      const members = await syncMembers(guild);

      const totalMembers = 
        members.leaders.length +
        members.investigators.length +
        members.agents.length +
        members.newbies.length;

      await interaction.editReply({
        content: `✅ Membros sincronizados com sucesso!\n\n` +
                 `👥 Total: ${totalMembers} membros\n` +
                 `🔹 Leaders: ${members.leaders.length}\n` +
                 `🔹 Investigadores: ${members.investigators.length}\n` +
                 `🔹 Agents: ${members.agents.length}\n` +
                 `🔹 Newbies: ${members.newbies.length}`
      });
    } catch (error) {
      console.error('Erro ao sincronizar membros:', error);
      await interaction.editReply({
        content: `❌ Erro ao sincronizar membros: ${error.message}`
      }).catch(() => {});
    }
    return;
  }

  if (commandName === 'setpainelcargo') {
    try {
      const embed = new EmbedBuilder()
        .setColor('#a855f7')
        .setTitle('🎯 Verificação de Cargo - X NEWBIES')
        .setDescription(
          '**Para conseguir o cargo X NEWBIES:**\n\n' +
          '1️⃣ Clique no botão **Verificar** abaixo\n' +
          '2️⃣ Você receberá o cargo automaticamente\n\n' +
          '✅ **Qualquer membro do servidor pode usar este botão**\n' +
          '⚠️ **Requisito:** Estar no servidor X TEAM'
        )
        .setFooter({ text: 'X TEAM - Cyber Ops' })
        .setTimestamp();

      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('verify_role')
            .setLabel('Verificar')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
        );

      await interaction.reply({
        embeds: [embed],
        components: [button]
      });
    } catch (error) {
      console.error('Erro ao criar painel de cargo:', error);
      await interaction.reply({
        content: `❌ Erro ao criar painel: ${error.message}`,
        ephemeral: true
      }).catch(() => {});
    }
    return;
  }
});

// Handler para o botão de verificação
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify_role') {
    await interaction.deferReply({ ephemeral: true });

    const NEWBIE_ROLE_ID = '1473730153828847840';

    try {
      // Buscar o membro
      const member = await interaction.guild.members.fetch(interaction.user.id);

      // Verificar se já tem o cargo
      if (member.roles.cache.has(NEWBIE_ROLE_ID)) {
        await interaction.editReply({
          content: '✅ Você já possui o cargo <@&' + NEWBIE_ROLE_ID + '>!'
        });
        return;
      }

      // Dar o cargo
      await member.roles.add(NEWBIE_ROLE_ID);

      await interaction.editReply({
        content: '✅ **Verificação bem-sucedida!**\n\n' +
                 'Você recebeu o cargo <@&' + NEWBIE_ROLE_ID + '>!\n\n' +
                 'Bem-vindo à X TEAM! 🎉'
      });
    } catch (error) {
      console.error('Erro ao verificar cargo:', error);
      await interaction.editReply({
        content: '❌ Erro ao adicionar cargo. Tente novamente mais tarde ou contate um administrador.'
      });
    }
  }
});

// Monitoramento automático desabilitado (bio não é acessível pela API)
// Use o comando /setpainelcargo para dar o cargo X NEWBIES

client.login(process.env.DISCORD_TOKEN);
