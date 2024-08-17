import client from '../../../core/client.js'
import Database from '../../../database/Database.js'
import { Config } from '../../../util/constants.js';

export default async function autorole() {
  const guildid = Config.mainServer;
  const data = await Database.Guild.findOne({ Id: guildid })
  if (!data || data.autorole?.activeEvent === false) return;
  const roleId = data.autorole.roleId;
  const server = client.guilds.cache.get(data.Id);
  await server.members.fetch();

  server.members.cache.forEach(async (member) => {
    if (member.user.bot) return

    if (!member.roles.cache.has(roleId)) {
      try {
        await member.roles.add(roleId, 'Autorole System!');
        console.log(`Added role ${member.user.username}`)
      } catch (error) {
        console.error(error);
      }
    }
  })
  return;
}