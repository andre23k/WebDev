import TicketHandler from "../../events/ticket/ticketCreate.js";
const Ticket = new TicketHandler()

export default async function HandleSelectMenu(interaction) {
    if (interaction.customId === 'menu') return await Ticket.SelectMenu(interaction)
}