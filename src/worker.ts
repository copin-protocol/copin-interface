import { BalanceServiceWorker } from 'serviceWorker/balanceWorker'
import { GainsServiceWorker } from 'serviceWorker/gainsWorker'
import { PythServiceWorker } from 'serviceWorker/pythWorker'
import { fetchMarketsData, retryAsync } from 'serviceWorker/utils'

import { WorkerMessage, WorkerSendMessage } from 'utils/types'

let instance: BaseServiceWorker

const ports: MessagePort[] = []
const balanceService = new BalanceServiceWorker()

function onReceiveMessage(port: MessagePort) {
  return async (e: MessageEvent) => {
    const data = e.data as WorkerSendMessage

    if (data.type === 'trader_balance') {
      for (const trader of data.data) {
        const address = trader.address
        const protocol = trader.protocol
        const balances = await retryAsync(
          async () => {
            const balance = balanceService.getBalances({
              address,
              protocol,
            })
            return balance
          },
          {
            maxRetries: 5,
            initialDelay: 5_000,
          }
        )

        if (!!balances && !!Object.keys(balances).length) {
          const msg: WorkerMessage = { type: 'trader_balance', data: { address, protocol, balances } }
          port?.postMessage(msg)
        }
      }
    }
  }
}
//@ts-ignore
self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0]
  ports.push(port)
  port.onmessage = onReceiveMessage(port)
}

class BaseServiceWorker {
  constructor() {
    if (instance) return instance
    this.init()
  }

  private async init() {
    const marketsData = await fetchMarketsData()
    new PythServiceWorker(marketsData, this.broadcastMessageUpdate)
    new GainsServiceWorker(marketsData, this.broadcastMessageUpdate)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  private broadcastMessageUpdate(message: WorkerMessage): void {
    ports.forEach((port) => {
      port.postMessage(message)
    })
  }
}

new BaseServiceWorker()
