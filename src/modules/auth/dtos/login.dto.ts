import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

/**
 * Dto para el Objeto Login de Flowchem
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

export class DLoginDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  Username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  Password: string;
}
