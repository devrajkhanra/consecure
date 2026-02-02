import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';

@ApiTags('sites')
@Controller('sites')
export class SiteController {
    constructor(private readonly siteService: SiteService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new site' })
    @ApiResponse({ status: 201, description: 'The site has been successfully created.', type: Site })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createSiteDto: CreateSiteDto) {
        return this.siteService.create(createSiteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all sites' })
    @ApiResponse({ status: 200, description: 'Return all sites.', type: [Site] })
    findAll() {
        return this.siteService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a site by ID' })
    @ApiResponse({ status: 200, description: 'Return the site.', type: Site })
    @ApiResponse({ status: 404, description: 'Site not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.siteService.findOne(id);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Retrieve all sites for a project' })
    @ApiResponse({ status: 200, description: 'Return all sites for the project.', type: [Site] })
    findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.siteService.findByProject(projectId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a site by ID' })
    @ApiResponse({ status: 200, description: 'The site has been successfully updated.', type: Site })
    @ApiResponse({ status: 404, description: 'Site not found.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSiteDto: UpdateSiteDto) {
        return this.siteService.update(id, updateSiteDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a site by ID' })
    @ApiResponse({ status: 200, description: 'The site has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Site not found.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.siteService.remove(id);
    }
}
