import { Injectable, Logger } from '@nestjs/common';
import { RProdCertificateRepository } from '../repositories/prod-certificates.repo';

@Injectable()
export class SProdCertificatesService {
  private readonly log: Logger;

  constructor(
    private readonly prodCertificatesRepository: RProdCertificateRepository,
  ) {
    this.log = new Logger(SProdCertificatesService.name);
  }

  /**
   * Método para obtener los items distintos por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns Los items distintos por código de tarjeta.
   */
  async getDistinctItemsByCardCodeRequestService(cardCode: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Obteniendo items distintos para el código ${cardCode}...`);

      // Llamar al repositorio y obtener los items
      const items =
        await this.prodCertificatesRepository.getDistinctItemsByCardCodeRequestRepo(
          cardCode,
        );

      // Registrar el éxito de la operación
      this.log.log(
        `Se obtuvieron los items distintos para el código ${cardCode}.`,
      );

      return items;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al obtener los items distintos para el código ${cardCode}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para extraer los nombres de los archivos PDF en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos PDF.
   */
  async extractPdfs(productCode: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Extrayendo PDFs para el código de producto: ${productCode}`,
      );

      // Llamar al repositorio y obtener los nombres de los archivos PDF
      const pdfFiles =
        await this.prodCertificatesRepository.extractPdfs(productCode);

      // Registrar el éxito de la operación
      this.log.log(`Se encontraron ${pdfFiles.length} archivos PDF`);

      return pdfFiles;
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al extraer PDFs: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para extraer los nombres de los archivos de imagen en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos de imagen.
   */
  async extractImages(productCode: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Extrayendo imágenes para el código de producto: ${productCode}`,
      );

      // Llamar al repositorio y obtener los nombres de los archivos de imagen
      const imageFiles =
        await this.prodCertificatesRepository.extractImages(productCode);

      // Registrar el éxito de la operación
      this.log.log(`Se encontraron ${imageFiles.length} archivos de imagen`);

      return imageFiles;
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al extraer imágenes: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para obtener la ruta de un archivo PDF específico.
   * @param productCode: El código del producto.
   * @param fileName: El nombre del archivo PDF.
   * @returns La ruta del archivo PDF.
   */
  async getFilePath(productCode: string, fileName: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Obteniendo la ruta del archivo PDF: ${fileName} para el código de producto: ${productCode}`,
      );

      // Llamar al repositorio y obtener la ruta del archivo
      const filePath = await this.prodCertificatesRepository.getFilePath(
        productCode,
        fileName,
      );

      // Registrar el éxito de la operación
      this.log.log(`Se obtuvo la ruta del archivo PDF: ${fileName}`);

      return filePath;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al obtener la ruta del archivo PDF: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para obtener todas las carpetas.
   * @returns Todas las carpetas.
   */
  async getFolders() {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Obteniendo todas las carpetas...`);

      // Llamar al repositorio y obtener las carpetas
      const folders =
        await this.prodCertificatesRepository.getMainFolderNames();

      // Registrar el éxito de la operación
      this.log.log(`Se obtuvieron ${Object.keys(folders).length} carpetas`);

      return folders;
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al obtener las carpetas: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para subir un archivo comprimido.
   * @param file: El archivo comprimido a subir.
   * @returns La ruta del archivo subido.
   */
  async uploadCompressedFolder(file: Express.Multer.File): Promise<string> {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Subiendo archivo comprimido: ${file.originalname}`);

      // Llamar al repositorio para manejar la subida del archivo
      const filePath =
        await this.prodCertificatesRepository.uploadCompressedFolder(file);

      // Registrar el éxito de la operación
      this.log.log(`Archivo comprimido subido a: ${filePath}`);

      return filePath;
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al subir archivo comprimido: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para agregar una nueva carpeta de año dentro del subdirectorio especificado.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año para la nueva carpeta.
   * @returns Un mensaje de éxito o error.
   */
  async addNewYear(productCode: string, subfolder: string, year: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Agregando nueva carpeta de año ${year} a ${productCode}/${subfolder}...`,
      );

      // Llamar al repositorio para agregar la nueva carpeta de año
      const result = await this.prodCertificatesRepository.addNewYear(
        productCode,
        subfolder,
        year,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Carpeta de año ${year} agregada exitosamente a ${productCode}/${subfolder}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al agregar la carpeta de año ${year}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para agregar un nuevo archivo a la carpeta especificada.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año dentro del subdirectorio.
   * @param fileName: El nombre del nuevo archivo.
   * @param fileContent: El contenido del nuevo archivo.
   * @returns Un mensaje de éxito o error.
   */
  async addNewItem(
    productCode: string,
    subfolder: string,
    year: string,
    fileName: string,
    fileContent: Buffer,
  ) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Agregando nuevo archivo ${fileName} a ${productCode}/${subfolder}/${year}...`,
      );

      // Llamar al repositorio para agregar el nuevo archivo
      const result = await this.prodCertificatesRepository.addNewItem(
        productCode,
        subfolder,
        year,
        fileName,
        fileContent,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Archivo ${fileName} agregado exitosamente a ${productCode}/${subfolder}/${year}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al agregar el archivo ${fileName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para eliminar un archivo de la carpeta especificada.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año dentro del subdirectorio.
   * @param fileName: El nombre del archivo a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  async deleteItem(
    productCode: string,
    subfolder: string,
    year: string,
    fileName: string,
  ) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Eliminando archivo ${fileName} de ${productCode}/${subfolder}/${year}...`,
      );

      // Llamar al repositorio para eliminar el archivo
      const result = await this.prodCertificatesRepository.deleteItem(
        productCode,
        subfolder,
        year,
        fileName,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Archivo ${fileName} eliminado exitosamente de ${productCode}/${subfolder}/${year}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al eliminar el archivo ${fileName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para eliminar una carpeta de año dentro del subdirectorio especificado.
   * @param productCode: El código del producto.
   * @param subfolder: El subdirectorio dentro de la carpeta del producto.
   * @param year: El año para la carpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  async deleteYear(productCode: string, subfolder: string, year: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Eliminando carpeta de año ${year} de ${productCode}/${subfolder}...`,
      );

      // Llamar al repositorio para eliminar la carpeta de año
      const result = await this.prodCertificatesRepository.deleteYear(
        productCode,
        subfolder,
        year,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Carpeta de año ${year} eliminada exitosamente de ${productCode}/${subfolder}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al eliminar la carpeta de año ${year}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para renombrar una carpeta de año dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la subcarpeta.
   * @param oldYear: El nombre actual de la carpeta de año.
   * @param newYear: El nuevo nombre de la carpeta de año.
   * @returns Un mensaje de éxito o error.
   */
  async renameYear(
    productCode: string,
    subfolderName: string,
    oldYear: string,
    newYear: string,
  ) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Renombrando carpeta de año ${oldYear} a ${newYear} en ${productCode}/${subfolderName}...`,
      );

      // Llamar al repositorio para renombrar la carpeta de año
      const result = await this.prodCertificatesRepository.renameYear(
        productCode,
        subfolderName,
        oldYear,
        newYear,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Carpeta de año ${oldYear} renombrada exitosamente a ${newYear} en ${productCode}/${subfolderName}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al renombrar la carpeta de año ${oldYear}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para agregar una nueva subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la nueva subcarpeta.
   * @returns Un mensaje de éxito o error.
   */
  async addNewSubfolder(productCode: string, subfolderName: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Agregando nueva subcarpeta ${subfolderName} a ${productCode}...`,
      );

      // Llamar al repositorio para agregar la nueva subcarpeta
      const result = await this.prodCertificatesRepository.addNewSubfolder(
        productCode,
        subfolderName,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Subcarpeta ${subfolderName} agregada exitosamente a ${productCode}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al agregar la subcarpeta ${subfolderName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para eliminar una subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param subfolderName: El nombre de la subcarpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  async deleteSubfolder(productCode: string, subfolderName: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Eliminando subcarpeta ${subfolderName} de ${productCode}...`,
      );

      // Llamar al repositorio para eliminar la subcarpeta
      const result = await this.prodCertificatesRepository.deleteSubfolder(
        productCode,
        subfolderName,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Subcarpeta ${subfolderName} eliminada exitosamente de ${productCode}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al eliminar la subcarpeta ${subfolderName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para renombrar una subcarpeta dentro del directorio del producto especificado.
   * @param productCode: El código del producto.
   * @param oldSubfolderName: El nombre actual de la subcarpeta.
   * @param newSubfolderName: El nuevo nombre de la subcarpeta.
   * @returns Un mensaje de éxito o error.
   */
  async renameSubfolder(
    productCode: string,
    oldSubfolderName: string,
    newSubfolderName: string,
  ) {
    try {
      // Registrar el inicio de la operación
      this.log.log(
        `Renombrando subcarpeta ${oldSubfolderName} a ${newSubfolderName} en ${productCode}...`,
      );

      // Llamar al repositorio para renombrar la subcarpeta
      const result = await this.prodCertificatesRepository.renameSubfolder(
        productCode,
        oldSubfolderName,
        newSubfolderName,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Subcarpeta ${oldSubfolderName} renombrada exitosamente a ${newSubfolderName} en ${productCode}`,
      );

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al renombrar la subcarpeta ${oldSubfolderName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para agregar una nueva carpeta principal.
   * @param folderName: El nombre de la nueva carpeta principal.
   * @returns Un mensaje de éxito o error.
   */
  async addNewFolder(folderName: string, file: Express.Multer.File) {
    try {
      this.log.log(`Agregando nueva carpeta principal ${folderName}...`);

      const result = await this.prodCertificatesRepository.addNewFolder(
        folderName,
        file,
      );

      this.log.log(`Carpeta principal ${folderName} agregada exitosamente`);

      return result;
    } catch (error) {
      this.log.error(
        `Error al agregar la carpeta principal ${folderName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Método para eliminar una carpeta dentro del directorio especificado.
   * @param folderName: El nombre de la carpeta a eliminar.
   * @returns Un mensaje de éxito o error.
   */
  async deleteFolder(folderName: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Eliminando carpeta ${folderName}...`);

      // Llamar al repositorio para eliminar la carpeta
      const result =
        await this.prodCertificatesRepository.deleteFolder(folderName);

      // Registrar el éxito de la operación
      this.log.log(`Carpeta ${folderName} eliminada exitosamente`);

      return result;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al eliminar la carpeta ${folderName}: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para renombrar una carpeta dentro del directorio especificado.
   * @param oldFolderName: El nombre actual de la carpeta.
   * @param newFolderName: El nuevo nombre de la carpeta.
   * @returns Un mensaje de éxito o error.
   */
  async renameFolder(
    oldFolderName: string,
    newFolderName: string,
    image?: Express.Multer.File,
  ) {
    try {
      this.log.log(
        `Renombrando carpeta ${oldFolderName} a ${newFolderName}...`,
      );

      const result = await this.prodCertificatesRepository.renameFolder(
        oldFolderName,
        newFolderName,
        image,
      );

      this.log.log(
        `Carpeta ${oldFolderName} renombrada exitosamente a ${newFolderName}`,
      );

      return result;
    } catch (error) {
      this.log.error(
        `Error al renombrar la carpeta ${oldFolderName}: ${error.message}`,
      );
      throw error;
    }
  }
}
