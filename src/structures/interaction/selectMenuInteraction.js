import TicketHandler from "../../events/discord/ticket/ticketCreate.js";
const Ticket = new TicketHandler()

export default async function HandleSelectMenu(interaction) {
    if (interaction.customId === 'menu') return await Ticket.SelectMenu(interaction)
}