// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** addKnowledgePointTest POST /api/knowledgePointTest/addKnowledgePointTest */
export async function postAddKnowledgePointTest(
  body: {
    introduction: string;
    knowledgePoint: string;
    questionList: { question: string; options: string; answer: string }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/knowledgePointTest/addKnowledgePointTest',
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

/** delKnowledgePointTest POST /api/knowledgePointTest/delKnowledgePointTest */
export async function postDelKnowledgePointTest(
  body: {
    ids: number[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/knowledgePointTest/delKnowledgePointTest',
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

/** getKnowledgePointTestDetail POST /api/knowledgePointTest/getKnowledgePointTestDetail */
export async function postGetKnowledgePointTestDetail(
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
      introduction: string;
      knowledgePoint: string;
      questionList: KnowledgePointTestApiInterface.MultipleChoiceQuestion[];
    };
  }>('/api/knowledgePointTest/getKnowledgePointTestDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getKnowledgePointTestList POST /api/knowledgePointTest/getKnowledgePointTestList */
export async function postGetKnowledgePointTestList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: KnowledgePointTestApiInterface.postGetKnowledgePointTestListParams,
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
      list: { id: number; introduction: string; knowledgePoint: string }[];
    };
  }>('/api/knowledgePointTest/getKnowledgePointTestList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** updateKnowledgePointTest POST /api/knowledgePointTest/updateKnowledgePointTest */
export async function postUpdateKnowledgePointTest(
  body: {
    id: number;
    introduction: string;
    knowledgePoint: string;
    questionList: { question: string; options: string; answer: string }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/knowledgePointTest/updateKnowledgePointTest',
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
