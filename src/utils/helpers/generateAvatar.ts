import { SOLANA_ADDRESS_REGEX } from 'utils/config/constants'

const EMOJII =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🫥 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐢 🐍 🦖 🐙 🦑 🦐 🦀 🪸 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐲 🦥 🌵 🎄 🌲 🌳 🍀 🍁 🍄 🐚 🌹 🌺 🌸 🌼 🔥 🌈 💧 ⛄️ 🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🌶 🫑 🌽 🥐 🍞 🥖 🧀 🥚 🥪 🧇 🍔 🍟 🍕 🌮 🍙 🍘 🍥 🍣 🥮 🎂 🍭 🍿 🍩 🍪 🍼 🍺 🍷 ⚽️ 🏀 🏈 ⚾️ 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🎨 🧩 🏵 🥊 🍯'

const emojiList = EMOJII.split(' ')

function lighten(col: string, amt: number) {
  let usePound = false

  if (col[0] == '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

const mapCharToNumber = (char: string) => {
  const code = char.charCodeAt(0)
  if (code >= 'g'.charCodeAt(0) && code <= 'z'.charCodeAt(0)) {
    return (code - 'g'.charCodeAt(0)) % 10
  }
  return char
}

const mapCharToHex = (char: string) => {
  const code = char.charCodeAt(0)
  // Convert any character to a hex value between 0-F
  return (code % 16).toString(16)
}

export const generateAvatar = (address: string) => {
  let renderAddress
  if (address?.startsWith('dydx')) {
    const addressWithoutPrefix = address.slice(5)
    renderAddress = Array.from(addressWithoutPrefix, mapCharToNumber).join('')
  } else if (SOLANA_ADDRESS_REGEX.test(address)) {
    renderAddress = Array.from(address, mapCharToHex).join('')
  }
  const emojiHex = renderAddress ? renderAddress.slice(0, 2) : address.slice(2, 4)
  const emoji = emojiList[parseInt(emojiHex, 16)]
  const bg = `#${renderAddress ? renderAddress.slice(3, 9) : address.slice(5, 11)}`
  return {
    emoji,
    bg,
    gradient: `linear-gradient(-70deg, ${lighten(bg, 50)} 0%, ${lighten(bg, 50)} 41%, ${bg} 40%, ${bg} 100%)`,
  }
}

export function getAvatarName({ address }: { address: string }) {
  const { emoji } = generateAvatar(address)
  const name = EMOJI_NAMES[emoji] ?? ''
  return name
}

const EMOJI_NAMES: Record<string, string> = {
  '😀': 'grinning face',
  '😃': 'big smile',
  '😄': 'laughing',
  '😁': 'beaming smile',
  '😆': 'grinning squint',
  '😅': 'sweat smile',
  '😂': 'joy tears',
  '🤣': 'rolling laugh',
  '🥲': 'tear smile',
  '🥹': 'teary eyes',
  '😊': 'smiling face',
  '😇': 'angel smile',
  '🙂': 'slight smile',
  '🙃': 'upside-down',
  '😉': 'winking face',
  '😌': 'relieved face',
  '😍': 'heart eyes',
  '🥰': 'love face',
  '😘': 'blowing kiss',
  '😗': 'kissing face',
  '😙': 'smiling kiss',
  '😚': 'closed kiss',
  '😋': 'yum face',
  '😛': 'tongue out',
  '😝': 'squint tongue',
  '😜': 'wink tongue',
  '🤪': 'zany face',
  '🤨': 'raised brow',
  '🧐': 'monocle face',
  '🤓': 'nerd face',
  '😎': 'cool face',
  '🥸': 'disguised face',
  '🤩': 'star eyes',
  '🥳': 'party face',
  '😏': 'smirk face',
  '😒': 'unamused face',
  '😞': 'disappointed',
  '😔': 'pensive face',
  '😟': 'worried face',
  '😕': 'confused face',
  '🙁': 'slight frown',
  '😣': 'persevering',
  '😖': 'confounded',
  '😫': 'tired face',
  '😩': 'weary face',
  '🥺': 'pleading eyes',
  '😢': 'crying face',
  '😭': 'loud cry',
  '😮‍💨': 'relieved sigh',
  '😤': 'triumph face',
  '😠': 'angry face',
  '😡': 'rage face',
  '🤬': 'cursing face',
  '🤯': 'mind blown',
  '😳': 'flushed face',
  '🥵': 'hot face',
  '🥶': 'cold face',
  '😱': 'screaming',
  '😨': 'fearful face',
  '😰': 'anxious sweat',
  '😥': 'sad sweat',
  '😓': 'sweat face',
  '🫣': 'peeking face',
  '🤗': 'hugging face',
  '🤔': 'thinking face',
  '🫢': 'shushing face',
  '🤭': 'hand over mouth',
  '🤫': 'shush face',
  '🤥': 'lying face',
  '😶': 'no mouth',
  '😶‍🌫️': 'clouded face',
  '😐': 'neutral face',
  '😑': 'expressionless',
  '😬': 'grimace face',
  '🫠': 'melting face',
  '🙄': 'eye roll',
  '😯': 'hushed face',
  '😦': 'frowning open',
  '😧': 'anguished face',
  '😮': 'open mouth',
  '😲': 'astonished',
  '🥱': 'yawning face',
  '😴': 'sleeping face',
  '🤤': 'drooling face',
  '😪': 'sleepy face',
  '😵': 'dizzy face',
  '😵‍💫': 'spiral eyes',
  '🫥': 'dotted face',
  '🤐': 'zipper mouth',
  '🥴': 'woozy face',
  '🤢': 'nauseated',
  '🤮': 'vomiting face',
  '🤧': 'sneezing face',
  '😷': 'mask face',
  '🤒': 'sick face',
  '🤕': 'injured face',
  '🤑': 'money face',
  '🤠': 'cowboy face',
  '😈': 'smiling devil',
  '👿': 'angry devil',
  '👹': 'ogre face',
  '👺': 'goblin face',
  '🤡': 'clown face',
  '💩': 'poop face',
  '👻': 'ghost face',
  '💀': 'skull face',
  '👽': 'alien face',
  '👾': 'alien monster',
  '🤖': 'robot face',
  '🎃': 'pumpkin face',
  '😺': 'smiling cat',
  '😸': 'grin cat',
  '😹': 'joy tears cat',
  '😻': 'heart eyes cat',
  '😼': 'smirk cat',
  '😽': 'kiss cat',
  '🙀': 'weary cat',
  '😿': 'crying cat',
  '😾': 'pouting cat',
  '🐶': 'dog face',
  '🐱': 'cat face',
  '🐭': 'mouse face',
  '🐹': 'hamster face',
  '🐰': 'bunny face',
  '🦊': 'fox face',
  '🐻': 'bear face',
  '🐼': 'panda face',
  '🐻‍❄️': 'polar bear',
  '🐨': 'koala face',
  '🐯': 'tiger face',
  '🦁': 'lion face',
  '🐮': 'cow face',
  '🐷': 'pig face',
  '🐽': 'pig nose',
  '🐸': 'frog face',
  '🐵': 'monkey face',
  '🙈': 'see no evil',
  '🙉': 'hear no evil',
  '🙊': 'speak no evil',
  '🐒': 'monkey',
  '🐔': 'chicken',
  '🐧': 'penguin',
  '🐦': 'bird',
  '🐤': 'baby chick',
  '🐣': 'hatching chick',
  '🦆': 'duck',
  '🦅': 'eagle',
  '🦉': 'owl',
  '🦇': 'bat',
  '🐺': 'wolf',
  '🐗': 'boar',
  '🐴': 'horse',
  '🦄': 'unicorn',
  '🐝': 'bee',
  '🪱': 'worm',
  '🐛': 'bug',
  '🦋': 'butterfly',
  '🐌': 'snail',
  '🐞': 'ladybug',
  '🐢': 'turtle',
  '🐍': 'snake',
  '🦖': 'dinosaur',
  '🐙': 'octopus',
  '🦑': 'squid',
  '🦐': 'shrimp',
  '🦀': 'crab',
  '🪸': 'coral',
  '🐡': 'puffer fish',
  '🐠': 'tropical fish',
  '🐟': 'fish',
  '🐬': 'dolphin',
  '🐳': 'whale spout',
  '🐋': 'whale',
  '🦈': 'shark',
  '🐊': 'crocodile',
  '🐲': 'dragon',
  '🦥': 'sloth',
  '🌵': 'cactus',
  '🎄': 'christmas tree',
  '🌲': 'pine tree',
  '🌳': 'deciduous tree',
  '🍀': 'four leaf clover',
  '🍁': 'maple leaf',
  '🍄': 'mushroom',
  '🐚': 'spiral shell',
  '🌹': 'rose',
  '🌺': 'hibiscus',
  '🌸': 'cherry blossom',
  '🌼': 'blossom',
  '🔥': 'fire',
  '🌈': 'rainbow',
  '💧': 'droplet',
  '⛄️': 'snowman',
  '🍏': 'green apple',
  '🍎': 'red apple',
  '🍐': 'pear',
  '🍊': 'orange',
  '🍋': 'lemon',
  '🍌': 'banana',
  '🍉': 'watermelon',
  '🍇': 'grapes',
  '🍓': 'strawberry',
  '🫐': 'blueberries',
  '🍈': 'melon',
  '🍒': 'cherries',
  '🍑': 'peach',
  '🥭': 'mango',
  '🍍': 'pineapple',
  '🥥': 'coconut',
  '🥝': 'kiwi',
  '🍅': 'tomato',
  '🍆': 'eggplant',
  '🥑': 'avocado',
  '🌶': 'chili pepper',
  '🫑': 'bell pepper',
  '🌽': 'corn',
  '🥐': 'croissant',
  '🍞': 'bread',
  '🥖': 'baguette',
  '🧀': 'cheese',
  '🥚': 'egg',
  '🥪': 'sandwich',
  '🧇': 'waffle',
  '🍔': 'burger',
  '🍟': 'french fries',
  '🍕': 'pizza',
  '🌮': 'taco',
  '🍙': 'rice ball',
  '🍘': 'rice cracker',
  '🍥': 'fish cake',
  '🍣': 'sushi',
  '🥮': 'moon cake',
  '🎂': 'birthday cake',
  '🍭': 'lollipop',
  '🍿': 'popcorn',
  '🍩': 'doughnut',
  '🍪': 'cookie',
  '🍼': 'baby bottle',
  '🍺': 'beer',
  '🍷': 'wine',
  '⚽️': 'soccer ball',
  '🏀': 'basketball',
  '🏈': 'football',
  '⚾️': 'baseball',
  '🎾': 'tennis',
  '🏐': 'volleyball',
  '🏉': 'rugby ball',
  '🥏': 'flying disc',
  '🎱': 'pool ball',
  '🪀': 'yo-yo',
  '🏓': 'ping pong',
  '🎨': 'art palette',
  '🧩': 'puzzle piece',
  '🏵': 'rosette',
  '🥊': 'boxing gloves',
  '🍯': 'honey pot',
}
