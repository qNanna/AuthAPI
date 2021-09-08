import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import fetch from 'cross-fetch';

import config from 'config/index';

const routes = {
    userInfo: `${config.usersApiUrl}/users/getUserByAuth`,
    updateToken: `${config.usersApiUrl}/users/updateToken`,
  };

@Injectable()
export class AuthService {
    createRefreshToken(user: any) : any {
        const expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(config.refreshTokenLife));
        return jwt.sign({ id: user.id }, config.jwtTokenKey, { expiresIn: config.refreshTokenLife });;
    }

    auth(user: any) {
        const token = jwt.sign(
          { id: user.id },
          config.jwtTokenKey,
          {
            expiresIn: config.jwtTokenLife,
          },
        );
        const data = { ...user, token };
        if (user.password) {
          delete data.password;
        }
        return data;
    }

    async getUserByAuth(email: string, password: string) : Promise<any> {
      const request = await fetch(routes.userInfo, {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
          'Content-Type': 'application/json',
          // Authorization: token,
        },
      })
      return request.json()
    }

    async updateUserToken(id : number, prop: string, refreshToken: string) : Promise<any> {
      const request = await fetch(routes.updateToken, {
        method: 'POST',
        body: JSON.stringify({id, prop, refreshToken}),
        headers: {
          'Content-Type': 'application/json',
          // Authorization: token,
        },
      })
      return request.json()
    }
}
