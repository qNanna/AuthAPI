import { Controller, Post, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import config from 'config/index';
import { Utils as utils } from 'utils/index';
import { AuthService } from 'src/services/auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}
    @Post('/signIn')
    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
      try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).json('All input is required');
            return;
        }
        
        const encryptedPass = utils.encryptData(password, config.cryptoSecretKey);
        const user = await this.authService.getUserByCredentials(email.toLowerCase(), encryptedPass);
        if (!user.id) {
          res.status(400).json(user);
          return;
        }
        const { token } = this.authService.auth(user);
        const refreshToken = await this.authService.createRefreshToken(user);
        await this.authService.updateToken(refreshToken);

        res.send({ acessToken: token, refreshToken });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      } 
    }

    @Post('/refreshToken')
    async refreshToken(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
      try {
        if (!req.body.refreshToken) {
          res.status(400).json('A token is required');
          return;
        }

        const decoded = utils.jwtVerify(req.body.refreshToken, config.jwtTokenKey)
        if (!decoded.id || decoded.error) {
          res.status(403).json(`Refresh token was expired. Please make a new signin request`);
          return;
        }

        const { user } = await this.authService.getUser(decoded.id);
        if (!user || req.body.refreshToken !== user.token) { 
          res.status(403).json('Refresh token is not in database!');
          return;
        }
        
        const result = this.authService.auth(user);
        res.status(200).json({
          accessToken: result.token,
          refreshToken: user.token || req.body.refreshToken,
        });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      }
    }
}
