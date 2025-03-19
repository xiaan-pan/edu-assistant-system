declare namespace KnowledgePointTestApiInterface {
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

  type KnowledgePointTest = {
    /** id */
    id: number;
    /** 引言 */
    introduction: string;
    /** 知识点 */
    knowledgePoint: string;
  };

  type MultipleChoiceQuestion = {
    /** id */
    id: number;
    /** 小测id */
    testId: number;
    /** 题目 */
    question: string;
    /** 选项（_分隔） */
    options: string;
    /** 答案 */
    answer: string;
  };

  type postGetKnowledgePointTestListParams = {
    /** 当前页 */
    current: number;
    /** 每页多少条 */
    pageSize: number;
  };
}
