import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * Dto para crear el Objeto de Producto de Flowchem
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

export class DCreateProductDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  Dscription: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  ItemCode: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  Image: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  certificateUrl: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  safetySheetUrl: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  technicalSheetUrl: string;
}
