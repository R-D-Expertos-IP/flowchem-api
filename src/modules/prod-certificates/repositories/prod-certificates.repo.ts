import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import * as fs from 'fs/promises';
import * as path from 'path';
import { join } from 'path';
import * as fsSync from 'fs';
import { Unrar } from 'unrar';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

@Injectable()
export class RProdCertificateRepository {
  private readonly log: Logger;

  constructor(
    @InjectEntityManager('secondConnection')
    private secondEntityManager: EntityManager,
  ) {
    this.log = new Logger(RProdCertificateRepository.name);
  }

  /**
   * Método para obtener los items distintos por código de tarjeta.
   * @param cardCode: El código de la tarjeta del cliente.
   * @returns Los items distintos por código de tarjeta.
   */
  async getDistinctItemsByCardCodeRequestRepo(cardCode: string) {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Parámetros recibidos: cardCode= ${cardCode}`);
      this.log.log('Ejecutando consulta SQL...');

      // Ejecutar la consulta SQL y obtener los items
      const items = await this.secondEntityManager.query(
        `SELECT DISTINCT CAST(ItemCode AS NVARCHAR(MAX)) AS ItemCode, Dscription FROM INV1 WHERE BaseCard = '${cardCode}' AND ItemCode IS NOT NULL 
        AND ItemCode != 'ACTIVOS FIJOS'`,
      );

      // Registrar el éxito de la operación
      this.log.log(
        `Consulta SQL ejecutada con éxito. Se obtuvieron ${items.length} registros.`,
      );

      // Obtener las URLs de Google Drive para cada item
      for (const item of items) {
        item.technicalSheetUrl = await this.getGoogleDriveFileUrl(
          item.ItemCode,
          'Ficha Tecnica',
        );
        item.certificateUrl = await this.getGoogleDriveFileUrl(
          item.ItemCode,
          'Certificado',
        );
        item.safetySheetUrl = await this.getGoogleDriveFileUrl(
          item.ItemCode,
          'Hoja de Seguridad',
        );
      }

      return items;
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al ejecutar la consulta SQL: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para obtener la URL de un archivo en Google Drive.
   * @param itemCode: El código del item.
   * @param fileType: El tipo de archivo.
   * @returns La URL del archivo en Google Drive.
   */
  async getGoogleDriveFileUrl(itemCode: string, fileType: string) {
    // Construir y devolver la URL
    return `https://drive.google.com/drive/folders/1ywE1y35KTc3XzvsTxbKPw8VSVAAEF9w7/${itemCode}/${fileType}`;
  }

  /**
   * Método para extraer los nombres de los archivos PDF en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos PDF.
   */
  async extractPdfs(productCode: string) {
    try {
      // Definir la carpeta principal
      const mainDir = path.join('src/resources/products', productCode);

      // Llamar a la función recursiva para extraer los archivos PDF
      const pdfFiles = await this.getFilesRecursively(mainDir, '.pdf', mainDir);

      return pdfFiles;
    } catch (error) {
      // Registrar el error
      console.error(`Error al extraer PDFs: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para extraer los nombres de los archivos de imagen en la carpeta especificada.
   * @param productCode: El código del producto.
   * @returns Los nombres de los archivos de imagen.
   */
  async extractImages(productCode: string): Promise<string[]> {
    try {
      const mainDir = path.join('src/resources/products', productCode, 'img');
      console.log(`Directorio principal: ${mainDir}`);

      if (!fsSync.existsSync(mainDir)) {
        throw new Error(`La carpeta ${mainDir} no existe.`);
      }

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      let imageFiles: string[] = [];

      for (const extension of imageExtensions) {
        console.log(`Buscando archivos con extensión: ${extension}`);
        const files = await this.getImagesRecursively(
          mainDir,
          extension,
          mainDir,
        );
        imageFiles = imageFiles.concat(files);
      }

      console.log(`Archivos de imagen encontrados: ${imageFiles.length}`);
      return imageFiles.map((file) => path.relative('src/resources', file));
    } catch (error) {
      this.log.error(`Error al extraer imágenes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Método recursivo para obtener las imagenes de los archivos en un directorio y sus subdirectorios.
   * @param directory: El directorio actual.
   * @param extension: La extensión de los archivos a buscar.
   * @param baseDir: La base del directorio.
   * @returns Un objeto con los nombres de los archivos organizados por subcarpeta, año y archivos PDF.
   */
  async getImagesRecursively(
    directory: string,
    extension: string,
    baseDir: string,
  ): Promise<string[]> {
    let result: string[] = [];
    const items = await fs.readdir(directory);

    console.log(`Leyendo directorio: ${directory}`);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      console.log(`Procesando: ${fullPath}`);

      if (item === 'img') {
        continue; 
      }

      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        const subResult = await this.getFilesRecursively(
          fullPath,
          extension,
          baseDir,
        );
        result = result.concat(subResult);
      } else if (path.extname(fullPath) === extension) {
        console.log(`Archivo encontrado: ${fullPath}`);
        result.push(fullPath);
      }
    }

    return result;
  }

  /**
   * Método recursivo para obtener los nombres de los archivos en un directorio y sus subdirectorios.
   * @param directory: El directorio actual.
   * @param extension: La extensión de los archivos a buscar.
   *  @param baseDir: La base del directorio.
   * @returns Un objeto con los nombres de los archivos organizados por subcarpeta, año y archivos PDF.
   */
  async getFilesRecursively(
    directory: string,
    extension: string,
    baseDir: string,
  ): Promise<any> {
    let result: any = {};
    const items = await fs.readdir(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);

      if (item === 'img') {
        continue; // Excluir la carpeta 'img'
      }

      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        const subResult = await this.getFilesRecursively(
          fullPath,
          extension,
          baseDir,
        );
        const relativePath = path.relative(baseDir, fullPath);
        const parts = relativePath.split(path.sep);
        const subfolder = parts[0];
        const year = parts[1];

        if (!result[subfolder]) {
          result[subfolder] = {};
        }
        if (!result[subfolder][year]) {
          result[subfolder][year] = { files: [] };
        }

        for (const subfolder in subResult) {
          if (!result[subfolder]) {
            result[subfolder] = subResult[subfolder];
          } else {
            for (const year in subResult[subfolder]) {
              if (!result[subfolder][year]) {
                result[subfolder][year] = subResult[subfolder][year];
              } else {
                result[subfolder][year].files = result[subfolder][
                  year
                ].files.concat(subResult[subfolder][year].files);
              }
            }
          }
        }
      } else if (path.extname(fullPath) === extension) {
        const relativePath = path.relative(baseDir, fullPath);
        const parts = relativePath.split(path.sep);
        const subfolder = parts[parts.length - 3];
        const year = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];

        if (!result[subfolder]) {
          result[subfolder] = {};
        }
        if (!result[subfolder][year]) {
          result[subfolder][year] = { files: [] };
        }
        result[subfolder][year].files.push(fileName);
      }
    }

    // Incluir carpetas y subcarpetas vacías
    const includeEmptyDirectories = async (dir: string, res: any) => {
      const items = await fs.readdir(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          const relativePath = path.relative(baseDir, fullPath);
          const parts = relativePath.split(path.sep);
          const subfolder = parts[0];
          const year = parts[1];

          if (!res[subfolder]) {
            res[subfolder] = {};
          }
          if (!res[subfolder][year]) {
            res[subfolder][year] = { files: [] };
          }

          await includeEmptyDirectories(fullPath, res);
        }
      }
    };

    await includeEmptyDirectories(directory, result);

    // Eliminar entradas con 'undefined'
    const cleanResult = (res: any) => {
      for (const key in res) {
        if (key === 'undefined') {
          delete res[key];
        } else {
          for (const subkey in res[key]) {
            if (subkey === 'undefined') {
              delete res[key][subkey];
            }
          }
        }
      }
    };

    cleanResult(result);

    return result;
  }

  /**
   * Método para obtener la ruta completa de un archivo PDF específico.
   * @param productCode: El código del producto.
   * @param fileName: El nombre del archivo PDF.
   * @returns La ruta completa al archivo PDF.
   */
  async getFilePath(productCode: string, fileName: string) {
    try {
      // Definir la carpeta principal
      const mainDir = path.join('src/resources/products', productCode);

      // Llamar a la función recursiva para extraer los archivos PDF
      const pdfFiles = await this.getFilesRecursively(mainDir, '.pdf', mainDir);

      // Buscar el archivo en la estructura de carpetas y archivos
      const filePath = this.findFileInStructure(pdfFiles, fileName);

      if (!filePath) {
        throw new Error(`Archivo ${fileName} no encontrado.`);
      }

      // Devolver la ruta completa al archivo
      return path.join(mainDir, filePath);
    } catch (error) {
      // Registrar el error
      console.error(
        `Error al obtener la ruta del archivo PDF: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para buscar un archivo en la estructura de carpetas y archivos.
   * @param structure: La estructura de carpetas y archivos.
   * @param fileName: El nombre del archivo a buscar.
   * @returns La ruta relativa al archivo si se encuentra, de lo contrario null.
   */
  findFileInStructure(structure: any, fileName: string): string | null {
    for (const subfolder in structure) {
      for (const year in structure[subfolder]) {
        if (structure[subfolder][year].files.includes(fileName)) {
          return path.join(subfolder, year, fileName);
        }
      }
    }
    return null;
  }

  /**
   * Método para obtener los nombres de las carpetas principales.
   * @returns Los nombres de las carpetas principales.
   */
  async getMainFolderNames() {
    try {
      // Registrar el inicio de la operación
      this.log.log(`Obteniendo los nombres de las carpetas principales...`);

      // Definir la carpeta principal
      const mainDir = path.join('src/resources/products');

      // Obtener los nombres de las carpetas principales
      const mainFolders = this.getFolders(mainDir);

      // Registrar el éxito de la operación
      this.log.log(
        `Se obtuvieron ${mainFolders.length} nombres de carpetas principales`,
      );

      return mainFolders;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al obtener los nombres de las carpetas principales: ${error.message}`,
      );

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método recursivo para obtener los nombres de las carpetas en un directorio.
   * @param directory: El directorio actual.
   * @returns Un array con los nombres de las carpetas.
   */
  getFolders(directory: string): string[] {
    let result: string[] = [];
    const items = fsSync.readdirSync(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);

      if (fsSync.statSync(fullPath).isDirectory()) {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Método para manejar la subida de un archivo comprimido.
   * @param file: El archivo comprimido a subir.
   * @returns La ruta del archivo subido.
   */
  async uploadCompressedFolder(file: Express.Multer.File): Promise<string> {
    try {
      // Definir la ruta de subida
      const uploadPath = join(__dirname, '..', 'uploads', file.originalname);

      // Crear el directorio de subida si no existe
      await fs.mkdir(join(__dirname, '..', 'uploads'), { recursive: true });

      // Guardar el archivo comprimido
      await fs.writeFile(uploadPath, file.buffer);

      // Descomprimir el archivo
      const extractPath = join(__dirname, '..', 'src', 'resources', 'products');
      await fs.mkdir(extractPath, { recursive: true });

      // Usar unrar para descomprimir el archivo
      const unrar = new Unrar(uploadPath);
      unrar.extract(extractPath, null, (err) => {
        if (err) {
          throw new Error(`Error al extraer el archivo RAR: ${err.message}`);
        }
      });

      // Registrar el éxito de la operación
      this.log.log(
        `Archivo comprimido subido y descomprimido en: ${extractPath}`,
      );

      return extractPath;
    } catch (error) {
      // Registrar el error
      this.log.error(
        `Error al subir y descomprimir archivo comprimido: ${error.message}`,
      );

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
      // Definir la ruta completa de la nueva carpeta de año
      const newYearPath = path.join(
        'src/resources/products',
        productCode,
        subfolder,
        year,
      );

      // Crear la nueva carpeta de año
      if (!fsSync.existsSync(newYearPath)) {
        fsSync.mkdirSync(newYearPath, { recursive: true });
      } else {
        throw new Error('La carpeta del año ya existe');
      }

      // Registrar el éxito
      this.log.debug(
        `Carpeta de año ${year} agregada exitosamente a ${newYearPath}`,
      );

      return { message: 'Carpeta de año agregada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al agregar la carpeta de año: ${error.message}`);

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
      // Definir la ruta completa del nuevo archivo
      const newFilePath = path.join(
        'src/resources/products',
        productCode,
        subfolder,
        year,
        fileName,
      );

      fsSync.writeFileSync(newFilePath, fileContent);

      // Registrar el éxito
      this.log.debug(
        `Archivo ${fileName} agregado exitosamente a ${newFilePath}`,
      );

      return { message: 'Archivo agregado exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al agregar el archivo: ${error.message}`);

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
      // Definir la ruta completa del archivo a eliminar
      const filePath = path.join(
        'src/resources/products',
        productCode,
        subfolder,
        year,
        fileName,
      );

      // Verificar si el archivo existe
      if (fsSync.existsSync(filePath)) {
        // Eliminar el archivo
        fsSync.unlinkSync(filePath);

        // Registrar el éxito
        this.log.debug(
          `Archivo ${fileName} eliminado exitosamente de ${filePath}`,
        );

        return { message: 'Archivo eliminado exitosamente' };
      } else {
        throw new Error(`Archivo ${fileName} no encontrado en ${filePath}`);
      }
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al eliminar el archivo: ${error.message}`);

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
      // Definir la ruta completa de la carpeta de año a eliminar
      const yearPath = path.join(
        'src/resources/products',
        productCode,
        subfolder,
        year,
      );

      // Verificar si la carpeta existe
      if (fsSync.existsSync(yearPath)) {
        // Eliminar la carpeta y su contenido
        fsSync.rmdirSync(yearPath, { recursive: true });

        // Registrar el éxito
        this.log.debug(
          `Carpeta de año ${year} eliminada exitosamente de ${yearPath}`,
        );

        return { message: 'Carpeta de año eliminada exitosamente' };
      } else {
        throw new Error(`Carpeta de año ${year} no encontrada en ${yearPath}`);
      }
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al eliminar la carpeta de año: ${error.message}`);

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
      // Definir la ruta completa de la carpeta de año actual y la nueva
      const oldYearPath = path.join(
        'src/resources/products',
        productCode,
        subfolderName,
        oldYear,
      );
      const newYearPath = path.join(
        'src/resources/products',
        productCode,
        subfolderName,
        newYear,
      );

      // Verificar si la carpeta con el nuevo nombre ya existe
      if (fsSync.existsSync(newYearPath)) {
        throw new Error('La carpeta con el nuevo nombre ya existe');
      }

      // Renombrar la carpeta de año si existe
      if (fsSync.existsSync(oldYearPath)) {
        fsSync.renameSync(oldYearPath, newYearPath);
      } else {
        throw new Error('La carpeta de año no existe');
      }

      // Registrar el éxito
      this.log.debug(
        `Carpeta de año ${oldYear} renombrada exitosamente a ${newYear}`,
      );

      return { message: 'Carpeta de año renombrada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al renombrar la carpeta de año: ${error.message}`);

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
      // Definir la ruta completa de la nueva subcarpeta
      const newSubfolderPath = path.join(
        'src/resources/products',
        productCode,
        subfolderName,
      );

      // Crear la nueva subcarpeta
      if (!fsSync.existsSync(newSubfolderPath)) {
        fsSync.mkdirSync(newSubfolderPath, { recursive: true });
      } else {
        throw new Error('La subcarpeta ya existe');
      }

      // Registrar el éxito
      this.log.debug(
        `Subcarpeta ${subfolderName} agregada exitosamente a ${newSubfolderPath}`,
      );

      return { message: 'Subcarpeta agregada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al agregar la subcarpeta: ${error.message}`);

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
      // Definir la ruta completa de la subcarpeta a eliminar
      const subfolderPath = path.join(
        'src/resources/products',
        productCode,
        subfolderName,
      );

      // Eliminar la subcarpeta si existe
      if (fsSync.existsSync(subfolderPath)) {
        fsSync.rmdirSync(subfolderPath, { recursive: true });
      } else {
        throw new Error('La subcarpeta no existe');
      }

      // Registrar el éxito
      this.log.debug(
        `Subcarpeta ${subfolderName} eliminada exitosamente de ${subfolderPath}`,
      );

      return { message: 'Subcarpeta eliminada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al eliminar la subcarpeta: ${error.message}`);

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
      // Definir la ruta completa de la subcarpeta actual y la nueva
      const oldSubfolderPath = path.join(
        'src/resources/products',
        productCode,
        oldSubfolderName,
      );
      const newSubfolderPath = path.join(
        'src/resources/products',
        productCode,
        newSubfolderName,
      );

      // Renombrar la subcarpeta si existe
      if (fsSync.existsSync(oldSubfolderPath)) {
        fsSync.renameSync(oldSubfolderPath, newSubfolderPath);
      } else {
        throw new Error('La subcarpeta no existe');
      }

      // Registrar el éxito
      this.log.debug(
        `Subcarpeta ${oldSubfolderName} renombrada exitosamente a ${newSubfolderName}`,
      );

      return { message: 'Subcarpeta renombrada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al renombrar la subcarpeta: ${error.message}`);

      // Lanzar la excepción
      throw error;
    }
  }

  /**
   * Método para agregar una nueva carpeta principal dentro del directorio especificado.
   * @param folderName: El nombre de la nueva carpeta principal.
   * @returns Un mensaje de éxito o error.
   */
  async addNewFolder(folderName: string, file: Express.Multer.File) {
    try {
      const newFolderPath = join('src/resources/products', folderName, 'img');

      if (!existsSync(newFolderPath)) {
        mkdirSync(newFolderPath, { recursive: true });
      } else {
        throw new Error('La carpeta principal ya existe');
      }

      if (file) {
        const filePath = join(newFolderPath, file.originalname);
        writeFileSync(filePath, file.buffer);
      }

      this.log.debug(
        `Carpeta principal ${folderName} agregada exitosamente a ${newFolderPath}`,
      );

      return { message: 'Carpeta principal agregada exitosamente' };
    } catch (error) {
      this.log.error(`Error al agregar la carpeta principal: ${error.message}`);
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
      // Definir la ruta completa de la carpeta
      const folderPath = path.join('src/resources/products', folderName);

      // Eliminar la carpeta si existe
      if (fsSync.existsSync(folderPath)) {
        fsSync.rmdirSync(folderPath, { recursive: true });
      } else {
        throw new Error('La carpeta no existe');
      }

      // Registrar el éxito
      this.log.debug(`Carpeta ${folderName} eliminada exitosamente`);

      return { message: 'Carpeta eliminada exitosamente' };
    } catch (error) {
      // Registrar el error
      this.log.error(`Error al eliminar la carpeta: ${error.message}`);

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
      const oldFolderPath = path.join('src/resources/products', oldFolderName);
      const newFolderPath = path.join('src/resources/products', newFolderName);
      const imgFolderPath = path.join(newFolderPath, 'img');

      if (fsSync.existsSync(oldFolderPath)) {
        // Renombrar la carpeta principal
        fsSync.renameSync(oldFolderPath, newFolderPath);

        if (image) {
          // Crear la carpeta img si no existe
          if (!fsSync.existsSync(imgFolderPath)) {
            fsSync.mkdirSync(imgFolderPath);
          }

          // Eliminar todas las imágenes existentes en la carpeta img
          const files = fsSync.readdirSync(imgFolderPath);
          for (const file of files) {
            fsSync.unlinkSync(path.join(imgFolderPath, file));
          }

          // Guardar la nueva imagen
          const newImagePath = path.join(imgFolderPath, image.originalname);
          fsSync.writeFileSync(newImagePath, image.buffer);
          this.log.log(`Imagen guardada en: ${newImagePath}`);
        }
      } else {
        throw new Error('La carpeta no existe');
      }

      this.log.debug(
        `Carpeta ${oldFolderName} renombrada exitosamente a ${newFolderName}`,
      );

      return { message: 'Carpeta renombrada exitosamente' };
    } catch (error) {
      this.log.error(`Error al renombrar la carpeta: ${error.message}`);
      throw error;
    }
  }
}
