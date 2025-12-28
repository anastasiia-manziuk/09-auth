import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { api } from './api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}



export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function checkSession() {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
}

export async function fetchNotes(
  currentPage: number,
  search?: string,
  tagName?: string
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      search,
      page: currentPage,
      perPage: 12,
      tag: tagName,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}

export const fetchNoteById = async (noteId: Note['id']): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};