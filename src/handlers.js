import Variables from './config.js';
import helpers from './helpers.js';
import animations from './animations.js';

const { globalVars, globalConst } = Variables;

// -- Command Handlers --

export async function chatMessageHandler(wsdata) {
  const { message, username, userId, emotes } = wsdata.data.message;
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('!lurk') && (globalConst.lurk || globalConst.all)) {
    return lurkCommand(username);
  }

  if (lowerMessage.includes('!so') && (globalConst.welcome || globalConst.all)) {
    return shoutoutCommand(lowerMessage);
  }

  if ((lowerMessage.includes('!choon') || lowerMessage.includes('!tune')) &&
    (globalConst.choon || globalConst.all)) {
    return choonCommand(username);
  }

  if (lowerMessage.includes('!cheers') && (globalConst.cheers || globalConst.all)) {
    const targetUser = lowerMessage.includes('@') ? lowerMessage.split('@')[1] : null;
    return cheersCommand(username, targetUser);
  }

  if (lowerMessage.includes('!jointrain') && globalConst.debug) {
    return animations.hypetrain.hypetrainprogression(userId);
  }

  if (emotes?.length) {
    return emoteMessageHandler(wsdata);
  }
}

export function actionsHandler(wsdata) {
  // Placeholder: define your action handling logic here
  const { name, data } = wsdata.data;
  console.log(`Received action: ${name}`, data);
}

// -- Emote Animation Handler --

export async function emoteMessageHandler(wsdata) {
  const { message, role, subscriber, emotes } = wsdata.data.message;
  const lowerMessage = message.toLowerCase();
  const images = emotes.map(e => e.imageUrl);
  let eCount = helpers.getCommandValue(lowerMessage, "count");
  let eInterval = helpers.getCommandValue(lowerMessage, "interval");

  if (eCount > globalConst.maxemotes) {
    eCount = globalConst.maxemotes;
  }

  const animationMap = [
    ['!er rain', 'emoteRain', 50, 50, 'rain'],
    ['!er rise', 'emoteRise', 100, 50, 'rise'],
    ['!er explode', 'emoteExplode', 100, 20, 'explode'],
    ['!er volcano', 'emoteVolcano', 100, 20, 'volcano'],
    ['!er firework', 'emoteFirework', 100, 20, 'firework'],
    ['!er rightwave', 'emoteRightWave', 100, 20, 'waves'],
    ['!er leftwave', 'emoteLeftWave', 100, 20, 'waves'],
    ['!er carousel', 'emoteCarousel', 100, 150, 'carousel'],
    ['!er spiral', 'emoteSpiral', 100, 170, 'spiral'],
    ['!er comets', 'emoteComets', 100, 50, 'comets'],
    ['!er dvd', 'emoteDVD', 8, 50, 'dvd'],
    ['!er text', 'emoteText', 'HYPE', 25, 'text'],
    ['!er cyclone', 'emoteCyclone', 100, 30, 'cyclone'],
    ['!er tetris', 'emoteTetris', 50, 40, 'tetris']
  ];

  const match = animationMap.find(([cmd]) => lowerMessage.startsWith(cmd));

  if (globalConst.emoterain && globalConst.subonly && !subscriber) {
    console.log("Sub Only Mode: Not a subscriber.");
    return;
  }

  if (match) {
    const [_, funcName, defaultCount, defaultInterval, module] = match;
    eCount ||= defaultCount;
    eInterval ||= defaultInterval;

    // emoteText special case
    if (funcName === 'emoteText') {
      const [, extractedText] = /text (\S+)/gm.exec(message) || [];
      if (!extractedText || images.length === 0) {
        return botChat("Invalid Syntax. Use '!er text <word> <emotes>'");
      }
      eCount = extractedText;
    }

    if (animations[module]?.[funcName]) {
      console.log(`Running ${funcName} with ${eCount} emotes at ${eInterval}ms`);
      animations[module][funcName](images, eCount, eInterval);
    } else {
      console.warn("Animation mapping failed.");
    }
    return;
  }

  // Kappagen
  if (globalConst.kappagen && globalConst.subonly && !subscriber) return;
  if (lowerMessage.includes('!k ')) {
    const random = Math.floor(Math.random() * animationMap.length);
    const [, func, count, interval, mod] = animationMap[random];
    eCount ||= count;
    eInterval ||= interval;

    if (animations[mod]?.[func]) {
      console.log(`Kappagen -> ${mod}.${func} with ${eCount} emotes`);
      animations[mod][func](images, eCount, eInterval);
    }
    return;
  }

  // Default random animation
  const random = Math.floor(Math.random() * 3);
  const defaultEmoteAnim = [animations.rain.emoteRain, animations.bounce.emoteBounce, animations.fade.create][random];
  defaultEmoteAnim(images, emotes.length);
}

// -- Utility Commands --

export async function cheersCommand(username, targetUser) {
  try {
    const avatars = await Promise.all([
      helpers.getTwitchAvatar(username),
      helpers.getTwitchAvatar(targetUser)
    ]);

    if (avatars.length < 2) throw new Error("Missing user avatars for Cheers");

    const runCheers = helpers.executeWithInterval(() => {
      animations.cheers.create(avatars);
    }, 15000);

    runCheers();
  } catch (error) {
    console.error("Cheers failed:", error);
  }
}

export async function choonCommand(username) {
  try {
    const avatar = await fetchAvatar(username);
    animations.choon.createAvatarChoon([avatar]);
  } catch (error) {
    console.error("Choon fetch failed:", error);
  }
}

export async function lurkCommand(username) {
  try {
    const avatar = await fetchAvatar(username);
    animations.lurking.create(avatar, 3);
  } catch (error) {
    console.error("Lurk fetch failed:", error);
  }
}

export async function shoutoutCommand(lowerMessage) {
  const match = lowerMessage.match(/@(.*)/);
  const username = match?.[1];

  if (!username) return;

  try {
    const avatar = await fetchAvatar(username);
    animations.rain.emoteRain([avatar], globalConst.defaultemotes, 50);
  } catch (error) {
    console.error("Shoutout failed:", error);
  }
}

export async function firstWordsHandler(wsdata) {
  if (!globalConst.welcome && !globalConst.all) return;

  const { username } = wsdata.data.message;
  try {
    const avatar = await fetchAvatar(username);
    animations.rain.emoteRain([avatar], globalConst.defaultemotes, 50);
  } catch (error) {
    console.error("First words avatar fetch failed:", error);
  }
}

// -- Helpers --

async function fetchAvatar(username) {
  const response = await fetch(`https://decapi.me/twitch/avatar/${username}`);
  if (!response.ok) throw new Error("Failed to fetch avatar");
  return await response.text();
}

function botChat(message) {
  ws.send(JSON.stringify({
    request: "DoAction",
    action: { name: "ERTwitchBotChat" },
    args: { message },
    id: "123"
  }));
}

export default {
  chatMessageHandler,
  actionsHandler,
  emoteMessageHandler,
  firstWordsHandler,
  cheersCommand,
  choonCommand,
  lurkCommand,
  shoutoutCommand
};
