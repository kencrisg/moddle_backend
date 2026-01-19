import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { EnrollStudentDto } from '../dtos/enroll-student.dto';

@Controller('courses')
export class CourseController implements OnModuleInit {
    constructor(
        @Inject('COURSE_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('create.course');
        this.kafkaClient.subscribeToResponseOf('get.courses');
        this.kafkaClient.subscribeToResponseOf('enroll.student');
        this.kafkaClient.subscribeToResponseOf('unenroll.student');
        this.kafkaClient.subscribeToResponseOf('delete.course');
        this.kafkaClient.subscribeToResponseOf('get.course.students');
        this.kafkaClient.subscribeToResponseOf('update.course.status');
        this.kafkaClient.subscribeToResponseOf('get.my.courses');
        this.kafkaClient.subscribeToResponseOf('get.users');

        await this.kafkaClient.connect();
    }

    @Get('users')
    getUsers() {
        // Leer lista va a COURSE-SERVICE (Dueño de la BDD de Lectura/Vista)
        console.log('📨 Gateway: Pidiendo estudiantes a la Vista de Cursos...');
        return this.kafkaClient.send('get.users', { role: 's' });
    }

    @Get('my-courses/:studentId')
    getMyCourses(@Param('studentId') studentId: string) {
        console.log(`📨 [Gateway] Pidiendo cursos para el estudiante: ${studentId}`);
        return this.kafkaClient.send('get.my.courses', { studentId });
    }

    @Post('enroll')
    enrollStudent(@Body() body: EnrollStudentDto) {
        return this.kafkaClient.send('enroll.student', body);
    }

    @Delete('enroll')
    unenrollStudent(@Body() body: EnrollStudentDto) {
        return this.kafkaClient.send('unenroll.student', body);
    }

    @Get(':id/students') 
    getCourseStudents(@Param('id') id: string) {
        console.log(`📨 Gateway: Pidiendo estudiantes del curso ${id}`);
        return this.kafkaClient.send('get.course.students', { courseId: id });
    }
    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() body: { isActive: boolean }
    ) {
        console.log(`🔄 Gateway: Cambiando estado del curso ${id} a ${body.isActive}`);
        return this.kafkaClient.send('update.course.status', {
            id,
            isActive: body.isActive
        });
    }

    @Post()
    createCourse(@Body() body: CreateCourseDto) {
        return this.kafkaClient.send('create.course', {
            id: crypto.randomUUID(),
            title: body.title,
            videoUrl: body.videoUrl,
        });
    }

    @Get()
    async getCourses() {
        return this.kafkaClient.send('get.courses', {});
    }

    @Delete(':id')
    deleteCourse(@Param('id') id: string) {
        return this.kafkaClient.send('delete.course', { id });
    }


}
