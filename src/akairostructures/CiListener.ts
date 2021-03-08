import { Listener } from 'discord-akairo';
import { CiClient } from '@structures';
import { mainGuildId } from '@typings';
import { ListenerOptions } from 'discord-akairo';
import { Guild } from 'discord.js';

export class CiListener extends Listener {
  public client: CiClient;
}
