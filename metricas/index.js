const fs = require('fs')
const util = require('util')
const PlatziverseAgent = require('../')
const agent = new PlatziverseAgent({
    name: 'Intel Edison',
    username: 'intel edison',
    interval: 600000,
    mqtt: {
        host: 'mqtt://165.227.78.33'
    }
})
agent.addMetric('agua', function getRss () {
    return fs.readFileSync('/home/jhojan/Documentos/sebastian/platziverse-agent/data.txt').toString();
})
agent.connect()
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', payload => {
console.log(payload)
})
function handler (payload) {
console.log(payload)
}