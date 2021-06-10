import 'module-alias/register';
import { Structures } from 'discord.js';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { CiClient, CiGuild, CiGuildMember } from '@structures';
import moment from 'moment';
import { TextChannel } from 'discord.js';
import { GuildEntity, MemberEntity, TransferReactionEntity } from '@entity';
import { CiTimeout } from '@utils';

Structures.extend('Guild', () => CiGuild);

Structures.extend('GuildMember', () => CiGuildMember);

Array.prototype.randomitem = function () {
  return this[Math.floor(Math.random() * this.length)];
};

String.prototype.emojimatcher = function () {
  const CUSTOM_EMOJI_REGEX = /<(?:.*)?:(\w+):(\d+)>/;
  return this.match(CUSTOM_EMOJI_REGEX)
    ? this.match(CUSTOM_EMOJI_REGEX).slice(1, 3).join(':')
    : this;
};

async function run() {
  await createConnection()
    .then(() => console.log('Connect Come In Database 🔥🔥🔥'))
    .catch((err) => console.error(err));
  const client = await new CiClient().init();
}

run();
