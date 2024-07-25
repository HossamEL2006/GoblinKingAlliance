# Goblin King Alliance Discord Bot

Welcome to the Goblin King Alliance Discord Bot! This bot is designed to help the Goblin King alliance of Clash of Clans track and display player stats across multiple clans within the alliance.

## Features

- **Track Players:** Monitor and track players in the Goblin King alliance.
- **Display Stats:** Display various stats such as trophies, clan wars performance, donations, and more.
- **Automatic Updates:** Regularly updates player stats to keep the information current.
- **Custom Commands:** A set of commands to retrieve and display specific player or clan information.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Discord.js library
- Clash of Clans API key

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/HossamEL2006/GoblinKingAlliance.git
    cd goblin-king-bot
    ```

2. Install the required dependencies:

    ```sh
    npm install
    ```

3. Set up your environment variables. Create a `config.json` file in the root directory and add your Discord bot token and Clash of Clans API key:

    ```json
    {
	    "token": "discord token",
        "clientId": "discord client id",
	    "guildId": "discord guild id",

	    "cocToken": "clashofclans api token"
    }
    ```

4. Start the bot:

    ```sh
    node index.js
    ```

### Usage

Once the bot is running, you can use the following commands in your Discord server:

- `/ping`: Replies with "pong" (for debugging purposes only).
- `/isinalliance [player_tag]`: informs if the specified player is in the alliance currently or not.
- `/achievements [player_tag]`: returns all the achievements of the specified player.
- `/displaydonations [player_tag]`: Displays the amount of donations made by a play in each clan of the alliance.

### Example Commands

- `/isinalliance #PQR1234`: Tells you if the player with the tag `#PQR1234` is in the alliance
- `/displaydonations #PQR1234`: Displays the donations made by the player `#PQR1234` in each clan of the alliance.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch to your fork.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, feel free to reach out via GitHub issues or contact the project maintainer at hoss.lehhit@gmail.com.

---

Thank you for using the Goblin King Alliance Discord Bot! Happy Clashing!
