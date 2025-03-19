declare namespace LearningTaskApiInterface {
  type CommonResponse = {
    code: number;
    message: string;
  };

  type CommonTablePageParam = {
    /** 当前页 */
    current: number;
    /** 每页多少条 */
    pageSize: number;
  };

  type GapFillingAnswer = {
    /** id */
    id: number;
    /** 题目id */
    questionId: number;
    /** 位置 */
    positionIndex: number;
    /** 答案 */
    answer: string;
  };

  type GapFillingQuestion = {
    /** id */
    id: number;
    /** 填空字符串（%s 为挖空占位） %s 为挖空占位 */
    question: string;
    /** 解析 */
    analyze: string;
  };

  type LearningTask = {
    id: number;
    /** 引言 */
    introduction: string;
    /** 知识点 */
    knowledgePoint: string;
    /** 题目id */
    questionId: number;
  };

  type postGetLearningTaskListParams = {
    /** 当前页 */
    current: number;
    /** 每页多少条 */
    pageSize: number;
  };
}
