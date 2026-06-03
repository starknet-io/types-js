export interface ACCOUNT_VALIDATION_FAILED {
  code: 55
  message: 'Account validation failed'
  data: string
}

export interface SERVICE_BUSY {
  code: -32005
  message: 'Service is busy'
  data: string
}

export interface INVALID_TRANSACTION_INPUT {
  code: 1000
  message: 'Invalid transaction input'
  data: string
}

export interface UNSUPPORTED_TX_TYPE {
  code: 1001
  message: 'the transaction type is not supported'
  data: string
}

export interface TRANSACTION_BLOCKED {
  code: 10000
  message: 'Transaction blocked'
}
