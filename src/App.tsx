import { useState } from 'react'
import './App.css'
import {Xumm} from 'xumm'

const xumm = new Xumm('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') // Some API Key

function App() {
  const [account, setAccount] = useState('')

  xumm.user.account.then(a => setAccount(a ?? ''))

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
    </div>
  )
}

export default App
