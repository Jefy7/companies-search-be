import { Module } from '@nestjs/common';
import { CommonModule } from '@lib/common';
import { DbService } from './db.service';

@Module({
  imports: [CommonModule],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
