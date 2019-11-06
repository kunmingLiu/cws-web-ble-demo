import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormText from 'react-bootstrap/FormText'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Web3 from 'web3'
import GasMenu from './GasMenu'

const web3 = new Web3('https://mainnet.infura.io/v3/44fd23cda65746a699a5d3c0e2fa45d5')

const EthereumTx = require('ethereumjs-tx').Transaction

class EthTest extends Component {
  constructor(props) {
    super(props)
    this.gasHandler = this.gasHandler.bind(this)
  }

  state = {
    addressIndex: 0,
    gasPrice: 0,
    nonce: 0,
    address: '',
    to: '',
    value: '0',
    data: null,
  }

  getAddress = () => {
    const addressIdx = parseInt(this.state.addressIndex)
    this.props.ETH.getAddress(addressIdx).then(address => {
      this.setState({ address })
      web3.eth.getTransactionCount(address, "pending").then(nonce => {
        this.setState({ nonce })
        console.log(this.state)
      })
    })
  }

  gasHandler = gasPrice => {
    const gasPriceInGWei = gasPrice/10
    this.setState({
      gasPrice: gasPriceInGWei,
    })
  }

  sendTransaction = () => {
    const { addressIndex, to, nonce, value, data, gasPrice } = this.state
    const param = {
      nonce: web3.utils.toHex(nonce+1),
      gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), 'Gwei')),
      gasLimit: '0x5208',
      to: to,
      value: web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')),
      data,
      chainId: 3
    }
    console.log(gasPrice.toString())
    console.log(web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), 'gwei')))
    console.log(web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')))
    const tx = new EthereumTx(param)
    console.log(tx)
    const payload = tx.serialize().toString('hex')
    console.log(payload)
    // const payload = 'eb81f884b2d05e00825208940644de2a0cf3f11ef6ad89c264585406ea346a96870107c0e2fc200080018080'
    this.props.ETH.signTransaction(payload, addressIndex).then(hex => {
      console.log(`signed Hex: ${hex}`)
    })
  }

  render() {
    return (
      <Container style={{ textAlign: 'left' }}>
        <h4 style={{ margin: 20 }}>Ethereum Tx</h4>
        <Container>
          {/* Get Address from Card */}
          <Row>
            <Col xs={3}>
              <InputGroup className='mb-3'>
                <FormControl
                  onChange={event => {
                    this.setState({ addressIndex: parseInt(event.target.value) })
                  }}
                  value={this.state.addressIndex}
                  placeholder='Index'
                  aria-describedby='basic-addon2'
                />
                <InputGroup.Append>
                  <Button variant='outline-success' compact='true' onClick={this.getAddress}>
                    Get Address
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col>
              <FormText style={{ textAlign: 'left' }}> From {this.state.address} </FormText>
            </Col>
          </Row>
          {/* Sign Test Transfer */}
          <Row>
            <Col>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId='formGridTo'>
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      onChange={event => {
                        this.setState({ to: event.target.value })
                      }}
                      placeholder='0x...'
                    />
                  </Form.Group>

                  <Form.Group xs={4} md={2} as={Col} controlId='Amount'>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='value'
                      onChange={event => {
                        this.setState({ value: event.target.value })
                      }}
                      placeholder='Amount in Eth'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label> Gas (Gwei) </Form.Label>
                    <GasMenu handler={this.gasHandler}></GasMenu>
                  </Form.Group>
                </Form.Row>

                <Button variant='outline-success' onClick={this.sendTransaction}>
                  {' '}
                  Sign Test Transfer
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Container>
    )
  }
}

export default EthTest
