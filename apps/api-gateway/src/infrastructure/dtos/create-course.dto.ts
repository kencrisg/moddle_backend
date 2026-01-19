import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @MinLength(5, { message: 'El título es muy corto, escribe al menos 5 letras' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La URL del video es obligatoria' })
  @IsUrl({}, { message: 'Enviar una URL válida (ej: https://youtube.com...)' })
  videoUrl: string;
}