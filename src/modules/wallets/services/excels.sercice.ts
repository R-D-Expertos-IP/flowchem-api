import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

/**
 * Servicio de Excel del sistema de FlowChemical
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class SExcelService {
  /**
   * @method: Método para crear un archivo Excel con información de las órdenes.
   * @param orders: Un array de objetos que representan las órdenes.
   * @returns Un Buffer que representa el archivo Excel.
   */
  async createExcel(orders: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos');

    worksheet.columns = [
      { header: 'Número de Factura', key: 'docEntry', width: 10 },
      { header: 'Documento Interno', key: 'docNum', width: 10 },
      { header: 'Fecha contabilización', key: 'docDate', width: 15 },
      { header: 'Código del Cliente', key: 'cardCode', width: 20 },
      { header: 'Nombre del Cliente', key: 'cardName', width: 30 },
      { header: 'Subtotal', key: 'subTotal', width: 15 },
      { header: 'Impuestos', key: 'impuestos', width: 15 },
      { header: 'Gastos Adicionales', key: 'gastosAdicionales', width: 20 },
      { header: 'Retenciones', key: 'retenciones', width: 15 },
      { header: 'Total', key: 'docTotal', width: 15 },
      { header: 'Abono', key: 'abono', width: 15 },
      { header: 'Saldo', key: 'saldo', width: 15 },
      { header: 'Estado', key: 'status', width: 10 },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        docEntry: order.DocEntry,
        docNum: order.DocNum,
        docDate: order.DocDate,
        cardCode: order.CardCode,
        cardName: order.CardName,
        subTotal: order.SubTotal,
        impuestos: order.Impuestos,
        gastosAdicionales: order.GastosAdicionales,
        retenciones: order.Retenciones,
        docTotal: order.DocTotal,
        abono: order.Abono,
        saldo: order.DocTotal - order.Abono,
        status: order.Status,
      });
    });

    return (await workbook.xlsx.writeBuffer()) as any;
  }
}
