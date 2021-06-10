import { TempChannelsEntity } from '@entity';
import { Snowflake, Collection } from 'discord.js';

export class GuildTempChannelsManager {
  private _tempChannelsIDs: Collection<
    Snowflake,
    { id: Snowflake; ownerID: Snowflake; coOwnersID: Snowflake[] }
  >;

  constructor() {
    this._tempChannelsIDs = new Collection();

    TempChannelsEntity.find().then((data) => {
      data.forEach((entry) => {
        if (!entry.coOwnersID) {
          entry.coOwnersID = [];
        }
        this._tempChannelsIDs.set(entry.channelID, {
          id: entry.channelID,
          ownerID: entry.ownerID,
          coOwnersID: entry.coOwnersID,
        });
      });
    });
  }

  async add(channelID: Snowflake, ownerID: Snowflake) {
    this._tempChannelsIDs.set(channelID, {
      id: channelID,
      ownerID: ownerID,
      coOwnersID: [],
    });

    await TempChannelsEntity.create({
      channelID: channelID,
      ownerID: ownerID,
    }).save();
  }

  async remove(channelID: Snowflake) {
    this._tempChannelsIDs.delete(channelID);

    TempChannelsEntity.delete({ channelID: channelID });
  }

  async getEntityWithAdmins(adminID: Snowflake, channelID: Snowflake) {
    const arrayEntitys = await TempChannelsEntity.find();
    return arrayEntitys.find(
      (entity) =>
        (entity.ownerID === adminID || entity.coOwnersID.includes(adminID)) &&
        entity.channelID === channelID
    );
  }

  async getEntityWithCoOwners(adminID: Snowflake, channelID: Snowflake) {
    const arrayEntitys = await TempChannelsEntity.find();
    return arrayEntitys.find(
      (entity) => entity.coOwnersID?.includes(adminID) && entity.channelID === channelID
    );
  }

  async getEntityWithOwner(adminID: Snowflake) {
    return await TempChannelsEntity.findOne({ ownerID: adminID });
  }

  getItemInCollectionWithCoAdmins(adminID: Snowflake, channelID: Snowflake) {
    return this._tempChannelsIDs.find(
      (item) =>
        (item.ownerID === adminID || item.coOwnersID.includes(adminID)) && item.id === channelID
    );
  }

  getItemInCollectionWithCoOwners(adminID: Snowflake, channelID: Snowflake) {
    return this._tempChannelsIDs.find(
      (item) => item.coOwnersID.includes(adminID) && item.id === channelID
    );
  }

  getItemInCollectionWithOwner(adminID: Snowflake) {
    return this._tempChannelsIDs.find((entity) => entity.ownerID === adminID);
  }

  async removeCoOwner(coadminID: Snowflake, channelID: Snowflake) {
    try {
      const arrayEntitys = await TempChannelsEntity.find();
      const coOwnerIntity = arrayEntitys.find(
        (entity) => entity.coOwnersID.includes(coadminID) && channelID === entity.channelID
      );
      coOwnerIntity.coOwnersID = coOwnerIntity.coOwnersID.filter((item) => item != coadminID);
      coOwnerIntity.save();

      this._tempChannelsIDs.find(
        (item) => item.coOwnersID.includes(coadminID) && channelID === item.id
      ).coOwnersID = coOwnerIntity.coOwnersID;
      return true;
    } catch (error) {
      return false;
    }
  }

  async addCoOwner(coadminID: Snowflake, channelID: Snowflake) {
    try {
      const arrayEntitys = await TempChannelsEntity.find();
      const coOwnerIntity = arrayEntitys.find(
        (entity) => entity.coOwnersID.includes(coadminID) && channelID === entity.channelID
      );
      coOwnerIntity.coOwnersID.push(coadminID);
      coOwnerIntity.save();

      this._tempChannelsIDs.find(
        (item) => item.coOwnersID.includes(coadminID) && channelID === item.id
      ).coOwnersID = coOwnerIntity.coOwnersID;
      return true;
    } catch (error) {
      return false;
    }
  }

  async switchOwner(prevOwnerID: Snowflake, newAdminID: Snowflake) {
    try {
      const entityChannel = await TempChannelsEntity.findOne({ ownerID: prevOwnerID });
      entityChannel.ownerID = newAdminID;
      entityChannel.save();

      this._tempChannelsIDs.find((item) => item.ownerID === prevOwnerID).ownerID = newAdminID;

      return true;
    } catch (error) {
      return false;
    }
  }

  async hasAdminsInChannels(adminID: Snowflake) {
    const arrayEntitys = await TempChannelsEntity.find();
    return !!arrayEntitys.find(
      (entity) => entity.ownerID === adminID || entity.coOwnersID?.includes(adminID)
    );
  }

  async hasCoOwnerInChannels(adminID: Snowflake) {
    const arrayEntitys = await TempChannelsEntity.find();
    return !!arrayEntitys.find((entity) => entity.coOwnersID?.includes(adminID));
  }

  async hasOnwerInChannels(adminID: Snowflake) {
    const findEntity = await TempChannelsEntity.findOne({ ownerID: adminID });
    return !!findEntity;
  }

  has(channelID: Snowflake) {
    return this._tempChannelsIDs.has(channelID);
  }

  valueOf() {
    return this._tempChannelsIDs;
  }
}
