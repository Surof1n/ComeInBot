/* eslint-disable no-unused-vars */
import * as dotenv from 'dotenv';
import { type } from 'node:os';
import { join } from 'path';
import { CiGuildOptions, CiGuildEconomy, GuildEmojis, CiGuildReputation } from './typings';
dotenv.config({ path: join(__dirname, '..', '.env') });

export const CiOptions = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
};

export const defaultGuildEmojis: GuildEmojis = {
  money: '💰',
  reputation: '🏆',
  donate: '📜',
  accept: '✅',
  decline: '❎',
};

export const StartCiGuildOptions: CiGuildOptions = {
  logchannel: '',
};
export const CiGuildOptionsEconomy: CiGuildEconomy = {
  msgPerCount: 1,
  voicePerCount: 10,
  emoji: defaultGuildEmojis.money,
};
export const CiGuildOptionsReputation: CiGuildReputation = {
  emoji: defaultGuildEmojis.reputation,
};

export enum Icons {
  error = 'https://i.imgur.com/9Fds4w6.png',
  warning = 'https://i.imgur.com/5S7Qdbf.png',
  success = 'https://i.imgur.com/1dFFXO4.png',
  info = 'https://i.imgur.com/sDkN3mN.png',
  streaming = 'https://i.imgur.com/d7LQCzS.png',
  online = 'https://i.imgur.com/Ho92EY9.png',
  dnd = 'https://i.imgur.com/njGQDwH.png',
  idle = 'https://i.imgur.com/lum1O3o.png',
  offline = 'https://i.imgur.com/0iWllP2.png',
  disconnect = 'https://i.ibb.co/8dwGX8Z/member-gray-minus-red.png',
  connect = 'https://i.ibb.co/gZnwwS7/member-gray-plus-green.png',
}

export type TransferTypes = 'spark' | 'penta' | 'reputation' | 'monthReputation';

export const Categoryes = new Map<string, string>([
  ['economy', 'Экономика'],
  ['utils', 'Полезности'],
  ['settings', 'Настройки'],
]);

export const CategoryesIcon = new Map<string, string>([
  ['economy', 'https://i.ibb.co/4dnLdDX/CiCoin.png'],
  ['utils', 'https://i.ibb.co/d2JNw3D/CiUtils.png'],
  ['settings', 'https://i.ibb.co/d2JNw3D/CiUtils.png'],
]);

export enum Colors {
  Brand = 0xff8c1a,
  Blue = 0x437db6,
  Gray = 0x6a7480,
  Red = 0xf04747,
  Yellow = 0xfaa61a,
  Green = 0x43b581,
  Invise = 0x36393f,
}
