import { emojis } from '@resources';
import { CiEmbed } from '@structures';
import { createCanvas, loadImage, Image, registerFont } from 'canvas';
import { GuildMember, MessageAttachment } from 'discord.js';
import * as moment from 'moment';
import { CardSettings, RoleLevel } from '../../config';

export class CiCardsProfile {
  static async createDefaultCard(member: GuildMember): Promise<MessageAttachment> {
    registerFont('../assets/fonts/Oswald-Regular.ttf', { family: 'Oswald-Regular' });
    registerFont('../assets/fonts/Caveat-Bold.ttf', { family: 'Caveat' });
    registerFont('../assets/fonts/Academy-Bold.ttf', { family: 'Academy' });
    const canvas = createCanvas(CardSettings.IMAGE_SIZE.x, CardSettings.IMAGE_SIZE.y);
    const ctx = canvas.getContext('2d');
    const background = await loadImage('../assets/usual/usual-background.png');
    const base = await loadImage('../assets/usual/base.png');
    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.fillStyle = '#ffffff';
    ctx.drawImage(background, 0, 0, CardSettings.IMAGE_SIZE.x, CardSettings.IMAGE_SIZE.y);
    ctx.drawImage(base, 0, 0);
    // Draw text
    // Draw nick
    ctx.font = '41px "Caveat"';
    const role = member.roles.cache.find((item) => Object.values(RoleLevel).includes(item.id));
    const widthTextNickname = ctx.measureText(member.displayName).width;
    ctx.fillText(
      member.displayName.length > 20 ? member.displayName.slice(0, 20) + '...' : member.displayName,
      CardSettings.POSITIONS.nickname.x,
      CardSettings.POSITIONS.nickname.y + 41
    );
    // Draw role
    ctx.font = '24px Oswald-Regular';
    const roleFill = `Статус: ${
      role
        ? role.name.includes('Гость')
          ? 'Гость'
          : role.name.includes('Житель')
          ? 'Житель'
          : role.name.includes('Знать')
          ? 'Знать'
          : ''
        : ''
    }`;
    ctx.fillText(roleFill, CardSettings.POSITIONS.role.x, CardSettings.POSITIONS.role.y + 26);
    // Draw stats
    ctx.font = '26px "Caveat"';
    ctx.fillText(
      member.economyController.messagesCount.toString(),
      CardSettings.POSITIONS.stats.messages.x,
      CardSettings.POSITIONS.stats.messages.y + 26
    );
    ctx.fillText(
      Math.round(member.timeController.minutesState / 60).toString(),
      CardSettings.POSITIONS.stats.vc_hours.x,
      CardSettings.POSITIONS.stats.vc_hours.y + 26
    );
    ctx.fillText(
      moment().diff(member.joinedAt, 'days').toString(),
      CardSettings.POSITIONS.stats.days.x,
      CardSettings.POSITIONS.stats.days.y + 26
    );
    // Draw data economy
    ctx.fillStyle = '#000000';
    ctx.fillText(
      member.economyController.sparkCount.toString(),
      CardSettings.POSITIONS.wallet.sparks.x -
        Math.floor(ctx.measureText(member.economyController.sparkCount.toString()).width / 2) +
        2,
      CardSettings.POSITIONS.wallet.sparks.y + 26
    );
    ctx.fillText(
      member.reputationController.allTimeRepValue.toString(),
      CardSettings.POSITIONS.wallet.warmth.x -
        Math.floor(
          ctx.measureText(member.reputationController.allTimeRepValue.toString()).width / 2
        ) +
        2,
      CardSettings.POSITIONS.wallet.warmth.y + 26
    );
    ctx.fillText(
      member.pentaController.pentaCount.toString(),
      CardSettings.POSITIONS.wallet.pents.x -
        Math.floor(ctx.measureText(member.pentaController.pentaCount.toString()).width / 2) +
        2,
      CardSettings.POSITIONS.wallet.pents.y + 26
    );
    // Draw About Me
    ctx.font = '22px Academy';
    ctx.fillText(
      wrap(member.aboutValue, 31),
      CardSettings.POSITIONS.userInfo.x,
      CardSettings.POSITIONS.userInfo.y + 22
    );
    // ---
    ctx.font = '26px "Caveat"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
      member.economyController.sparkCount.toString(),
      CardSettings.POSITIONS.wallet.sparks.x -
        Math.floor(ctx.measureText(member.economyController.sparkCount.toString()).width / 2),
      CardSettings.POSITIONS.wallet.sparks.y + 26
    );
    ctx.fillText(
      member.reputationController.allTimeRepValue.toString(),
      CardSettings.POSITIONS.wallet.warmth.x -
        Math.floor(
          ctx.measureText(member.reputationController.allTimeRepValue.toString()).width / 2
        ),
      CardSettings.POSITIONS.wallet.warmth.y + 26
    );
    ctx.fillText(
      member.pentaController.pentaCount.toString(),
      CardSettings.POSITIONS.wallet.pents.x -
        Math.floor(ctx.measureText(member.pentaController.pentaCount.toString()).width / 2),
      CardSettings.POSITIONS.wallet.pents.y + 26
    );

    // Draw Avatar
    ctx.beginPath();
    ctx.arc(
      CardSettings.POSITIONS.avatar.x + CardSettings.AVATAR_SIZE.r,
      CardSettings.POSITIONS.avatar.y + CardSettings.AVATAR_SIZE.r,
      CardSettings.AVATAR_SIZE.r,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      avatar,
      CardSettings.POSITIONS.avatar.x,
      CardSettings.POSITIONS.avatar.y,
      CardSettings.AVATAR_SIZE.x,
      CardSettings.AVATAR_SIZE.y
    );
    return new MessageAttachment(canvas.toBuffer(), 'cartunsual.png');
  }
}

function wrap(str: string, maxWidth: number) {
  const newLineStr = '\n';
  let done = false,
    res = '';
  do {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth) done = true;
  } while (!done);

  return res + str;
}

function testWhite(x: string) {
  const white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}
