// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** addLesson POST /api/lesson/addLesson */
export async function postAddLesson(
  body: {
    name: string;
    description: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>('/api/lesson/addLesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** addLessonMembers POST /api/lesson/addLessonMembers */
export async function postAddLessonMembers(
  body: {
    id: number;
    memberList: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/lesson/addLessonMembers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** delLesson POST /api/lesson/delLesson */
export async function postDelLesson(
  body: {
    ids: number[];
  },
  options?: { [key: string]: any },
) {
  return request<LessonApiInterface.CommonResponse>('/api/lesson/delLesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** delLessonMembers POST /api/lesson/delLessonMembers */
export async function postDelLessonMembers(
  body: {
    id: number;
    memberList: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/lesson/delLessonMembers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** getLessonDetail POST /api/lesson/getLessonDetail */
export async function postGetLessonDetail(
  body: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: {
      id: number;
      name: string;
      description: string;
      owner: string;
      classMemberList: LessonApiInterface.ClassMembers[];
    };
  }>('/api/lesson/getLessonDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getLessonList POST /api/lesson/getLessonList */
export async function postGetLessonList(
  body: LessonApiInterface.CommonTablePageParam,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { total: number; list: LessonApiInterface.Lesson[] };
  }>('/api/lesson/getLessonList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateLesson POST /api/lesson/updateLesson */
export async function postUpdateLesson(
  body: {
    id: number;
    name: string;
    description: string;
  },
  options?: { [key: string]: any },
) {
  return request<LessonApiInterface.CommonResponse>(
    '/api/lesson/updateLesson',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

export async function postUpdateClassHourInfo (
  body: {
    lessonId: number;
    activedClassHourId: number;
    activedClassHourName: string;
  },
  options?: { [key: string]: any },
) {
  return request<LessonApiInterface.CommonResponse>(
    '/api/lesson/updateClassHour',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

export async function postGenerateUsers (
  body: {
    count: number;
    start: number;
    prefix: string;
  },
  options?: { [key: string]: any },
) {
  return request<LessonApiInterface.CommonResponse>(
    '/api/user/generateUsers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
