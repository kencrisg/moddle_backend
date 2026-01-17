import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course-service.controller';
import { CreateCourseHandler } from '../../application/handlers/create-course.handler';


describe('CourseController', () => {
  let controller: CourseController;
  let handler: CreateCourseHandler;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CreateCourseHandler,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<CourseController>(CourseController);
    handler = app.get<CreateCourseHandler>(CreateCourseHandler);
  });

  describe('create', () => {
    it('should call execute on handler', async () => {
      const payload = { id: '1', title: 'Test', videoUrl: 'url' };
      await controller.create(payload);
      expect(handler.execute).toHaveBeenCalledWith(payload);
    });
  });
});
