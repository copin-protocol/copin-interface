// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { AxiosError } from 'axios'

export const getAxiosErrorMessage = (error: AxiosError): string => {
  if (!error?.response?.data) return t`An error occurs. Please try again`
  return (error.response.data as any).message
}

type ContractError = {
  code: number
  message: string
  data: { code: number; message: string }
}

export const getContractErrorMessage = (err: any): string => {
  if (err?.data || err?.error?.data || err?.error?.message) {
    const error: ContractError = err.error ? err.error : err
    const message =
      (error?.data && error.data?.message ? error.data.message : error.message) ?? t`An error occurs. Please try again`
    if (message.includes('insufficient funds for gas * price + value'))
      return t`Insufficient funds for gas fee and value`
    return message.replace('execution reverted: ', '')
  }
  return err?.message ?? t`An error occurs. Please try again`
}

export const getErrorMessage = (err: any) => {
  if (err.response) {
    return getAxiosErrorMessage(err)
  }
  return getContractErrorMessage(err)
}

export class ChainUnsupportedError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.name = 'ChainUnsupportedError'
    this.message = message
  }
}

export class ChainUnknownError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.name = 'ChainUnknownError'
    this.message = message
  }
}

export class ConnectorUnsupportedError extends Error {
  constructor(connectorId: string, ...params: any[]) {
    super(...params)
    this.name = 'ConnectorUnsupportedError'
    this.message = `Unsupported connector: ${connectorId}.`
  }
}

export class ConnectionRejectedError extends Error {
  constructor(...params: any[]) {
    super(...params)
    this.name = 'ConnectionRejectedError'
    this.message = `The activation has been rejected by the provider.`
  }
}

export class ConnectorConfigError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.name = 'ConnectorConfigError'
    this.message = message
  }
}

export class NetworkChangedError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.name = 'NetworkChangedError'
    this.message = message
  }
}

export class WalletProviderError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params)
    this.name = 'WalletProviderError'
    this.message = message
  }
}

export class TransactionError extends Error {
  hash: string
  constructor(message: string, hash: string, ...params: any[]) {
    super(...params)
    this.name = 'TransactionError'
    this.message = message
    this.hash = hash
  }
}
