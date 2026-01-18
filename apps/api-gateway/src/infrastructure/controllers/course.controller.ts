import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
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
        await this.kafkaClient.connect();
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

    @Post('enroll')
    enrollStudent(@Body() body: EnrollStudentDto) {
        return this.kafkaClient.send('enroll.student', { body });
    }

    @Delete('enroll')
    unenrollStudent(@Body() body: EnrollStudentDto) {
        return this.kafkaClient.send('unenroll.student', body);
    }
}
