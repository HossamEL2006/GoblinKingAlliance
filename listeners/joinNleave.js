
//! Important:
//* This function only works for tracking a single player

const { clanToName, clanToTag, cocClient } = require("../cocFunctions.js");

var previousClan = null

async function joinNleave(client) {
    try {
        const player = await cocClient.getPlayer('#GL2QQVY9P');
        // console.log(`${clanToTag(player.clan)}${clanToTag(previousClan)}`)
        if (clanToTag(player.clan) != clanToTag(previousClan)) {
            let content = ''
            if (!previousClan) {
                content = `You joined ${clanToName(player.clan)}`
            } else if (!player.clan) {
                content = `You left ${clanToName(previousClan)}`
            } else {
                content = `You left ${clanToName(previousClan)}\nYou joined ${clanToName(player.clan)}`
            }
            client.channels.cache.get('1251835176502165585').send(content);
        }
        previousClan = player.clan
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

module.exports = {joinNleave}
