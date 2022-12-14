import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import config from 'config/index';
import dbTokens from 'src/database/tokensRepository';


// interface IUserWithToken extends  {

// }

@Injectable()
export class AuthService {
    createRefreshToken(user: any) : string {
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(config.refreshTokenLife));
      return jwt.sign({ id: user.id }, config.jwtTokenKey, { expiresIn: config.refreshTokenLife });
    }

    auth(user: any) {
      const token = jwt.sign({ id: user.id }, config.jwtTokenKey, { expiresIn: config.jwtTokenLife });
      const data = { ...user, token };
      if (user.password) {
        delete data.password;
      }
      return data;
    }

    async updateToken(token: string, id: string) : Promise<any> {
      return dbTokens.update(token, id);
    }
  
    async findToken(userId: string, prop: string) : Promise<any> {
      const [result] = await dbTokens.findOne(userId, prop);
      return result;
    }
  
    async insertToken(data: any) : Promise<any> {
      const [insert] = await dbTokens.insertToTable(data);
      return insert;
    }
}
