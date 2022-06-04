const http = require('http')

const callbackURL = new URL(process.env.CALLBACK_URL)
exports.isCallbackSet = !!callbackURL

const callbackObjects = JSON.parse(process.env.CALLBACK_OBJECTS)

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
exports.callbackHandler = (update, origin, doc) => {
    const room = doc.name
    const dataToSend = {
        room: room,
        data: {}
    }
    const sharedObjectList = Object.keys(callbackObjects)
    sharedObjectList.forEach(sharedObjectName => {
        const sharedObjectType = callbackObjects[sharedObjectName]
        dataToSend.data[sharedObjectName] = {
            type: sharedObjectType,
            content: getContent(sharedObjectName, sharedObjectType, doc).toJSON()
        }
    })
    callbackRequest(callbackURL, parseInt(process.env.CALLBACK_TIMEOUT), dataToSend)
}

/**
 * @param {URL} url
 * @param {number} timeout
 * @param {Object} data
 */
const callbackRequest = (url, timeout, data) => {
    data = JSON.stringify(data)
    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        timeout: timeout,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
    const req = http.request(options)
    req.on('timeout', () => {
        console.warn('Callback request timed out.')
        req.abort()
    })
    req.on('error', (e) => {
        console.error('Callback request error.', e)
        req.abort()
    })
    req.write(data)
    req.end()
}

/**
 * @param {string} objName
 * @param {string} objType
 * @param {WSSharedDoc} doc
 */
const getContent = (objName, objType, doc) => {
    switch (objType) {
        case 'Array': return doc.getArray(objName)
        case 'Map': return doc.getMap(objName)
        case 'Text': return doc.getText(objName)
        case 'XmlFragment': return doc.getXmlFragment(objName)
        case 'XmlElement': return doc.getXmlElement(objName)
        default: return {}
    }
}