const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const Chain = require("../../db.js").Chain;

module.exports.info = new SlashCommandBuilder()
    .setName("chainpayouts")
    .setDescription("Gives information on chains that haven't received payouts yet.");

module.exports.cmd = async (interaction) => {
    const chains = await Chain.find({ paid: false });

    // Count up all hits into totals
    const hits = {};

    chains.forEach(chain => {
        chain.members.forEach(member => {

            if (member.amount < 4) return; // Disregard contribution below 4 hits

            // Save into hits object
            if ((member.id in hits)) {
                hits[member.id] += member.amount;
            }
            else {
                hits[member.id] = member.amount;
            }
        });
    });

    const embed = new EmbedBuilder()
        .setTitle("Total hits");

    // Loop through hits object
    for (const id in hits) {
        // Get player name
        const res = await fetch(`https://api.torn.com/user/${id}?selections=basic&key=${process.env.TORN_TOKEN}`);
        memberName = (await res.json()).name;

        // Add embed field for player
        embed.addFields({ name: `${memberName} (${id})`, value: `Total hits: ${hits[id]}` });
    };
    
    // Send embed
    await interaction.reply({ embeds: [embed] });
};