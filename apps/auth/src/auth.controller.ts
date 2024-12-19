import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@app/core/jwt-config/auth-guards/auth.guard';
import { LoginDto } from '@app/shared/dtos/login.dto';
import { DataResponseDto } from '@app/shared/dtos/data.response.dto';
import { DataListResponseDto } from '@app/shared/dtos/data.list.response';
import { QueryDto } from '@app/shared/dtos/query.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<DataResponseDto> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('queryUserData')
  async queryUserData(@Body() query: QueryDto): Promise<DataListResponseDto> {
    return await this.authService.queryUserData(query);
  }
}
