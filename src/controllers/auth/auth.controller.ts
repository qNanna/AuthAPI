import { Controller, Post, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import config from 'config/index';
import { Utils as utils } from 'utils/index';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/users.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}
    @Post('/signIn')
    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
      try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).json('All input is required');
            return;
        }
        
        const encryptedPass: string = utils.encryptData(password, config.cryptoSecretKey);
        const user = await this.usersService.getUserByEmail(email.toLowerCase());
        if (!user?.id || user?.password !== encryptedPass) {
          res.status(400).json('User not found');
          return;
        }
        
        const { token } = this.authService.auth(user);
        const refreshToken = this.authService.createRefreshToken(user);

        const result = await this.authService.updateToken(refreshToken, user.id);
        if (!result) {
          await this.authService.insertToken({ user_id: user.id, token: refreshToken });
        }
        
        res.send({ acessToken: token, refreshToken });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      } 
    }

    @Post('/refreshToken')
    async refreshToken(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
      try {
        const { refreshToken } = req.body
        if (!refreshToken) {
          res.status(400).json('A token is required');
          return;
        }

        const { id, error} = utils.jwtVerify(refreshToken, config.jwtTokenKey)
        if (!id || error) {
          res.status(403).json(`Refresh token was expired. Please make a new signin request`);
          return;
        }

        const user = await this.usersService.getUser(id);
        const { token } = await this.authService.findToken(id, 'userId');

        if (!user || token !== refreshToken) { 
          res.status(403).json('Refresh token is not in database!');
          return;
        }
        
        const result = this.authService.auth(user);
        res.status(200).json({
          accessToken: result.token,
          refreshToken: refreshToken,
        });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      }
    }
}
