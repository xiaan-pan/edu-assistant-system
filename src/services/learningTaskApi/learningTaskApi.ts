// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** addLearningTask POST /api/learningTask/addLearningTask */
export async function postAddLearningTask(
  body: {
    introduction: string;
    knowledgePoint: string;
    questionInfo: {
      question: string;
      analyze: string;
      answerList: {
        questionId: number;
        positionIndex: number;
        answer: string;
      }[];
    };
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/learningTask/addLearningTask',
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

/** delLearningTask POST /api/learningTask/delLearningTask */
export async function postDelLearningTask(
  body: {
    ids: number[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/learningTask/delLearningTask',
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

/** getLearningTaskDetail POST /api/learningTask/getLearningTaskDetail */
export async function postGetLearningTaskDetail(
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
      questionInfo: {
        id: number;
        question: string;
        analyze: string;
        answerList: LearningTaskApiInterface.GapFillingAnswer[];
      };
    };
  }>('/api/learningTask/getLearningTaskDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getLearningTaskList POST /api/learningTask/getLearningTaskList */
export async function postGetLearningTaskList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  // params: LearningTaskApiInterface.postGetLearningTaskListParams,
  body: {
    current: number;
    pageSize: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    message: string;
    data: { total: number; list: LearningTaskApiInterface.LearningTask[] };
  }>('/api/learningTask/getLearningTaskList', {
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

/** updateLearningTask POST /api/learningTask/updateLearningTask */
export async function postUpdateLearningTask(
  body: {
    id: number;
    introduction: string;
    knowledgePoint: string;
    questionInfo: {
      id: number;
      question: string;
      analyze: string;
      answerList: {
        questionId: number;
        positionIndex: number;
        answer: string;
      }[];
    };
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/learningTask/updateLearningTask',
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

export async function postSubmitAnswer(
  body: {
    username: string;
    classHourId: number;
    answerStr: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; message: string }>(
    '/api/learningTask/submitAnswer',
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