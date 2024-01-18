import { Colors } from './types'

const white = '#FFFFFF'
const black = '#000000'

export const linearGradient3 = 'linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%)'

function colors(darkMode: boolean): Colors {
  return {
    darkMode,
    // base
    white,
    black,

    // backgrounds / greys
    neutral8: darkMode ? '#0B0E18' : '#FCFCFD',
    neutral7: darkMode ? '#0B0E18' : '#F4F5F6',
    neutral6: darkMode ? '#101423' : '#DDDEE2',
    neutral5: darkMode ? '#1F2232' : '#B1B5C3',
    neutral4: darkMode ? '#313856' : '#777E90',
    neutral3: darkMode ? '#777E90' : '#353945',
    neutral2: darkMode ? '#C0C0C9' : '#23262F',
    neutral1: darkMode ? '#FCFCFD' : '#141416',

    //primary colors
    primary1: '#4EAEFD',
    primary2: '#97CFFD',
    primary3: '#2F9EEE',

    // other
    red1: '#FA7B70',
    red2: '#FA5547',
    red3: '#BC2B1F',
    green1: '#38D060',
    green2: '#6DD488',
    green3: '#2B9948',
    orange1: '#FFC24B',
    orange2: '#FCEFD1',
    orange3: '#CB8D14',

    modalBG: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    modalBG1: darkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.85)',
  }
}

export const themeColors = colors(true)

export default colors

export type ColorsIndexType = keyof Omit<ReturnType<typeof colors>, 'darkMode'>
