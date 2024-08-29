import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

/**
 * Repositorio de Cartera del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class RWalletRepository {
  private readonly log: Logger;

  constructor(
    @InjectEntityManager('secondConnection')
    private secondEntityManager: EntityManager,
  ) {
    this.log = new Logger(RWalletRepository.name);
  }

  /**
   * @method: Método para obtener las facturas de los clientes por código de tarjeta.
   * @param CardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SET NOCOUNT ON; SET ANSI_NULLS ON; SET ANSI_WARNINGS ON; EXEC dbo.CM_SP_FacturaClientesD @CardCode='${CardCode}'`)
   */
  async getFacturaClientesDRepo(CardCode: string) {
    try {
      this.log.log(`Parámetros recibidos: CardCode= ${CardCode}`);
      this.log.log('Ejecutando consulta SQL...');
      const bill = await this.secondEntityManager.query(
        `SET NOCOUNT ON; SET ANSI_NULLS ON; SET ANSI_WARNINGS ON; EXEC dbo.CM_SP_FacturaClientesD @CardCode='${CardCode}'`,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${bill.length} registros.`,
      );
      return bill;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener las facturas de los clientes por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns secondEntityManager.query(`SELECT * FROM CM_FacturaClientesF WHERE DocEntry = '${DocEntry}'`)
   */
  async getFacturaClientesFRepo(DocEntry: string) {
    try {
      this.log.log(`Parámetros recibidos: DocEntry= ${DocEntry}`);
      this.log.log('Ejecutando consulta SQL...');
      const bill = await this.secondEntityManager.query(
        `SELECT * FROM CM_FacturaClientesF WHERE DocEntry = '${DocEntry}'`,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${bill.length} registros.`,
      );
      return bill;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener las carteras abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SELECT * FROM CM_FacturaClientesD WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC`)
   */
  async getOpenWalletsFilterRequestRepo(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Parámetros recibidos: startDate= ${startDate}, finalDate= ${finalDate}, cardCode= ${cardCode}`,
      );
      this.log.log('Ejecutando consulta SQL...');
      const orders = await this.secondEntityManager.query(
        `
        SELECT * FROM CM_FacturaClientesD WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC
        `,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${orders.length} registros.`,
      );
      return orders;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
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
  async getWalletsExcelRepo(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Parámetros recibidos: startDate= ${startDate}, finalDate= ${finalDate}, cardCode= ${cardCode}`,
      );
      this.log.log('Ejecutando consulta SQL...');
      const orders = await this.secondEntityManager.query(
        `SELECT * FROM CM_FacturaClientesD WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC`,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${orders.length} registros.`,
      );
      return orders;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }
}
