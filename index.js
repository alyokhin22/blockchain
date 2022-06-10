import CryptoJS from 'crypto-js'
import {nanoid} from 'nanoid'

// Main blockchain
const blockchain = []

// Add node to blockchain function
function addToBlockchain(text) {

  // Generate a node id
  const id = nanoid()

  // Hash entire data
  let hash = md5(text)

  // Compute hash of all previous hashes
  const hashOfAllHashes = (() => {

    let _hashes = ''

    blockchain.forEach((block) => {
      _hashes = md5(_hashes + md5(block.text) + block.hash)
    })

    return md5(_hashes)
  })()

  // Hash entire data hash + hash of all hashes
  hash = md5(hash + hashOfAllHashes)

  // Push to blockchain
  blockchain.push({ id, text, hash })

  // Return node id
  return id
}

// Verify blockchain node
function verifyBlockchainNode(nodeId, expectedHash) {

  // Fetch node from blockchain
  const nodeIndex = blockchain.findIndex((node) => node.id === nodeId)
  const node = blockchain[nodeIndex]

  if(!node)
    throw new Error('Blockchain node not found')

  // Hash node
  let hash = md5(node.text)

  // Calculate all previous nodes hashes
  const hashOfAllHashes = (() => {

    let _hashes = ''

    blockchain.slice(0, nodeIndex).forEach((block) => {
      _hashes = md5(_hashes + md5(block.text) + block.hash)
    })

    return md5(_hashes)
  })()

  // Compute total hash
  hash = md5(hash + hashOfAllHashes)

  return hash === expectedHash
}

// Calculate MD5
function md5(data) {
  return CryptoJS.MD5(data).toString()
}

// Add nodes to blockchain
const firstNodeId = addToBlockchain('Hello World')
const secondNodeId = addToBlockchain('Alexander')
const thirdNodeId = addToBlockchain('12345')

console.log('Whole blockchain:\n', blockchain)
console.log('Verify second node:', verifyBlockchainNode(secondNodeId, blockchain[1].hash))

console.log('Changing second node text to "2"...')
blockchain[1].text = '2'

console.log('Blockchain after second node changing:\n', blockchain)

console.log('Verify first node:', verifyBlockchainNode(firstNodeId, blockchain[0].hash))
console.log('Verify second node:', verifyBlockchainNode(secondNodeId, blockchain[1].hash))
console.log('Verify third node:', verifyBlockchainNode(thirdNodeId, blockchain[2].hash))
