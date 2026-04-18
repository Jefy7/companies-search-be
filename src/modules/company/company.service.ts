import { Injectable } from '@nestjs/common';

import { SearchService } from '../search/search.service';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompanyService {
  public constructor(private readonly searchService: SearchService) {}

  public search(filters: SearchCompanyDto) {
    return this.searchService.search(filters);
  }
}
