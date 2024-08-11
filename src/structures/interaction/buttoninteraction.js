import client from "../../core/client.js";
import { handleTicketClose } from "../../events/discord/ticket/functions/closeticket.js";
import TicketHandler from "../../events/discord/ticket/ticketCreate.js";
import interactionButtonVerification from "../../events/discord/verify/verificationbutton.js";

const ticket = new TicketHandler()

export default async function HandleButton(interaction) {
    const type = interaction.customId
    if (type.includes(`{`)) {
        const data = JSON.parse(type)
        if (data.key == 'ping') return client.slashCommands.get('ping').run(client, interaction, true)
    }

    if (type === 'close-ticket') return await handleTicketClose(interaction)

    if (type === 'verificar') return await interactionButtonVerification(interaction);

    await ticket.createTicket(interaction, type);
}