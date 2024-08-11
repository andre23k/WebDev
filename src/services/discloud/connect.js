import { discloud } from 'discloud.app'

discloud.login(process.env.DISCLOUD_TOKEN)
    .then(() => { })
    .catch(err => {
        console.log('Discloud Host Not Connected')
    })

export { discloud } 