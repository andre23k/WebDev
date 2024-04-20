import client from "../../client.js";
import { handleTicketClose } from "../../events/ticket/functions/closeticket.js";
import fileticket from "../../events/ticket/functions/fileticket.js";
import TicketHandler from "../../events/ticket/ticketCreate.js";
import interactionButtonVerification from "../../events/verificationbutton.js";

const ticket = new TicketHandler()

export default async function HandleButton(interaction) {
    const type = interaction.customId
    if (type.includes(`{`)) {
        const data = JSON.parse(type)
        if (data.key == 'ping') return client.slashCommands.get('ping').run(client, interaction, true)
    }

    if (type === 'close-ticket') return await handleTicketClose(interaction)
    if (type === 'file-ticket') return await fileticket(interaction)
    if (type === 'verificar') return await interactionButtonVerification(interaction);

    await ticket.createTicket(interaction, type);
}