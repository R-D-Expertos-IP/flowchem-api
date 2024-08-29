import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DCreateProductDto } from '../dtos/create-product.dto';
import { IProduct } from '../interfaces/product.interface';
import { EProduct } from '../entities/product.entity';
import { DUpdateProductDto } from '../dtos/update-product.dto';

/**
 * Repositorio de Ordenes de Productos del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class RProductRepository {
  private readonly log: Logger;

  constructor(
    @InjectRepository(EProduct)
    private readonly dbInstanceAllData: Repository<EProduct>,
    @InjectEntityManager('secondConnection')
    private secondEntityManager: EntityManager,
  ) {
    this.log = new Logger(RProductRepository.name);
  }

  /**
   * @method: Método para obtener todas las órdenes existentes por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpen WHERE CardCode = '${cardCode}' ORDER BY DocNum DESC`)
   */
  async getAllOrdersRequestRepo(cardCode: string) {
    try {
      this.log.log('Ejecutando consulta SQL...');
      const orders = await this.secondEntityManager.query(`
        SELECT * FROM ORDR WHERE CardCode = '${cardCode}' ORDER BY DocNum DESC
      `);
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
   * @method: Método para obtener todas las órdenes abiertas por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpen WHERE CardCode = '${cardCode}' ORDER BY DocNum DESC`)
   */
  async getOpenOrdersRequestRepo(cardCode: string) {
    try {
      this.log.log('Ejecutando consulta SQL...');
      const orders = await this.secondEntityManager.query(`
      SELECT * FROM CM_PedidosClientesOpen WHERE CardCode = '${cardCode}' ORDER BY DocNum DESC
      `);
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
   * @method: Método para obtener los detalles de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpenD WHERE DocEntry = @0 ORDER BY DocNum DESC`, [DocEntry])
   */
  async getOpenOrdersDetailsRequestRepo(DocEntry: number) {
    try {
      this.log.log(`Ejecutando consulta SQL para DocEntry ${DocEntry}...`);
      const pedidos = await this.secondEntityManager.query(
        `
        SELECT * FROM CM_PedidosClientesOpenD WHERE DocEntry = @0 ORDER BY DocNum DESC
      `,
        [DocEntry],
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${pedidos.length} registros para DocEntry ${DocEntry}.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al ejecutar la consulta SQL para DocEntry ${DocEntry}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener la información del IVA y otros campos de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpenD WHERE DocEntry = @0 ORDER BY DocNum DESC`, [DocEntry])
   */
  async getOpenOrdersConsultRequestRepo(DocEntry: number) {
    try {
      this.log.log(`Ejecutando consulta SQL para DocEntry ${DocEntry}...`);
      const pedidos = await this.secondEntityManager.query(
        `
          SELECT * FROM CM_PedidosClientesOpen WHERE DocEntry = @0 ORDER BY DocNum DESC
        `,
        [DocEntry],
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${pedidos.length} registros para DocEntry ${DocEntry} para la consulta general.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al ejecutar la consulta SQL para DocEntry ${DocEntry}: ${error.message} para la consulta general`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener las órdenes existentes filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpen WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC`)
   */
  async getAllOrdersFilterRequestRepo(
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
        SELECT * FROM ORDR WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC
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
   * @method: Método para obtener las órdenes abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns secondEntityManager.query(`SELECT * FROM CM_PedidosClientesOpen WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC`)
   */
  async getOpenOrdersFilterRequestRepo(
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
        SELECT * FROM CM_PedidosClientesOpen WHERE DocDate BETWEEN '${startDate}' AND '${finalDate}' AND CardCode = '${cardCode}' ORDER BY DocNum DESC
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
   * @method: Método para obtener el estado adicional de una orden específica.
   * @param docEntry: El número de entrada del documento de la orden.
   * @returns: Retorna el estado del producto en la orden. Los posibles estados son 'Cerrado', 'Despachado', 'Entregado' o '' (cadena vacía).
   * @throws: Lanza un error si ocurre un problema al ejecutar la consulta SQL.
   */

  async getAdditionalOrderStatus(docEntry: number) {
    try {
      this.log.log(`Parámetros recibidos: docEntry= ${docEntry}`);
      this.log.log('Ejecutando consulta SQL...');

      const query = await this.secondEntityManager.query(
        `
        SELECT o.CardCode AS nitEmpresa, o.DocEntry AS numeroFactura, o.InvntSttus AS estadoInventario, o.DocDate AS fechaFactura, o.DocNum, o.DocDate, ss.NoGuia, ss.TransportName,
        CASE 
          WHEN ss.Status IS NOT NULL THEN TRIM(LTRIM(ss.Status)) COLLATE SQL_Latin1_General_CP1_CI_AS 
          ELSE o.DocStatus COLLATE SQL_Latin1_General_CP1_CI_AS 
        END AS estadoFactura
        FROM ORDR as o
        LEFT JOIN INTRANETFLOW.DBO.seguimientos as ss ON ss.DocEntry = o.DocEntry
        WHERE o.DocEntry = ${docEntry}
        `,
      );

      let estadoProducto = query[0].estadoFactura;

      if (query.length > 0) {
        switch (query[0].estadoFactura) {
          case 'O':
            estadoProducto = 'Cerrado';
            break;
          case 'C':
            estadoProducto = 'Cerrado';
            break;
          case 'D':
            estadoProducto = 'Despachado';
            break;
          case 'E':
            estadoProducto = 'Entregado';
            break;
          default:
            estadoProducto = '';
            break;
        }
      }

      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvo el estado adicional del pedido.`,
      );

      return estadoProducto;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener el estado de la orden por código de tarjeta y docEntry.
   * @param cardCode: El código de la tarjeta del cliente.
   * @param docEntry: El número de entrada del documento.
   * @returns secondEntityManager.query(`SELECT CardCode AS nitEmpresa, DocEntry AS numeroFactura, DocStatus AS estadoFactura, InvntSttus AS estadoInventario, DocDate AS fechaFactura FROM ORDR WHERE CardCode = '${cardCode}' AND DocEntry = ${docEntry}`)
   */
  async getOrderStatusRequestRepo(cardCode: string, docEntry: number) {
    try {
      this.log.log(
        `Parámetros recibidos: cardCode= ${cardCode}, docEntry= ${docEntry}`,
      );
      this.log.log('Ejecutando consulta SQL...');
      const orderStatus = await this.secondEntityManager.query(
        `
        SELECT CardCode AS nitEmpresa, DocEntry AS numeroFactura, DocStatus AS estadoFactura, InvntSttus AS estadoInventario, DocDate AS fechaFactura 
        FROM ORDR WHERE CardCode = '${cardCode}' AND DocEntry = ${docEntry}
        `,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvo el estado del pedido.`,
      );

      const additionalOrderStatus =
        await this.getAdditionalOrderStatus(docEntry);

      return orderStatus.map((order) => {
        let estadoProducto = '';
        if (
          order.estadoInventario === 'C' &&
          order.estadoFactura !== 'D' &&
          order.estadoFactura !== 'E'
        ) {
          estadoProducto = 'En proceso';
        }
        return {
          ...order,
          estadoFactura: additionalOrderStatus,
          estadoInventario: this.getInventoryStatus(order.estadoInventario),
          estadoProducto: estadoProducto,
        };
      });
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener el estado de la factura.
   * @param codeItemProduct: El código del estado de la factura.
   * @returns 'Abierto', 'Cerrado' o 'Confirmado' dependiendo del código.
   */
  getInvoiceStatus(codeItemProduct: string): string {
    switch (codeItemProduct) {
      case 'O':
        return 'Abierto';
      case 'C':
        return 'Cerrado';
      default:
        return 'Confirmado';
    }
  }

  /**
   * @method: Método para obtener el estado del inventario.
   * @param codeItemProduct: El código del estado del inventario.
   * @returns 'Abierto', 'Cerrado', 'Despachado', 'Entregado' o 'Confirmado' dependiendo del código.
   */
  getInventoryStatus(codeItemProduct: string): string {
    switch (codeItemProduct) {
      case 'O':
        return 'Abierto';
      case 'C':
        return 'Cerrado';
      case 'D':
        return 'Despachado';
      case 'E':
        return 'Entregado';
      default:
        return 'Confirmado';
    }
  }

  /**
   * @method: Método para obtener todos los productos.
   * @returns dbInstanceAllData.query(`SELECT * FROM productos`)
   */
  async getAllNewProductsRequestRepo() {
    try {
      this.log.log('Ejecutando consulta SQL...');
      const ordersAll = await this.dbInstanceAllData.query(
        `
        SELECT * FROM productos
        `,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron todos los productos.`,
      );
      return ordersAll;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para verificar si ya existe un producto con el mismo ItemCode.
   * @param ItemCode: El ItemCode del producto.
   * @returns boolean
   */
  async codeProductExists(ItemCode: string): Promise<EProduct> {
    try {
      const product = await this.dbInstanceAllData.findOne({
        where: { ItemCode },
      });
      return product;
    } catch (error) {
      this.log.error(`Error al verificar el itemCode: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para acceder a la DB y crear un producto.
   * @returns dbInstance.save(newProduct)
   */
  async createProductRequestRepo(
    product: DCreateProductDto,
  ): Promise<IProduct> {
    try {
      if (await this.codeProductExists(product.ItemCode)) {
        throw new BadRequestException(
          'Ya existe un producto con el mismo código de producto',
        );
      }
      const newProduct = this.dbInstanceAllData.create({
        ...product,
      });
      await this.dbInstanceAllData.save(newProduct);
      return newProduct;
    } catch (error) {
      this.log.error(`Error al crear el producto: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para acceder a la DB y editar un producto.
   * @returns dbInstance.save(newProduct)
   */
  async updateProductRequestRepo(
    product: DUpdateProductDto,
  ): Promise<IProduct> {
    try {
      const existingProduct = await this.codeProductExists(product.ItemCode);
      if (!existingProduct) {
        throw new BadRequestException(
          'No existe un producto con el código de producto proporcionado',
        );
      }
      const updatedProduct = this.dbInstanceAllData.merge(
        existingProduct,
        product,
      );
      await this.dbInstanceAllData.save(updatedProduct);
      return updatedProduct;
    } catch (error) {
      this.log.error(`Error al actualizar el producto: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener todos los seguimientos.
   * @returns dbInstanceAllData.query(`SELECT * FROM seguimientos`)
   */
  async getProductsTrackingRequestRepo(docEntry: number) {
    try {
      this.log.log('Ejecutando consulta SQL...');
      const ordersAll = await this.dbInstanceAllData.query(
        `
            SELECT * FROM seguimientos WHERE DocEntry = ${docEntry}
        `,
      );
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron todos los seguimientos.`,
      );
      return ordersAll;
    } catch (error) {
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);
      throw error;
    }
  }
}
