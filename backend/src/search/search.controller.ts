import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/services')
  async searchServices(@Query() query: SearchQueryDto) {
    return this.searchService.searchServices(query);
  }

  @Get('/requests')
  async searchRequests(@Query() query: SearchQueryDto) {
    return this.searchService.searchRequests(query);
  }

  @Get()
  async searchEverything(
    @Query('keyword') keyword: string = '',
    @Query('page') page: number = 1,
  ) {
    return this.searchService.searchEverything(keyword, page);
  }
}
