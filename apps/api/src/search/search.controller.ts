import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { SearchService } from './search.service'

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Recherche avancée de profils' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'online', required: false, type: Boolean })
  async search(@Query() query: any) {
    const { q, ...filters } = query
    return this.searchService.search(q || '', filters)
  }
}
