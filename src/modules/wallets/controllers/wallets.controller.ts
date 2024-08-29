import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { SWalletsService } from '../services/wallets.service';
import { Response } from 'express';

/**
 * Controlador de Cartera del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Controller('wallets')
export class CWalletsController {
  constructor(private readonly walletsService: SWalletsService) {}

  /**
   * @method: Método GET para obtener las facturas de los clientes por código de tarjeta.
   * @param CardCode: El código de la tarjeta del cliente.
   * @returns walletsService.getFacturaClientesDService(CardCode)
   */
  @Get('clientsDetail')
  async getInvoiceClientsDetailRequest(@Query('CardCode') CardCode: string) {
    try {
      return await this.walletsService.getInvoiceClientsDetailRequestService(
        CardCode,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener las facturas de los clientes por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns walletsService.getFacturaClientesFService(DocEntry)
   */
  @Get('clientsInformation')
  async getInvoiceClientsInformationRequest(
    @Query('DocEntry') DocEntry: string,
  ) {
    try {
      return await this.walletsService.getInvoiceClientsInformationRequestService(
        DocEntry,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener las carteras abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns walletsService.getOpenWalletsFilterRequestService(startDate, finalDate, cardCode)
   */
  @Get('walletsOpenFilter')
  async getOpenWalletsFilterRequest(
    @Query('startDate') startDate: string,
    @Query('finalDate') finalDate: string,
    @Query('cardCode') cardCode: string,
  ) {
    try {
      return await this.walletsService.getOpenWalletsFilterRequestService(
        startDate,
        finalDate,
        cardCode,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para descargar un archivo Excel con información de las carteras.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @param res: Objeto de respuesta de Express.
   * @returns Un archivo Excel con la información de las carteras.
   */
  @Get('downloadExcel')
  async getDownloadExcelRequest(
    @Query('startDate') startDate: string,
    @Query('finalDate') finalDate: string,
    @Query('cardCode') cardCode: string,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.walletsService.getWalletsExcelService(
        startDate,
        finalDate,
        cardCode,
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Reporte_de_productos_por_cliente_' +
          new Date().toISOString() +
          '.xlsx',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
