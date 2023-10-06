/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express } from 'express-serve-static-core'
interface ITokenData {
  userId: string
  iat?: int
}

declare module 'express-serve-static-core' {
  interface Request {
    tokenData: ITokenData
  }
}

// declare global {
//   namespace Express {
//     interface Request {
//       user: JwtPayloadType
//     }
//   }
// }
