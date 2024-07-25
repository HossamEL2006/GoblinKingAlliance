

//  TODO: Fix the "Saved Donations in NOT IN THE ALLIANCE : NaN"
//  TODO: Get the donations log working on discord


// IMPORTS
const { clanTags } = require("../alliance.json");
const { getLegendLeagueSeasonName, cocClient } = require('../cocFunctions')
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  updateDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} = require("firebase/firestore");

// KEYS
const firebaseConfig = {
  apiKey: "AIzaSyDOh6ddo-Wt31VLwvK8MRxP5K-is4VPgYY",
  authDomain: "alliance-data-68fb6.firebaseapp.com",
  projectId: "alliance-data-68fb6",
  storageBucket: "alliance-data-68fb6.appspot.com",
  messagingSenderId: "844993010481",
  appId: "1:844993010481:web:ac40b1be848e67f6352e10",
  measurementId: "G-TYS9VRZ2E1",
};

var donationsData = [];
const clanNames = []
var db;
var discordClient;
var donationsChannel;

// Updates CurrentDonations in database
async function updateCurrentDonations(player) {
  var docRef = doc(db, `Donations ${getLegendLeagueSeasonName()}`, player.tag);
  await updateDoc(docRef, {
    CurrentDonations: player.donations,
  });
  console.log(
    `${player.name}'s CurrentDonations were updated to ${player.donations}`
  );
  donationsChannel.send(`${player.name}'s CurrentDonations were updated to ${player.donations}`)
}

// Updates CurrentClan in database
async function updateCurrentClan(player) {
  var docRef = doc(db, `Donations ${getLegendLeagueSeasonName()}`, player.tag);
  if (player.clan && clanTags.includes(player.clan.tag)) {
    updateDoc(docRef, {
      CurrentClan: player.clan.name,
    });
  } else {
    updateDoc(docRef, {
      CurrentClan: "NOT IN THE ALLIANCE",
    });
  }
}

// Adds a player to the database with saved donations set to 0
async function addPlayerToDonationsDB(player) {
  try {
    let dictionary = {
      Name: player.name,
      CurrentDonations: player.donations,
      CurrentClan: player.clan.name,
    }
    for (let i = 0; i < clanNames.length; i++) {
      dictionary["Saved Donations in " + clanNames[i]] = 0
    }
    await setDoc(doc(db, `Donations ${getLegendLeagueSeasonName()}`, player.tag), dictionary);
  } catch (error) {
    console.error(
      `CUSTOM ERROR: Failed to add ${player.tag} to the Donations Database:\n`, error
    );
  }
  
}

// Updates the saved donations in the database
async function addToSavedDonations(player) {
  var docRef = doc(db, `Donations ${getLegendLeagueSeasonName()}`, player.tag);
  var documentData = (await getDoc(docRef)).data();

  let oldClan = documentData.CurrentClan;
  if (oldClan == "NOT IN THE ALLIANCE") return
  let oldDonations = documentData.CurrentDonations;

  await updateDoc(docRef, {
    [`Saved Donations in ${oldClan}`]:
      documentData[`Saved Donations in ${oldClan}`] + oldDonations,
  });
  console.log(`We saved ${oldDonations} for ${player.name} in ${oldClan}`);
  donationsChannel.send(`We saved ${oldDonations} for ${player.name} in ${oldClan}`)
}

async function createDocsForNewMembers() {
  console.log("CREATING NEW DOCS STARTED");
  let a = Date.now();
  for (let i = 0; i < clanTags.length; i++) {
    try {
      const clan = await cocClient.getClan(clanTags[i]);
      const members = await clan.fetchMembers();
      for (let j = 0; j < members.length; j++) {
        let player = members[j];

        // IF PLAYER NOT IN DATABASE
        if (!donationsData.some((item) => item.id == player.tag)) {
          console.log(`Creating new Doc for ${player.name} ...`);
          await addPlayerToDonationsDB(player); // Ensure the document is added before proceeding
        }
        await delay(30)
      }
    } catch (error) {
      console.error(
        `CUSTOM ERROR: Failed to process and fetch members from ${clanTags[i]}:\n`,
        error
      );
    }
  }
  console.log((Date.now() - a) / 1000);
  console.log("CREATING NEW DOCS ENDED");
}

async function updateDonationsCounter() {
  console.log("UPDATING DONATIONS STARTED");
  let a = Date.now();
  for (let i = 0; i < donationsData.length; i++) {
    let playerData = donationsData[i];
    let tag = playerData.id;

    try {
      let player = await cocClient.getPlayer(tag);
      await delay(40)
      console.log("Tracking donations for " + player.name)
      let donations = player.donations;

      // IF PLAYER'S DONATIONS WENT UP WITHOUT CHANGING HIS CLAN
      if (
        donations > playerData.CurrentDonations &&
        player.clan.name == playerData.CurrentClan
      ) {
        console.log(
          `${player.name}'s donations went from ${playerData.CurrentDonations} to ${donations} in ${player.clan.name} (+${donations - playerData.CurrentDonations} donations)`
        );
        donationsChannel.send(
          `${player.name}'s donations went from ${playerData.CurrentDonations} to ${donations} in ${player.clan.name} (+${donations - playerData.CurrentDonations} donations)`
        )
        await updateCurrentDonations(player);
      }

      // IF PLAYER'S DONATIONS WENT DOWN
      //       OR
      // IF PLAYER PREVIOUSLY WAS IN ALLIANCE BUT CHANGED TO ANOTHER CLAN OF THE ALLIACE
      if (
        donations < playerData.CurrentDonations ||
        ((playerData.CurrentClan !== "NOT IN THE ALLIANCE") && !(player.clan && clanTags.includes(player.clan.tag)))
      ) {
        console.log(`We noticed that ${player.name}'s donations counter reset`);
        donationsChannel.send(`We noticed that ${player.name}'s donations counter reset`)
        await addToSavedDonations(player);
        await updateCurrentDonations(player);
        await updateCurrentClan(player);
      }

      // IF A PLAYER WHO'S ALREADY REGISTERED IN THE DATABASE JOINS THE ALLIANCE
      if (playerData.CurrentClan == "NOT IN THE ALLIANCE" && player.clan && clanTags.includes(player.clan.tag)) {
        await updateCurrentClan(player);
      }
    } catch (error) {
      console.error(`CUSTOM ERROR: Failed to process player ${tag}:`, error);
    }
  }
  console.log((Date.now() - a) / 1000);
  console.log("UPDATING DONATIONS ENDED");
}

// Helper function to create a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



async function update() {
  console.log("UPDATE STARTED");
  console.log("CHECKING FOR NEW PLAYERS AND CREATING DOCS")
  await createDocsForNewMembers();
  console.log("UPATING DONATIONS COUNTER")
  await updateDonationsCounter();
  console.log("UPDATE FINISHED");
}


async function getClanNames(){
  for (let i = 0; i < clanTags.length; i++) {
    const clan = await cocClient.getClan(clanTags[i]);
    clanNames.push(clan.name)
  } 
}


async function start(client) {
  console.log("START");

  console.log("INITIALISATION...")
  initializeApp(firebaseConfig); // INITIALISE FIRESTORE
  db = getFirestore();
  onSnapshot(collection(db, `Donations ${getLegendLeagueSeasonName()}`), (snapshot) => { // DATA
    donationsData = [];               // TODO: Maybe I should consider turning data into a dictionary rather than an array
    snapshot.docs.forEach((doc) => {
      donationsData.push({ id: doc.id, ...doc.data() });
    });
  });
  console.log("data")
  console.log(donationsData)
  getClanNames() // Get clan alliance names
  discordClient = client // Define the Discocrd Client
  donationsChannel = discordClient.channels.cache.get('1262968478260793425') //TODO: Move ID to seperate json file
  console.log(donationsChannel)

  await delay(4*1000)
  console.log("data")
  console.log(donationsData)

  console.log("CREATING NEW DOCS")
  await createDocsForNewMembers();
  console.log("ENTRING WHILE LOOP...")
  while (true){
    console.log("UPDATE");
    await update()
  }
}

function getDonationsData(){
  return donationsData
}

module.exports = {
  start, getDonationsData
};