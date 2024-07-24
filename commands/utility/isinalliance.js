const { SlashCommandBuilder } = require("discord.js");
const { isinalliance, cocClient } = require('../../cocFunctions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("isinalliance")
        .setDescription("Informs if a specific player is currently in the Alliance")
        .addStringOption((option) =>
            option.setName("tag").setDescription("The player's tag").setRequired(true)
        ),
    async execute(interaction) {
        const tag = interaction.options.getString("tag");
        const player = await cocClient.getPlayer(tag);

        let answer = isinalliance(player)

        if (await answer) {
            await interaction.reply(
                `${player.name}(${player.tag}) is currently in the Alliance\nHe is currently in ${player.clan.name}`
            );
        } else if (player.clan) {
            await interaction.reply(
                `${player.name}(${player.tag}) is NOT in the Alliance currently\nHe is currently in ${player.clan.name}(${player.clan.tag})`
            );
        } else {
            await interaction.reply(
                `${player.name}(${player.tag}) isn't in any clan at the moment`
            );
        }
    },
};
