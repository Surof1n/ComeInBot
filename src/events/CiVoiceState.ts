import { CiListener } from '@akairo';
import { VoicePerUttils } from '@utils';
import { VoiceState } from 'discord.js';

export default class ReadyEvent extends CiListener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate',
    });
  }

  async exec(oldState: VoiceState, state: VoiceState) {
    const { member, guild } = state;

    if (!member || member == undefined) return;

    const isJoined = !!(!oldState.channelID && state.channel);
    const isLeaved = !!(oldState.channelID && !state.channelID);
    const isChannelChanged = !!(oldState.channelID !== state.channelID && !isJoined && !isLeaved);

    const nowAFK = !!(
      guild.afkChannelID &&
      guild.afkChannelID !== oldState.channelID &&
      guild.afkChannelID === state.channelID
    );
    const wasAFK = !!(
      guild.afkChannelID &&
      guild.afkChannelID === oldState.channelID &&
      guild.afkChannelID !== state.channelID
    );
    const isAFK = !!(
      guild.afkChannelID &&
      guild.afkChannelID === oldState.channelID &&
      guild.afkChannelID === state.channelID
    );

    const nowDeaf = !oldState.deaf && state.deaf;
    const wasDeaf = oldState.deaf && !state.deaf;

    if (isJoined && !nowAFK) {
      if (!state.deaf) VoicePerUttils.conservationStarts(state);
    } else if (isLeaved && !wasAFK) {
      VoicePerUttils.conservationEnds(oldState, member);
    } else if (!isAFK) {
      if (isChannelChanged) {
        VoicePerUttils.conservationEnds(oldState, member);
        if (!state.deaf) VoicePerUttils.conservationStarts(state);
      } else if (nowDeaf) {
        VoicePerUttils.conservationEnds(state, member);
      } else if (wasDeaf) {
        VoicePerUttils.conservationStarts(state);
      }
    }

    if (state.channelID === guild.options.createVoiceChannel && (isJoined || isChannelChanged)) {
      const existedPrivateChannel =
        guild.tempChannels.getItemInCollectionWithOwner(member.id) || null;
      if (existedPrivateChannel) {
        return member.voice.setChannel(existedPrivateChannel.id);
      }
      const parentID = state.channel?.parentID;
      const channelPermissions = state.channel?.parent?.permissionOverwrites;

      const generatedChannel = await guild.channels.create(`Комната "${member.displayName}"`, {
        type: 'voice',
        userLimit: 0,
        permissionOverwrites: channelPermissions,
        parent: parentID,
      });

      guild.tempChannels.add(generatedChannel.id, member.id);

      try {
        await member.voice.setChannel(generatedChannel);
      } catch (error) {
        if (generatedChannel.members.filter((m) => !m.user.bot).size === 0) {
          guild.tempChannels.remove(generatedChannel.id);

          await generatedChannel.delete('Private room was empty');
        }
      }
    }

    if (guild.tempChannels.has(oldState.channelID) && (isLeaved || isChannelChanged)) {
      const remainingMembers = oldState.channel.members.filter((m) => !m.user.bot);
      if (remainingMembers.size === 0) {
        try {
          guild.tempChannels.remove(oldState.channelID);
          await oldState.channel?.delete('Private room was empty');
        } catch (error) {
          guild.tempChannels.remove(oldState.channelID);

          await oldState.channel?.delete('Private room was empty');
        } finally {
          const generatedChannel = guild.channels.cache.get(member.id);
          if (generatedChannel == undefined) return;
          if (generatedChannel.members.filter((m) => !m.user.bot).size === 0) {
            guild.tempChannels.remove(generatedChannel.id);
            await generatedChannel.delete('Private room was empty');
          }
        }
      }
    }
  }
}
