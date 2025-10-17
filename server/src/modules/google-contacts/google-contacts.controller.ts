import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { GoogleContactsService } from './google-contacts.service';
import {
  CreateGoogleContactDto,
  GoogleContactResponseDto,
  GoogleContactsWithLeadResponseDto,
} from './google-contacts.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('google-contacts')
@UseGuards(JwtAuthGuard)
export class GoogleContactsController {
  constructor(private readonly googleContactsService: GoogleContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createContact(
    @Body() createContactDto: CreateGoogleContactDto,
  ): Promise<GoogleContactResponseDto> {
    return this.googleContactsService.createContact(createContactDto);
  }

  @Get('search')
  async searchContacts(@Query('q') query: string) {
    return this.googleContactsService.searchContacts(query);
  }

  @Get('leads')
  async getContactsWithLeadId(): Promise<GoogleContactsWithLeadResponseDto> {
    return this.googleContactsService.getContactsWithLeadId();
  }

  @Get('leads/:leadId')
  async getContactByLeadId(@Param('leadId') leadId: string) {
    const leadIdNumber = parseInt(leadId, 10);
    if (isNaN(leadIdNumber)) {
      throw new BadRequestException('Invalid Lead ID format');
    }
    return this.googleContactsService.getContactByLeadId(leadIdNumber);
  }

  @Get(':contactId')
  async getContact(@Param('contactId') contactId: string) {
    return this.googleContactsService.getContact(contactId);
  }

  @Put(':contactId')
  async updateContact(
    @Param('contactId') contactId: string,
    @Body() updateData: Partial<CreateGoogleContactDto>,
  ): Promise<GoogleContactResponseDto> {
    return this.googleContactsService.updateContact(contactId, updateData);
  }

  @Delete(':contactId')
  async deleteContact(
    @Param('contactId') contactId: string,
  ): Promise<GoogleContactResponseDto> {
    return this.googleContactsService.deleteContact(contactId);
  }
}
