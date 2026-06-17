import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'MonPseudo' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  pseudo: string

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  acceptMarketing?: boolean
}
