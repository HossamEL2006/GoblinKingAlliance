const { Client } = require("clashofclans.js");
const { clanTags } = require("./alliance.json");
const { cocToken } = require("./config.json");

const cocClient = new Client({ keys: [cocToken] });

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
}

async function isinalliance(player) {
    if (player.clan) {
        return clanTags.includes(player.clan.tag);
    } else {
        return false;
    }
}

async function getAchievements(player) {
    let achievements = await player.achievements;
    let achievementsDict = {};

    for (let i = 0; i < achievements.length; i++) {
        achievementsDict[achievements[i].name] = achievements[i].value;
    }
    return achievementsDict;
}

function clanToName(clan) {
    if (clan) {
        return clan.name;
    } else {
        return null;
    }
}

function clanToTag(clan) {
    if (clan) {
        return clan.tag;
    } else {
        return null;
    }
}

async function getGoldPassSeasonName() {
    let startDate = (await cocClient.getGoldPassSeason()).startTime
    return `${months[startDate.getMonth()]} ${startDate.getFullYear()}`
}

function getLegendLeagueSeasonName() {
    return "2024-07"
//   try {
//     let seasonName = (await cocClient.util.getSeasonId())
//     return seasonName
//   } catch (error) {
//     console.error('Error fetching Legend League leaderboard:', error);
//   }
}



module.exports = {
    isinalliance,
    getAchievements,
    clanToName,
    clanToTag,
    getLegendLeagueSeasonName,
    getGoldPassSeasonName,
    cocClient,
};
