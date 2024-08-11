import client from '../../core/client.js'
import { unhandledRejection } from '../../modules/errors/process/unhandledRejection.js'

client.on('error', async error => {
    if (
        [
            10062, // Unknown interaction
            40060
        ].includes(error?.code)) return

    return await unhandledRejection(error)

})