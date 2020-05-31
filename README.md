# Coup Online

This project is an online port of the card game Coup. It is currently hosted at [here](https://www.chickenkoup.com/).

Perfect to play with friends during quarantine c:
## About the project
This project consists of two parts
1. The React.js client
2. The Node.js/Express.js backend server

Technologies: React.js, Node.js, Express.js, Socket.io

Deployment: Heroku

## Features

### Party Creation

Seamlessly create a party with a 6-digit code. Copy the code using the 'copy to clipboard' button and send it to those whom you wish to play with. 

Once a player joins, they will appear as 'Not Ready' on the list of players. The joining player must hit the 'Ready' button to notify the game creator that they are ready to start the game. 

If a player has joined the room, but disconnects (ex. closing the tab), the player will also be removed from the list of party members and will have to rejoin. 

The game creator can click/touch and drag each party member around in the list to form the desired turn order. 

### Individualized Connections 

The backend architecture is designed to send individualized information to each client. This prevents excess information from being shared with clients that do not require it.

### Client Voting system

On events such as a challenge, block, or a challenge of a block, the server will open up voting where each client will cast their vote. Voters are chosen based on the source, target, and type of event. Voting finishes when either all voters have passed, or immediately when a voter chooses to challenge or block. 

### Game Event Log

In the client, there is an event log showing all players the last 4 actions to help them keep track of the game. This log also shows when a player disconnects.

### Garbage Collection

A script is run to destroy game instances that have 0 connections.


### Chicken Drumstick Emoji

Courtesy of https://twemoji.twitter.com/

## License
[MIT](https://choosealicense.com/licenses/mit/)
