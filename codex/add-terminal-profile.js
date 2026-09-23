// Add "Hyacine Dusklight" scheme + themed "风堇 Hyacine" profile to Windows Terminal
const fs = require('fs');
const path = 'C:/Users/33352/AppData/Local/Packages/Microsoft.WindowsTerminal_8wekyb3d8bbwe/LocalState/settings.json';
fs.copyFileSync(path, path + '.bak');

const s = JSON.parse(fs.readFileSync(path, 'utf8'));

s.schemes = s.schemes || [];
if (!s.schemes.some(x => x.name === 'Hyacine Dusklight')) {
  s.schemes.push({
    name: 'Hyacine Dusklight',
    background: '#221E42',
    foreground: '#F0E6F6',
    cursorColor: '#FF8FC0',
    selectionBackground: '#5A3A68',
    black: '#14121F',
    red: '#FF6E8E',
    green: '#7FE0B0',
    yellow: '#F5C56A',
    blue: '#82D0EC',
    purple: '#B49AE8',
    cyan: '#8FDCD2',
    white: '#E9E2F5',
    brightBlack: '#6F6690',
    brightRed: '#FF8FB0',
    brightGreen: '#9CEBC6',
    brightYellow: '#FFD98F',
    brightBlue: '#A5D8F5',
    brightPurple: '#C9B2F2',
    brightCyan: '#B0EAE2',
    brightWhite: '#FFFFFF',
  });
}

s.profiles = s.profiles || {};
s.profiles.list = s.profiles.list || [];
if (!s.profiles.list.some(x => x.name === '风堇 Hyacine')) {
  s.profiles.list.push({
    name: '风堇 Hyacine',
    guid: '{a7c3f1e9-5b8d-4e2a-b6c1-9d0e4f8a2b31}',
    commandline: '%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    startingDirectory: '%USERPROFILE%',
    colorScheme: 'Hyacine Dusklight',
    backgroundImage: 'C:\\Users\\33352\\zcode-hyacine-theme\\wallpapers\\hyacine-static.jpg',
    backgroundImageOpacity: 0.16,
    backgroundImageStretchMode: 'uniformToFill',
    useAcrylic: false,
    font: { size: 12 },
  });
}

fs.writeFileSync(path, JSON.stringify(s, null, 4));
console.log('WT settings updated: schemes=' + s.schemes.length + ' profiles=' + s.profiles.list.length);
