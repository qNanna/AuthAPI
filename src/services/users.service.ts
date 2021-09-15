import { Injectable } from '@nestjs/common';
import fetch from 'cross-fetch';

import config from 'src/config/index';

const routes = {
    users: `${config.usersApiUrl}/api/v1/users/`,
    userInfoByEmail: `${config.usersApiUrl}/api/v1/users/email`,
  };

@Injectable()
export class UsersService {
    async getUserByEmail(email: string) : Promise<any> {
        const request = await fetch(`${routes.userInfoByEmail}?email=${email}`);
        return request.json();
    }

    async getUser(id: number) : Promise<any> {
        const request = await fetch(`${routes.users + id}`);
        return request.json();
    }
}
