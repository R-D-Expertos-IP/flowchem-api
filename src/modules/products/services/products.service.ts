import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RProductRepository } from '../repositories/products.repo';
import { DCreateProductDto } from '../dtos/create-product.dto';
import { IProduct } from '../interfaces/product.interface';
import { DUpdateProductDto } from '../dtos/update-product.dto';

/**
 * Servicio de Ordenes de Productos del sistema de FlowChemical
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class SProductsService {
  private readonly log: Logger;

  constructor(private readonly productsRepository: RProductRepository) {
    this.log = new Logger(SProductsService.name);
  }

  /**
   * @method: Método para obtener todas las órdenes abiertas por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsRepository.getOpenOrdersRequestRepo(cardCode)
   */
  async getAllOrdersRequestService(cardCode: string) {
    try {
      this.log.log('Obteniendo todos los pedidos totales...');
      const pedidos =
        await this.productsRepository.getAllOrdersRequestRepo(cardCode);
      this.log.log(`Se obtuvo un total de ${pedidos.length} pedidos totales.`);
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener todos los pedidos totales: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener todas las órdenes existentes por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsRepository.getOpenOrdersRequestRepo(cardCode)
   */
  async getOpenOrdersRequestService(cardCode: string) {
    try {
      this.log.log('Obteniendo todos los pedidos abiertos...');
      const pedidos =
        await this.productsRepository.getOpenOrdersRequestRepo(cardCode);
      this.log.log(`Se obtuvo un total de ${pedidos.length} pedidos abiertos.`);
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener todos los pedidos abiertos: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener los detalles de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns productsRepository.getOpenOrdersDetailsRequestRepo(DocEntry)
   */
  async getOpenOrdersDetailsRequestService(DocEntry: number) {
    try {
      this.log.log(`Obteniendo pedidos abiertos con DocEntry ${DocEntry}...`);
      const pedidos =
        await this.productsRepository.getOpenOrdersDetailsRequestRepo(DocEntry);
      this.log.log(
        `Se obtuvo un total de ${pedidos.length} pedidos abiertos con DocEntry ${DocEntry}.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener pedidos abiertos con DocEntry ${DocEntry}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener la información del IVA y otros campos de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns productsRepository.getOpenOrdersDetailsRequestRepo(DocEntry)
   */
  async getOpenOrdersConsultRequestService(DocEntry: number) {
    try {
      this.log.log(`Obteniendo pedidos abiertos con DocEntry ${DocEntry}...`);
      const pedidos =
        await this.productsRepository.getOpenOrdersConsultRequestRepo(DocEntry);
      this.log.log(
        `Se obtuvo un total de ${pedidos.length} pedidos abiertos con DocEntry ${DocEntry} para la consulta general.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener pedidos abiertos con DocEntry ${DocEntry}: ${error.message} para la consulta general`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener las órdenes existentes filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsRepository.getOpenOrdersFilterRequestRepo(startDate, finalDate, cardCode)
   */
  async getAllOrdersFilterRequestService(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Obteniendo pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}...`,
      );
      const pedidos =
        await this.productsRepository.getAllOrdersFilterRequestRepo(
          startDate,
          finalDate,
          cardCode,
        );
      this.log.log(
        `Se obtuvo un total de ${pedidos.length} pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener las órdenes abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsRepository.getOpenOrdersFilterRequestRepo(startDate, finalDate, cardCode)
   */
  async getOpenOrdersFilterRequestService(
    startDate: string,
    finalDate: string,
    cardCode: string,
  ) {
    try {
      this.log.log(
        `Obteniendo pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}...`,
      );
      const pedidos =
        await this.productsRepository.getOpenOrdersFilterRequestRepo(
          startDate,
          finalDate,
          cardCode,
        );
      this.log.log(
        `Se obtuvo un total de ${pedidos.length} pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}.`,
      );
      return pedidos;
    } catch (error) {
      this.log.error(
        `Error al obtener pedidos abiertos entre ${startDate} y ${finalDate} con el ${cardCode}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * @method: Método para obtener el estado de la orden por código de tarjeta y docEntry.
   * @param cardCode: El código de la tarjeta del cliente.
   * @param docEntry: El número de entrada del documento.
   * @returns productsRepository.getOrderStatusRequestRepo(cardCode, docEntry)
   */
  async getOrderStatusRequestService(cardCode: string, docEntry: number) {
    try {
      this.log.log(
        `Obteniendo el estado del pedido con cardCode= ${cardCode} y docEntry= ${docEntry}...`,
      );
      const orderStatus =
        await this.productsRepository.getOrderStatusRequestRepo(
          cardCode,
          docEntry,
        );
      this.log.log(`Se obtuvo el estado del pedido con éxito.`);
      return orderStatus;
    } catch (error) {
      this.log.error(`Error al obtener el estado del pedido: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para obtener todos los productos.
   * @returns productsRepository.getAllProductsRequestRepo()
   */
  async getAllNewProductsRequestService() {
    try {
      this.log.log(`Obteniendo todos los productos...`);
      const productsAll =
        await this.productsRepository.getAllNewProductsRequestRepo();
      this.log.log(`Se obtuvieron todos los productos con éxito.`);
      return productsAll;
    } catch (error) {
      this.log.error(`Error al obtener todos los productos: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para acceder al repo y crear un producto.
   * @returns prodCertificatesRepository.createProductRequestRepo(product)
   */
  async createProductRequestService(
    product: DCreateProductDto,
  ): Promise<IProduct> {
    try {
      this.log.log(`Creando nuevo producto con su certificado...`);
      const newProduct =
        await this.productsRepository.createProductRequestRepo(product);
      this.log.log(
        `¡Se creo exitosamente el nuevo producto con su certificado!`,
      );
      return newProduct;
    } catch (error) {
      this.log.error(
        `Error al crear el producto con su certificado: ${error.message}`,
      );
      throw new HttpException(
        'Internal server errror',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @method: Método para acceder al repo y actualizar un producto.
   * @returns prodCertificatesRepository.createProductRequestRepo(product)
   */
  async updateProductRequestService(
    product: DUpdateProductDto,
  ): Promise<IProduct> {
    try {
      this.log.log(`Actualizando producto...`);
      const updatedProduct =
        await this.productsRepository.updateProductRequestRepo(product);
      this.log.log(`¡Producto actualizado exitosamente!`);
      return updatedProduct;
    } catch (error) {
      this.log.error(`Error al actualizar el producto: ${error.message}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @method: Método para obtener el seguimiento.
   * @param docEntry: El número de entrada del documento.
   * @returns productsRepository.getProductTrackingRequestRepo()
   */
  async getProductsTrackingRequestService(docEntry: number) {
    try {
      this.log.log(`Obteniendo todo el seguimiento...`);
      const productsAll =
        await this.productsRepository.getProductsTrackingRequestRepo(docEntry);
      this.log.log(`Se obtuvieron todos los segumientos con éxito.`);
      return productsAll;
    } catch (error) {
      this.log.error(
        `Error al obtener todos los seguimientos: ${error.message}`,
      );
      throw error;
    }
  }
}
