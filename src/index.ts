import 'module-alias/register';
import { Structures } from 'discord.js';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { CiClient, CiGuild, CiGuildMember } from '@structures';

Structures.extend('Guild', () => CiGuild);

Structures.extend('GuildMember', () => CiGuildMember);

Array.prototype.randomitem = function () {
  return this[Math.floor(Math.random() * this.length)];
};

async function run() {
  await createConnection()
    .then(() => console.log('Connect Come In Database 🔥🔥🔥'))
    .catch((err) => console.error(err));
  await new CiClient().init();
}

run();
