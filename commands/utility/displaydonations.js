
const { SlashCommandBuilder } = require("discord.js");
const { getDonationsData } = require('../../listeners/donations')


module.exports = {
    data: new SlashCommandBuilder()
        .setName("displaydonations")
        .setDescription("Displays the donations of a specific player in every clan of the alliance")
        .addStringOption((option) =>
            option.setName("tag").setDescription("The player's tag").setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName('getdetails')
                .setDescription('Whether or not the detailed answer will be included')
                .setRequired(false)
        ),
    async execute(interaction) {
		const tag = interaction.options.getString("tag");
        const getDetails = interaction.options.getBoolean('getDetails') ?? false; // Default to false if not provided

        const playerData = getDonationsData().find(item => item.id == tag);

        const playersDonations = Object.keys(playerData)
        .filter(key => key.startsWith('Saved Donations'))
        .reduce((acc, key) => {
            const newKey = 'Donations' + key.slice(15); // Replace 'a' with 'b'
            acc[newKey] = playerData[key];
            return acc;
        }, {});

        if (playerData.CurrentClan != 'NOT IN THE ALLIANCE'){
            clan = playerData.CurrentClan
            playersDonations[`Donations in ${clan}`] += playerData.CurrentDonations
        }

        
        const formattedDictionnary = Object.entries(playersDonations)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        await interaction.reply(`**${playerData.Name}'s Donations:**\n${formattedDictionnary}`);
    }
};