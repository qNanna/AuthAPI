import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import fetch from 'cross-fetch';

import config from 'config/index';

const routes = {
    users: `${config.usersApiUrl}/api/v1/users`,
    userInfoByCredentials: `${config.usersApiUrl}/api/v1/users/byCredentials`,
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

    async getUserByCredentials(email: string, password: string) : Promise<any> {
      const request = await fetch(routes.userInfoByCredentials, {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
          'Content-Type': 'application/json',
          // Authorization: token,
        },
      })
      return request.json()
    }

    async getUser(id) : Promise<any>{
      const request = await fetch(`${routes.users}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sdadasd',
        },
      })
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
