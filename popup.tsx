import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  const changeDarkMode = (action: string) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
            console.log(response)
          })
        }
      }
    )
  }

  return (
    <div
      style={{
        padding: 16
      }}>
      <button onClick={() => changeDarkMode("change")}>Change</button>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
