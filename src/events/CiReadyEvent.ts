import { CiCommand, CiListener } from '@akairo';
import { GuildEntity, MemberEntity } from '@entity';
import { mainGuildId } from '@typings';
import { CiRepTimeout } from '../utils';

export default class ReadyEvent extends CiListener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec() {
    const allEntityMembers = await MemberEntity.find();
    const allEntityGuilds = await GuildEntity.find();
    this.client.guilds.cache.forEach((guild) => {
      guild.init(allEntityGuilds.find((entityGuild) => entityGuild.id === guild.id));
      new CiRepTimeout()._init(guild, this.client);
      guild.members.cache.forEach((member) => {
        member.init(allEntityMembers.find((entityMember) => entityMember.id === member.id));
      });
    });
  }
}
