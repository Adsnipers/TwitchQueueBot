# TwitchQueueBot - a simple chat join Queue bot for streamers playing games with chat
## Getting Started
Simply download the source code and add a .env file
In this file add the following lines
```
USERNAME = your_username
OAUTH = oauth:your_oauth
```
Open a terminal window in the same directory as the downloaded files and run 
```
npm i
```
you're done! simply run
```
npm start
```
to start the bot and it should be running in your channel
### Commands
- !queue - Displays the current queue
- !join - Ran by a chatter, adds them to the queue
- !queueremove - Removes the most recent person from the queue
- !queuebot - displays a special thank you message
