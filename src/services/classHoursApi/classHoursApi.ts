// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** addClassHour POST /api/classHours/addClassHour */
export async function postAddClassHour(
  body: {
    name: string;
    lessonId: number;
    sessionList: {
      name: string;
      learningTaskId?: number;
      knowledgePointTestId: number;
    }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/classHours/addClassHour',
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

/** delClassHour POST /api/classHours/delClassHour */
export async function postDelClassHour(
  body: {
    ids: number[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/classHours/delClassHour',
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

/** getClassHourDetail POST /api/classHours/getClassHourDetail */
export async function postGetClassHourDetail(
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
      lessonId: number;
      lessonName: string;
      sessionId: number;
      sessionName: string;
      sessionList: ClassHoursApiInterface.ClassSession[];
    };
  }>('/api/classHours/getClassHourDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getClassHourList POST /api/classHours/getClassHourList */
export async function postGetClassHourList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  // params: ClassHoursApiInterface.postGetClassHourListParams,
  body: {
    current: number;
    pageSize: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: {
      total: number;
      list: {
        id: number;
        name: string;
        lessonId: number;
        lessonName: string;
        sessionId: number;
        sessionName: string;
      }[];
    };
  }>('/api/classHours/getClassHourList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // params: {
    //   ...params,
    // },
    data: body,
    ...(options || {}),
  });
}

/** updateClassHour POST /api/classHours/updateClassHour */
export async function postUpdateClassHour(
  body: {
    id: number;
    name: string;
    lessonId: number;
    /** 没有开启对环节则为 -1 */
    sessionId: number;
    sessionList: {
      id: number;
      name: string;
      learningTaskId?: number;
      knowledgePointTestId: number;
      index: number;
    }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/classHours/updateClassHour',
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

export async function postUpdateCurSession(
  body: {
    classHourId: number;
    sessionId: number;
    sessionName: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/classHours/updateCurSession',
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