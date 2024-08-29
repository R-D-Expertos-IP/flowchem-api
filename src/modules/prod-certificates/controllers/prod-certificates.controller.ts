import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SProdCertificatesService } from '../services/prod-certificates.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('prod-certificates')
export class CProdCertificatesController {
  constructor(
    private readonly prodCertificatesService: SProdCertificatesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Método GET para obtener los elementos distintos por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns Los elementos distintos por código de tarjeta.
   */
  @Get('distinctItems')
  async getDistinctItemsByCardCodeRequest(@Query('cardCode') cardCode: string) {
    try {
      // Registrar el inicio de la operación
      console.log(
        `Obteniendo elementos distintos para el código de tarjeta: ${cardCode}`,
      );

      // Llamar al servicio y obtener los resultados
      const result =
        await this.prodCertificatesService.getDistinctItemsByCardCodeRequestService(
          cardCode,
        );

      // Registrar el éxito de la operación
      console.log(`Se obtuvieron ${result.length} elementos distintos`);

      return result;
    } catch (error) {
      // Registrar el error
      console.error(`Error al obtener elementos distintos: ${error.message}`);

      // Lanzar una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método GET para extraer los nombres de los archivos de imagen en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos de imagen.
   */
  @Get('extract-images/:productCode')
  async extractImages(@Param('productCode') productCode: string) {
    try {
      const decodedProductCode = decodeURIComponent(productCode);
      console.log(
        `Extrayendo imágenes para el código de producto: ${decodedProductCode}`,
      );

      const imageFiles =
        await this.prodCertificatesService.extractImages(decodedProductCode);

      console.log(`Se encontraron carpetas y archivos de imagen`);

      // Obtener la URL base desde las variables de entorno
      const baseUrl = this.configService.get<string>('BASE_URL');

      // Convertir rutas de archivo a URLs
      const imageUrls = imageFiles.map(
        (file) => `${baseUrl}/${file.replace(/\\/g, '/')}`,
      );

      return imageUrls;
    } catch (error) {
      console.error(`Error al extraer imágenes: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método GET para extraer los nombres de los archivos PDF en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos PDF.
   */
  @Get('extract-pdfs/:productCode')
  async extractPdfs(@Param('productCode') productCode: string) {
    try {
      // No decodificar el parámetro productCode
      console.log(`Extrayendo PDFs para el código de producto: ${productCode}`);

      // Llamar al servicio y obtener los nombres de los archivos PDF
      const pdfFiles =
        await this.prodCertificatesService.extractPdfs(productCode);

      // Registrar el éxito de la operación
      console.log(`Se encontraron carpetas y archivos PDF`);

      return pdfFiles;
    } catch (error) {
      // Registrar el error
      console.error(`Error al extraer PDFs: ${error.message}`);

      // Lanzar una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método GET para descargar un archivo PDF específico.
   * @param productCode: El código del producto.
   * @param fileName: El nombre del archivo PDF.
   * @returns El archivo PDF como una descarga.
   */
  @Post('download-pdf')
  async downloadPdf(
    @Body() body: { productCode: string; fileName: string },
    @Res() res: Response,
  ) {
    try {
      const { productCode, fileName } = body;
      console.log(
        `Descargando PDF: ${fileName} para el código de producto: ${productCode}`,
      );

      const filePath = await this.prodCertificatesService.getFilePath(
        productCode,
        fileName,
      );

      res.download(filePath);

      console.log(`Archivo PDF descargado: ${fileName}`);
    } catch (error) {
      console.error(`Error al descargar PDF: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método GET para obtener todas las carpetas.
   * @returns Todas las carpetas.
   */
  @Get('folders')
  async getFolders() {
    try {
      // Registrar el inicio de la operación
      console.log(`Obteniendo todas las carpetas`);

      // Llamar al servicio y obtener las carpetas
      const folders = await this.prodCertificatesService.getFolders();

      // Registrar el éxito de la operación
      console.log(`Se obtuvieron ${Object.keys(folders).length} carpetas`);

      return folders;
    } catch (error) {
      // Registrar el error
      console.error(`Error al obtener las carpetas: ${error.message}`);

      // Lanzar una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método POST para subir un archivo comprimido.
   * @param file: El archivo comprimido a subir.
   * @returns La ruta del archivo subido.
   */
  @Post('upload-compressed-folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompressedFolder(@UploadedFile() file: Express.Multer.File) {
    try {
      // Registrar el inicio de la operación
      console.log(`Subiendo archivo comprimido: ${file.originalname}`);

      // Llamar al servicio para manejar la subida del archivo
      const filePath =
        await this.prodCertificatesService.uploadCompressedFolder(file);

      // Registrar el éxito de la operación
      console.log(`Archivo comprimido subido a: ${filePath}`);

      return { filePath };
    } catch (error) {
      // Registrar el error
      console.error(`Error al subir archivo comprimido: ${error.message}`);

      // Lanzar una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método POST para agregar una nueva carpeta de año dentro del subdirectorio especificado.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año para la nueva carpeta.
   * @returns Un mensaje de éxito o error.
   */
  @Post('add-year')
  async addNewYear(
    @Body() body: { productCode: string; subfolder: string; year: string },
  ) {
    try {
      const { productCode, subfolder, year } = body;
      console.log(
        `Agregando nueva carpeta de año ${year} a ${productCode}/${subfolder}...`,
      );

      const result = await this.prodCertificatesService.addNewYear(
        productCode,
        subfolder,
        year,
      );

      console.log(
        `Carpeta de año ${year} agregada exitosamente a ${productCode}/${subfolder}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al agregar la carpeta de año: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método POST para agregar un nuevo archivo a la carpeta especificada.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año dentro del subdirectorio.
   * @param fileName: El nombre del nuevo archivo.
   * @param fileContent: El contenido del nuevo archivo.
   * @returns Un mensaje de éxito o error.
   */
  @Post('add-item')
  @UseInterceptors(FileInterceptor('file'))
  async addNewItem(
    @Body()
    body: {
      productCode: string;
      subfolder: string;
      year: string;
      fileName: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const { productCode, subfolder, year, fileName } = body;
      console.log(
        `Agregando nuevo archivo ${fileName} a ${productCode}/${subfolder}/${year}...`,
      );

      const result = await this.prodCertificatesService.addNewItem(
        productCode,
        subfolder,
        year,
        fileName,
        file.buffer,
      );

      console.log(
        `Archivo ${fileName} agregado exitosamente a ${productCode}/${subfolder}/${year}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al agregar el archivo: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método DELETE para eliminar un archivo de la carpeta especificada.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año dentro del subdirectorio.
   * @param fileName: El nombre del archivo a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  @Delete('delete-item')
  async deleteItem(
    @Body()
    body: {
      productCode: string;
      subfolder: string;
      year: string;
      fileName: string;
    },
  ) {
    try {
      const { productCode, subfolder, year, fileName } = body;
      const decodedFileName = decodeURIComponent(fileName);
      console.log(
        `Eliminando archivo ${decodedFileName} de ${productCode}/${subfolder}/${year}...`,
      );

      const result = await this.prodCertificatesService.deleteItem(
        productCode,
        subfolder,
        year,
        decodedFileName,
      );

      console.log(
        `Archivo ${decodedFileName} eliminado exitosamente de ${productCode}/${subfolder}/${year}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al eliminar el archivo: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método DELETE para eliminar una carpeta de año dentro del subdirectorio especificado.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año para la carpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  @Delete('delete-year/:productCode/:subfolder/:year')
  async deleteYear(
    @Param('productCode') productCode: string,
    @Param('subfolder') subfolder: string,
    @Param('year') year: string,
  ) {
    try {
      // Registrar el inicio de la operación
      console.log(
        `Eliminando carpeta de año ${year} de ${productCode}/${subfolder}...`,
      );

      // Llamar al servicio para eliminar la carpeta de año
      const result = await this.prodCertificatesService.deleteYear(
        productCode,
        subfolder,
        year,
      );

      // Registrar el éxito de la operación
      console.log(
        `Carpeta de año ${year} eliminada exitosamente de ${productCode}/${subfolder}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      console.error(
        `Error al eliminar la carpeta de año ${year}: ${error.message}`,
      );

      // Lanzar una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método PUT para renombrar una carpeta de año dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la subcarpeta.
   * @param oldYear: El nombre actual de la carpeta de año.
   * @param newYear: El nuevo nombre de la carpeta de año.
   * @returns Un mensaje de éxito o error.
   */
  @Put('rename-year')
  async renameYear(
    @Body()
    body: {
      productCode: string;
      subfolderName: string;
      oldYear: string;
      newYear: string;
    },
  ) {
    try {
      const { productCode, subfolderName, oldYear, newYear } = body;

      if (!productCode || !subfolderName || !oldYear || !newYear) {
        throw new HttpException(
          'Missing required parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(
        `Renombrando carpeta de año ${oldYear} a ${newYear} en ${productCode}/${subfolderName}...`,
      );

      const result = await this.prodCertificatesService.renameYear(
        productCode,
        subfolderName,
        oldYear,
        newYear,
      );

      console.log(
        `Carpeta de año ${oldYear} renombrada exitosamente a ${newYear} en ${productCode}/${subfolderName}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al renombrar la carpeta de año: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método POST para agregar una nueva subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la nueva subcarpeta.
   * @returns Un mensaje de éxito o error.
   */
  @Post('add-subfolder')
  async addNewSubfolder(
    @Body() body: { productCode: string; subfolderName: string },
  ) {
    try {
      const { productCode, subfolderName } = body;
      console.log(
        `Agregando nueva subcarpeta ${subfolderName} a ${productCode}...`,
      );

      const result = await this.prodCertificatesService.addNewSubfolder(
        productCode,
        subfolderName,
      );

      console.log(
        `Subcarpeta ${subfolderName} agregada exitosamente a ${productCode}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al agregar la subcarpeta: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método DELETE para eliminar una subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la subcarpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  @Delete('delete-subfolder')
  async deleteSubfolder(
    @Body() body: { folderName: string; subfolderName: string },
  ) {
    try {
      const { folderName, subfolderName } = body;
      console.log(`Eliminando subcarpeta ${subfolderName} de ${folderName}...`);

      const result = await this.prodCertificatesService.deleteSubfolder(
        folderName,
        subfolderName,
      );

      console.log(
        `Subcarpeta ${subfolderName} eliminada exitosamente de ${folderName}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al eliminar la subcarpeta: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método PUT para renombrar una subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param oldSubfolderName: El nombre actual de la subcarpeta.
   * @param newSubfolderName: El nuevo nombre de la subcarpeta.
   * @returns Un mensaje de éxito o error.
   */
  @Put('rename-subfolder')
  async renameSubfolder(
    @Body()
    body: {
      folderName: string;
      oldSubfolderName: string;
      newSubfolderName: string;
    },
  ) {
    try {
      const { folderName, oldSubfolderName, newSubfolderName } = body;
      console.log(
        `Renombrando subcarpeta ${oldSubfolderName} a ${newSubfolderName} en ${folderName}...`,
      );

      const result = await this.prodCertificatesService.renameSubfolder(
        folderName,
        oldSubfolderName,
        newSubfolderName,
      );

      console.log(
        `Subcarpeta ${oldSubfolderName} renombrada exitosamente a ${newSubfolderName} en ${folderName}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al renombrar la subcarpeta: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método POST para agregar una nueva carpeta principal.
   * @param folderName: El nombre de la nueva carpeta principal.
   * @returns Un mensaje de éxito o error.
   */
  @Post('create-folder')
  @UseInterceptors(FileInterceptor('file'))
  async addNewFolder(
    @Body('folderName') folderName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const decodedFolderName = decodeURIComponent(folderName);
      console.log(`Agregando nueva carpeta principal ${decodedFolderName}...`);

      const result = await this.prodCertificatesService.addNewFolder(
        decodedFolderName,
        file,
      );

      console.log(
        `Carpeta principal ${decodedFolderName} agregada exitosamente`,
      );

      return result;
    } catch (error) {
      console.error(
        `Error al agregar la carpeta principal ${folderName}: ${error.message}`,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método DELETE para eliminar una carpeta dentro del directorio especificado.
   * @param folderName: El nombre de la carpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  @Delete('delete-folder')
  async deleteFolder(@Body() body: { folderName: string }) {
    try {
      const { folderName } = body;
      console.log(`Eliminando carpeta ${folderName}...`);

      const result =
        await this.prodCertificatesService.deleteFolder(folderName);

      console.log(`Carpeta ${folderName} eliminada exitosamente`);

      return result;
    } catch (error) {
      console.error(`Error al eliminar la carpeta: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Método PUT para renombrar una carpeta dentro del directorio especificado.
   * @param oldFolderName: El nombre actual de la carpeta.
   * @param newFolderName: El nuevo nombre de la carpeta.
   * @returns Un mensaje de éxito o error.
   */
  @Put('rename-folder')
  @UseInterceptors(FileInterceptor('image'))
  async renameFolder(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { oldFolderName: string; newFolderName: string },
  ) {
    try {
      const { oldFolderName, newFolderName } = body;

      if (!oldFolderName || !newFolderName) {
        throw new HttpException(
          'Missing required parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`Renombrando carpeta ${oldFolderName} a ${newFolderName}...`);

      const result = await this.prodCertificatesService.renameFolder(
        oldFolderName,
        newFolderName,
        image,
      );

      console.log(
        `Carpeta ${oldFolderName} renombrada exitosamente a ${newFolderName}`,
      );

      return result;
    } catch (error) {
      console.error(`Error al renombrar la carpeta: ${error.message}`);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
