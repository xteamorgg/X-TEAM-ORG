import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv';

config();

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
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const GUILD_ID = '1473718425749688442'; // Servidor principal X TEAM

(async () => {
  try {
    console.log('🔄 Registrando comandos slash no servidor X TEAM...');

    // Registrar comandos no servidor específico (aparece instantaneamente)
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso no servidor!');
    console.log('\nComandos disponíveis:');
    commands.forEach(cmd => {
      console.log(`  /${cmd.name} - ${cmd.description}`);
    });
    
    console.log('\n✅ Os comandos já estão disponíveis no servidor!');
    
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();
