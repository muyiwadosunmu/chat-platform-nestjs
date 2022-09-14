import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IImageStorageService } from '../image-storage/image-storage';
import { Services } from '../utils/constants';
import { MessageAttachment } from '../utils/typeorm';
import { Attachment } from '../utils/types';
import { IMessageAttachmentsService } from './message-attachments';

@Injectable()
export class MessageAttachmentsService implements IMessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepository: Repository<MessageAttachment>,
    @Inject(Services.IMAGE_UPLOAD_SERVICE)
    private readonly imageUploadService: IImageStorageService,
  ) {}
  create(attachments: Attachment[]) {
    const promise = attachments.map((attachment) => {
      const newAttachment = this.attachmentRepository.create();
      return this.attachmentRepository
        .save(newAttachment)
        .then((messageAttachment) =>
          this.imageUploadService.uploadMessageAttachment({
            messageAttachment,
            file: attachment,
          }),
        );
    });
    return Promise.all(promise);
  }
}