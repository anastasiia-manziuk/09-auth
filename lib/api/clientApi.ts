import { api } from './api';
import { User } from '@/types/user';
import type { Note, CreateNoteData } from '@/types/note';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function checkSession(): Promise<boolean> {
  try {
    await api.get('/auth/session');
    return true;
  } catch {
    return false;
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>('/auth/register', {
    email,
    password,
  });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function updateMe(username: string): Promise<User> {
  const { data } = await api.patch<User>('/users/me', {
    username,
  });
  return data;
}

/* ---------- NOTES ---------- */

export async function fetchNotes(
  page = 1,
  search = '',
  perPage = 12,
  tag?: string
): Promise<NotesResponse> {
  const params: Record<string, unknown> = { page, search, perPage };
  if (tag) params.tag = tag;

  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
}

export async function fetchNoteById(noteId: Note['id']): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${noteId}`);
  return data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const res = await api.post<Note>('/notes', data);
  return res.data;
}

export async function deleteNote(id: Note['id']): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
