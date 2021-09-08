import { Controller, Post, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import config from 'config/index';
import { Utils as utils } from 'utils/index';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
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
        const user = await this.authService.getUserByAuth(email.toLowerCase(), encryptedPass);
        if (!user.id) {
          res.status(400).json(user);
          return;
        }
        const token = this.authService.auth(user);
        const refreshToken = await this.authService.createRefreshToken(user);
        await this.authService.updateUserToken(token.id, 'token', refreshToken);

        res.send({ acessToken: token.token, refreshToken });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      } 
    }
}
