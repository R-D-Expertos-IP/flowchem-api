import { Injectable, Logger } from '@nestjs/common';
import { RWalletRepository } from '../repositories/wallets.repo';
import { SExcelService } from './excels.sercice';

/**
 * Servicio de Cartera del sistema de FlowChemical
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class SWalletsService {
  private readonly log: Logger;

  constructor(
    private readonly walletsRepository: RWalletRepository,
    private readonly excelSercice: SExcelService,
  ) {
    this.log = new Logger(SWalletsService.name);
  }

  /**
   * @method: Método para obtener las facturas de los clientes por código de tarjeta.
   * @param CardCode: El código de la tarjeta del cliente.
   * @returns walletsRepository.getFacturaClientesDRepo(CardCode)
   */
  async getInvoiceClientsDetailRequestService(CardCode: string, RoleUser: string) {
    try {
      this.log.log(
        `Obteniendo factura de clientes con el código ${CardCode} con el rol ${RoleUser}...`,
      );
      const factura =
        await this.walletsRepository.getFacturaClientesDRepo(CardCode, RoleUser);
      this.log.log(
        `Se obtuvo la factura de clientes con el código ${CardCode}.`,
      );
      return factura;
    } catch (error) {
      this.log.error(
        `Error al obtener la factura de clientes con el código ${CardCode}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener las facturas de los clientes por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns walletsRepository.getFacturaClientesFRepo(DocEntry)
   */
  async getInvoiceClientsInformationRequestService(DocEntry: string) {
    try {
      this.log.log(
        `Obteniendo factura de clientes con el DocEntry ${DocEntry}...`,
      );
      const bill =
        await this.walletsRepository.getFacturaClientesFRepo(DocEntry);
      this.log.log(
        `Se obtuvo la factura de clientes con el DocEntry ${DocEntry}.`,
      );
      return bill;
    } catch (error) {
      this.log.error(
        `Error al obtener la factura de clientes con el DocEntry ${DocEntry}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener las carteras abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns walletsRepository.getOpenWalletsFilterRequestRepo(startDate, finalDate, cardCode)
   */
  async getOpenWalletsFilterRequestService(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Obteniendo facturas abiertos entre ${startDate} y ${finalDate} con el ${cardCode}...`,
      );
      const orders =
        await this.walletsRepository.getOpenWalletsFilterRequestRepo(
          startDate,
          finalDate,
          cardCode,
        );
      this.log.log(
        `Se obtuvo un total de ${orders.length} facturas abiertos entre ${startDate} y ${finalDate} con el ${cardCode}.`,
      );
      return orders;
    } catch (error) {
      this.log.error(
        `Error al obtener facturas abiertos entre ${startDate} y ${finalDate} con el ${cardCode}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener un archivo Excel con información de las carteras.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns Un archivo Excel con la información de las carteras.
   */
  async getWalletsExcelService(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Obteniendo facturas entre ${startDate} y ${finalDate} con el código ${cardCode}...`,
      );
      const orders = await this.walletsRepository.getWalletsExcelRepo(
        startDate,
        finalDate,
        cardCode,
      );
      this.log.log(`Se obtuvo un total de ${orders.length} facturas.`);
      this.log.log('Creando archivo Excel...');
      const buffer = this.excelSercice.createExcel(orders);
      this.log.log('Archivo Excel creado con éxito.');
      return buffer;
    } catch (error) {
      this.log.error(
        `Error al obtener facturas o crear archivo Excel: ${error.message}`,
      );
      throw error;
    }
  }
}
