import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Dto para crear el Objeto de Usuario de Flowchem
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

export class DCreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  CardName: string;

  @Transform(({ value }) => value.trim())
  @IsEmail()
  E_Mail: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  @MaxLength(11)
  CardCode: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  Password: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  Role: string;
}
