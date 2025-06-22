import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './discussion.entity';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion])],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}
