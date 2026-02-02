import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new job' })
    @ApiResponse({ status: 201, description: 'The job has been successfully created.', type: Job })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createJobDto: CreateJobDto) {
        return this.jobService.create(createJobDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all jobs' })
    @ApiResponse({ status: 200, description: 'Return all jobs.', type: [Job] })
    findAll() {
        return this.jobService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a job by ID' })
    @ApiResponse({ status: 200, description: 'Return the job.', type: Job })
    @ApiResponse({ status: 404, description: 'Job not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.jobService.findOne(id);
    }

    @Get('site/:siteId')
    @ApiOperation({ summary: 'Retrieve all jobs for a site' })
    @ApiResponse({ status: 200, description: 'Return all jobs for the site.', type: [Job] })
    findBySite(@Param('siteId', ParseUUIDPipe) siteId: string) {
        return this.jobService.findBySite(siteId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a job by ID' })
    @ApiResponse({ status: 200, description: 'The job has been successfully updated.', type: Job })
    @ApiResponse({ status: 404, description: 'Job not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateJobDto: UpdateJobDto) {
        return this.jobService.update(id, updateJobDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a job by ID' })
    @ApiResponse({ status: 200, description: 'The job has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Job not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.jobService.remove(id);
    }
}
