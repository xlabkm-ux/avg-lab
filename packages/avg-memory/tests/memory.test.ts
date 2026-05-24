import { describe, it, expect } from 'vitest';
import type {
  ProjectRepository,
  SessionRepository,
  MessageRepository,
  DocumentRepository,
  GraphRepository
} from '../src';

describe('Repository Interfaces', () => {
  it('should export ProjectRepository interface', () => {
    const repo: Partial<ProjectRepository> = {
      findById: async (id: string) => ({ id, name: 'Test', createdAt: new Date(), updatedAt: new Date() }),
      findAll: async () => [],
      create: async (data: any) => ({ id: '1', ...data, createdAt: new Date(), updatedAt: new Date() }),
      update: async (id: string, data: any) => ({ id, ...data, createdAt: new Date(), updatedAt: new Date() }),
      delete: async (_id: string) => true
    };
    expect(repo.findById).toBeDefined();
  });

  it('should export SessionRepository interface', () => {
    const repo: Partial<SessionRepository> = {
      findByProject: async (_projectId: string) => []
    };
    expect(repo.findByProject).toBeDefined();
  });

  it('should export MessageRepository interface', () => {
    const repo: Partial<MessageRepository> = {
      findBySession: async (_sessionId: string) => []
    };
    expect(repo.findBySession).toBeDefined();
  });

  it('should export DocumentRepository interface', () => {
    const repo: Partial<DocumentRepository> = {
      search: async (_query: string) => []
    };
    expect(repo.search).toBeDefined();
  });

  it('should export GraphRepository interface', () => {
    const repo: Partial<GraphRepository> = {
      findNode: async (_id: string) => undefined
    };
    expect(repo.findNode).toBeDefined();
  });
});
