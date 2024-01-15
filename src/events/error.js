import client from '.././client.js'

client.on("error", console.error)

process.on('uncaughtExceptionMonitor', async reason => {
    console.log(reason)
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
});
