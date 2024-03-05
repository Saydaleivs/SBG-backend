class BaseError extends Error {
  name: string
  statusCode: number

  constructor(name: string, statusCode: number) {
    super()
    this.name = name
    this.statusCode = statusCode
  }
}

export default BaseError
