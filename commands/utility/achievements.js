const { SlashCommandBuilder } = require("discord.js");

// const { Client } = require("clashofclans.js");

const { cocToken } = require("../../config.json");

// const client = new Client({ //TODO: Should be imported
// 	keys: [cocToken],
// });

module.exports = {
	data: new SlashCommandBuilder()
		.setName("achievements")
		.setDescription("Returns the achievements of a specific player")
		.addStringOption((option) =>
			option.setName("tag").setDescription("The player's tag").setRequired(true)
		),
	async execute(interaction) {
		const tag = interaction.options.getString("tag");

		const player = await cocClient.getPlayer(tag);

		message = `${player.name}'s achievements:`

		for (let i = 0; i < player.achievements.length; i++) {
			message += `\n${player.achievements[i].name}:${player.achievements[i].value}`
		}

		await interaction.reply(message)

		// await console.log(`${player.name}\n${}`)
	},
};
