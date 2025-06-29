# Streamer.Bot EmoteOverlayTools - Dockerized

All I did was take the code and prepare it for use in a Docker container so it could be easily installed and run as a service on your local server. All of the original commands are still available.

## From The Guy I Stole It From

> Forked from [VRFlad's](https://vrflad.com) amazing work on [EmoteRain](https://codepen.io/vrflad/pen/VwMYaYo). I couldn't have built this without his code as a building block.
> Inspiration to work on this came from the lack of Twitch Animated emote support in StreamElements. Now I have more animation variation than before and Twitch animated emotes work great!

## Installation

### Prerequisites

- [Streamer.Bot](https://streamer.bot) installed and running
- [OBS](https://obsproject.com/) installed and running
- [Docker](https://www.docker.com/) installed and running

### Setup

1. Clone this repository to your local machine
2. Run `docker compose up -d` in the root of the cloned repository to start the Streamer.Bot server

## Settings Breakdown

- Enable All Features: Enable all features.
- Enable Specific Features: If All Features if disabled, you can select the specific features you wish to activate
- Maximum Emotes Per Action: Sets a hard cap on the number of emotes that can be included in a single action. Can help prevent lag if your setup struggles with too many emotes.
- Restrict Commands to Subs Only: If enabled, only users with a Twitch Subscriber role can use the !k and !er commands.
- SB Server Address: Leave as `localhost:8080` unless you run Streamer.Bot on a different machine to OBS

    `welcome`
    `lurk`
    `emoterain`
    `kappagen`
    `subonly`
    `maxemotes=X`
    `all`

## Features

### EmoteRain

A set of specific animation commands that accept emotes along with optional quantity and interval values

- !er rain
- !er rise
- !er volcano
- !er firework
- !er explode
- !er lefttwave
- !er rightwave
- !er carousel
- !er spiral
- !er dvd
- !er text TEXT_TO_WRITE

All animations have default values for quantity and interval so there's never a need to specify them. But you can get creative and add values like so:

#### format

`!er %command% %emotes% %quantity% %interval%`

#### example

`!er rain gforce_hype 250 50`

This would trigger the rain animation with the gforce_hype emote, raining 250 emotes with a 50ms interval between emotes.

### Visual Lurk

When a user types !lurk in chat their twitch avatar will peek out form a random side of the screen. It will repeat this twice more from random locations.

### Welcome & Shoutout Rain

When a user types their first message for that stream emote rain is triggered with their twitch avatar.

When !so is used the targetted user's Twitch avatar will rain down

### Kappagen

This serves to replace the !k command from StreamElements. If you're using this option, you'll likely want to disable the !k command in StreamElements.

This will pick a random animation from the list mentioned above and invoke it with the emotes sent. The same quantity and interval values can also be used for !k commands

### Choon & Cheers

When a user types `!choon` in chat their twitch avatar will pop in from the side and sing along to the music.

When a user types `!cheers @username` in chat both theirs and their targets avatar will be dropped into a glass of beer. Cheers!

### Hype Train

A Visual Train effect that drives along the top of the screen. The train will be made up of the avatars of the users who have contributed to the hype train.

## Feedback

### Also from the Guy I Stole It From

>I'm always open to feedback on potential improvements and new animations. If you have any suggestions or feedback, please let me know! I stream on Twitch Wednesdays and Sundays at [twitch.tv/gforce_aus](https://www.twitch.tv/gforce_aus)

### From Me

I'll try to keep this up-to-date with the latest features and improvements. If I make any changes beyond Dockerization (which I probably will since the code is a bit smelly - okay _a lot_ smelly), I will publish this in a [Studio42](https://github.com/Studio42-Web-Development) GitHub repository.
