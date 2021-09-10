import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import fetch from 'cross-fetch';

import config from 'config/index';

const routes = {
    users: `${config.usersApiUrl}/api/v1/users/`,
    userInfoByEmail: `${config.usersApiUrl}/api/v1/users/email`,
  };

@Injectable()
export class AuthService {
    createRefreshToken(user: any) : any {
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

    async getUserByEmail(email: string, password: string) : Promise<any> {
      const request = await fetch(`${routes.userInfoByEmail}?email=${email}`)
      return request.json()
    }

    async getUser(id: number) : Promise<any>{
      const request = await fetch(`${routes.users + id}`)
      return request.json()
    }

    async updateToken(refreshToken: string) : Promise<any> {
      const request = await fetch(routes.users, {
        method: 'PATCH',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
          // Authorization: token,
        },
      })
      return request.json()
    }
}
