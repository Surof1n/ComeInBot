import { CiListener } from '@akairo';
import { GuildEntity, MemberEntity } from '@entity';

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
      guild.init(
        allEntityGuilds.find((entityGuild) => entityGuild.id === guild.id)
      );
      guild.members.cache.forEach((member) => {
        member.init(
          allEntityMembers.find((entityMember) => entityMember.id === member.id)
        );
      });
    });
  }
}
