import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SProductsService } from '../services/products.service';
import { DCreateProductDto } from '../dtos/create-product.dto';
import { IProduct } from '../interfaces/product.interface';
import { DUpdateProductDto } from '../dtos/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

/**
 * Controlador de Ordenes de Productos del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Controller('products')
export class CProductsController {
  constructor(private readonly productsService: SProductsService) {}

  /**
   * @method: Método GET para obtener todas las órdenes existentes por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsService.getOpenOrdersRequestService(cardCode)
   */
  @Get('ordersAll/:cardCode')
  @HttpCode(HttpStatus.OK)
  async getAllOrdersRequest(@Param('cardCode') cardCode: string) {
    try {
      return await this.productsService.getAllOrdersRequestService(cardCode);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener todas las órdenes abiertas por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsService.getOpenOrdersRequestService(cardCode)
   */
  @Get('ordersOpen/:cardCode')
  @HttpCode(HttpStatus.OK)
  async getOpenOrdersRequest(@Param('cardCode') cardCode: string) {
    try {
      return await this.productsService.getOpenOrdersRequestService(cardCode);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener los detalles de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns productsService.getOpenOrdersDetailsRequestService(DocEntry)
   */
  @Get('ordersOpenDetails/:DocEntry')
  @HttpCode(HttpStatus.OK)
  async getOpenOrdersDetailsRequest(@Param('DocEntry') DocEntry: number) {
    try {
      return await this.productsService.getOpenOrdersDetailsRequestService(
        DocEntry,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener la información del IVA y otros campos de las órdenes abiertas por DocEntry.
   * @param DocEntry: El número de entrada del documento.
   * @returns productsService.getOpenOrdersDetailsRequestService(DocEntry)
   */
  @Get('ordersOpenConsult/:DocEntry')
  @HttpCode(HttpStatus.OK)
  async getOpenOrdersConsultRequest(@Param('DocEntry') DocEntry: number) {
    try {
      return await this.productsService.getOpenOrdersConsultRequestService(
        DocEntry,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener el estado de la orden por código de tarjeta y docEntry.
   * @param cardCode: El código de la tarjeta del cliente.
   * @param docEntry: El número de entrada del documento.
   * @returns productsService.getOrderStatusRequestService(cardCode, docEntry)
   */
  @Get('orderStatus')
  @HttpCode(HttpStatus.OK)
  async getOrderStatusRequest(
    @Query('cardCode') cardCode: string,
    @Query('docEntry') docEntry: number,
  ) {
    try {
      return await this.productsService.getOrderStatusRequestService(
        cardCode,
        docEntry,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener las órdenes existentes filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsService.getOpenOrdersFilterRequestService(startDate, finalDate, cardCode)
   */
  @Get('ordersAllFilter')
  @HttpCode(HttpStatus.OK)
  async getAllOrdersFilterRequest(
    @Query('startDate') startDate: string,
    @Query('finalDate') finalDate: string,
    @Query('cardCode') cardCode: string,
  ) {
    try {
      return await this.productsService.getAllOrdersFilterRequestService(
        startDate,
        finalDate,
        cardCode,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener las órdenes abiertas filtradas por fecha de inicio, fecha final y código de tarjeta.
   * @param startDate: La fecha de inicio para el filtro.
   * @param finalDate: La fecha final para el filtro.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns productsService.getOpenOrdersFilterRequestService(startDate, finalDate, cardCode)
   */
  @Get('ordersOpenFilter')
  @HttpCode(HttpStatus.OK)
  async getOpenOrdersFilterRequest(
    @Query('startDate') startDate: string,
    @Query('finalDate') finalDate: string,
    @Query('cardCode') cardCode: string,
  ) {
    try {
      return await this.productsService.getOpenOrdersFilterRequestService(
        startDate,
        finalDate,
        cardCode,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método GET para obtener todas las registros del nuevo producto en la nueva tabla
   * @returns productsService.getAllNewProductsRequestService()
   */
  @Get('ordersAllNew')
  @HttpCode(HttpStatus.OK)
  async getAllNewProductsRequest() {
    try {
      return await this.productsService.getAllNewProductsRequestService();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método post para crear un nuevo producto.
   * @returns prodCertificatesService.createProductRequestService(newProduct)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postCreateProductRequest(
    @Body() newProduct: DCreateProductDto,
  ): Promise<IProduct> {
    try {
      return await this.productsService.createProductRequestService(newProduct);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  /**
   * @method: Método put para editar un producto.
   * @returns prodCertificatesService.createProductRequestService(newProduct)
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  async putUpdateProductRequest(
    @Body() updatedProduct: DUpdateProductDto,
  ): Promise<IProduct> {
    try {
      return await this.productsService.updateProductRequestService(
        updatedProduct,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  /**
   * @method: Método GET para obtener todas las registros del seguimiento de los productos en la nueva tabla.
   * @returns productsService.getAllNewProductsRequestService()
   */
  @Get('ordersAllTrack')
  @HttpCode(HttpStatus.OK)
  async getProductsTrackingRequest(@Query('docEntry') docEntry: number) {
    try {
      return await this.productsService.getProductsTrackingRequestService(
        docEntry,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método POST para subir archivos al servidor.
   * @route: '/imagen'
   * @param files: Los archivos que se van a subir.
   * @param id: El identificador único asociado con los archivos.
   * @returns: Retorna 'true' si los archivos se subieron con éxito.
   * @description: Este método utiliza un interceptor de archivos para manejar la subida de múltiples archivos.
   * Los archivos se almacenan en la carpeta 'public' del servidor y se renombran con su nombre original.
   */
  @Post('imagen')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        //destination: './public', // Carpeta de destino en el servidor local
        destination: path.resolve(__dirname, '..', '..', '..', '..', 'public/'), //produccion
        filename: (req, file, callback) => {
          const newFilename = file.originalname;
          callback(null, newFilename); // Devolver el nuevo nombre del archivo
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files, @Body('id') id: string) {
    console.log('destination:', id);

    console.log('files', files);
    return true;
  }
}
