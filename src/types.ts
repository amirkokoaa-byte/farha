export type InvitationStatus = 'draft' | 'published';

export interface Invitation {
  id: string;
  admin_uid: string;
  status: InvitationStatus;
  brideName: string;
  groomName: string;
  date: string;
  venue?: string;
  updatedAt?: any;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  message: string;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
