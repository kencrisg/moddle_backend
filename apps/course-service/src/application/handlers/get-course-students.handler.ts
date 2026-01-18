import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EnrollmentEntity } from '../../infrastructure/persistence/entities/enrollment.entity';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';
import { GetCourseStudentsQuery } from '../queries/get-course-students.query';

@QueryHandler(GetCourseStudentsQuery)
export class GetCourseStudentsHandler implements IQueryHandler<GetCourseStudentsQuery> {
  constructor(
    // 1. Repo de Matrículas (Para sacar los IDs)
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,

    // 2. Repo de VISTA DE USUARIOS (Conexión de LECTURA - moodle_r) 🚀
    @InjectRepository(UserViewEntity, 'READ_CONNECTION')
    private readonly userReadRepo: Repository<UserViewEntity>,
  ) {}

  async execute(query: GetCourseStudentsQuery): Promise<UserViewEntity[]> {
    const { courseId } = query;
    console.log(`🔍 [Query] Buscando estudiantes para el curso: ${courseId}`);

    // Paso A: Obtener los IDs de los estudiantes matriculados
    const enrollments = await this.enrollmentRepo.find({
      where: { courseId: courseId },
      select: ['studentId'], // Solo traemos el ID para ser eficientes
    });

    // Si no hay nadie matriculado, devolvemos array vacío
    if (enrollments.length === 0) {
      return [];
    }

    // Extraemos los IDs en un array simple: ['uuid-1', 'uuid-2']
    const studentIds = enrollments.map((e) => e.studentId);

    // Paso B: Buscar los detalles COMPLETOS en la BDD de LECTURA
    const students = await this.userReadRepo.find({
      where: {
        id: In(studentIds), // Usamos el operador IN de TypeORM
      },
    });

    console.log(`✅ Encontrados ${students.length} estudiantes.`);
    return students;
  }
}