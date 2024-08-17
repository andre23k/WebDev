import Database from '../../../database/Database.js'

export default async function roleAdd(member) {
  const { guild } = member
  const data = await Database.Guild.findOne({ Id: guild.id })
  if (!data || data.autorole?.activeEvent === false) return;
  if (member.user.bot) return

  const role = member.guild.roles.cache.get(data.autorole.roleId);
  if (!role) return

  try {
    member.roles.add(role.id, 'Autorole System!')
  } catch (error) {
    console.error(error);
  }
}