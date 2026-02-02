import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((project) => Promise.resolve({ ...project })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an ID when creating a project', async () => {
    const createProjectDto = {
      name: 'Test Project',
      workOrderNumber: 'WO-123',
      location: 'Test Location',
      clientName: 'Test Client',
      startDate: '2023-01-01',
    } as any;

    const result = await service.create(createProjectDto);

    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(repository.create).toHaveBeenCalledWith(createProjectDto);
    expect(repository.save).toHaveBeenCalled();
  });
});
