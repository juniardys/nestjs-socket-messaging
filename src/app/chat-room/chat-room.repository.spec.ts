import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomRepository } from './chat-room.repository';

describe('ChatRoomRepository', () => {
  let repository: ChatRoomRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRoomRepository],
    }).compile();

    repository = module.get<ChatRoomRepository>(ChatRoomRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
