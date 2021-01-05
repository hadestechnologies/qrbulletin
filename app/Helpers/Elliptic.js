var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

var EdDSA = require('elliptic').eddsa;
let eddsa = new EdDSA('ed25519')

function generatePublicKey(priv_key) {
    let k = ec.keyFromPrivate(priv_key)
    return Buffer.from(k.getPublic().encode('bin', true))
}

function sharedKey(local_private_key, pubkey2) {
    let k1 = ec.keyFromPrivate(local_private_key.toString('hex'), 'hex')
    let k2 = ec.keyFromPublic(pubkey2.toString('hex'), 'hex')

    return k1.derive(k2.getPublic())
}

function sign(priv_key, hash) {
    let k = eddsa.keyFromSecret(priv_key)
    return Buffer.from(k.sign(hash).toHex(), 'hex');
}

function verify(pub_key, hash, sig) {
    let k = eddsa.keyFromPublic(pub_key)
    return k.verify(hash, sig)
}


module.exports = {
    generatePublicKey,
    sharedKey,
    sign,
    verify
}

