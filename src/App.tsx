import { useState } from 'react'
import './App.css'
import {Xumm} from 'xumm'

const xumm = new Xumm('47fdfcb7-8362-47fe-9a89-a2efc55e86d5') // Some API Key

function App() {
  const [account, setAccount] = useState('')
  const [payloadUuid, setPayloadUuid] = useState('')
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState('')
  const [openPayloadUrl, setOpenPayloadUrl] = useState('')

  xumm.user.account.then(a => setAccount(a ?? ''))

  const createPayload = async () => {
    const payload = await xumm.payload?.createAndSubscribe({
      TransactionType: 'Payment',
      Destination: 'rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ',
      Account: account,
      Amount: String(1337),
    }, event => {
      // Return if signed or not signed (rejected)
      setLastPayloadUpdate(JSON.stringify(event.data, null, 2))

      // Only return (websocket will live till non void)
      if (Object.keys(event.data).indexOf('signed') > -1) {
        return true
      }
    })

    if (payload) {
      setPayloadUuid(payload.created.uuid)

      if (xumm.runtime.xapp) {
        xumm.xapp?.openSignRequest(payload.created)
      } else {
        if (payload.created.pushed && payload.created.next?.no_push_msg_received) {
          setOpenPayloadUrl(payload.created.next.no_push_msg_received)
        } else {
          window.open(payload.created.next.always)
        }
      }
    }

    return payload
  }

  return (
    <div className="App">
      <div>
        Hi <b>{ account }</b>
      </div>
      {
        account === '' && !xumm.runtime.xapp
          ? <button onClick={xumm.authorize}>Sign in</button>
          : ''
      }
      {
        account !== ''
          ? <button onClick={createPayload}>Make a payment</button>
          : ''
      }
      <br />
      <br />
      <code>{payloadUuid}</code>
      {
        payloadUuid
          ? openPayloadUrl !== ''
            ? <b><br /><a href={openPayloadUrl} target="_blank">Payload Pushed, no push received? Open Payload...</a></b>
            : 'Payload pushed'
          : ''
      }
      <pre>{ lastPayloadUpdate }</pre>
    </div>
  )
}

export default App
