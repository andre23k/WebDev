import client from "../../../core/client.js"

export default async (reason) => {

    /**
     * 500 Internal Server Error
     * 10004 Unknown Guild
     * 10008 Unknown Message
     * 50035 Invalid Form Body (Error Handling Filter)
     * 50013 Missing Permissions
     * 11000 Duplicated Creating Document Mongoose - Ignore Error
     * 50001 DiscordAPIError: Missing Access
     * 10062 Unknow Interaction
     */

    if ([500, 10004, 10008, 10062, 50001, "GuildMembersTimeout"].includes(reason?.code)) return
    console.log('unhandledRejection', reason)
    
    const user = await client.users.fetch('648389538703736833').catch(() => null)
    if (!user) return
    user.send({
        embeds: [{
            color: 0xff0000,
            title: '📢 Error Handler | UnhandledRejection',
            description: `\n\`\`\`js\n${reason.stack}\`\`\``.slice(0, 4096),
            footer: { text: `Error Code: ${reason.code || 0}` }

        }]
    }).catch(() => { })

}