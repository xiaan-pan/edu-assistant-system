declare namespace ClassHoursApiInterface {
  type ClassHour = {
    /** id */
    id: number;
    /** 课时名 */
    name: string;
    /** 课堂id */
    lessonId: number;
    /** 课堂名称 */
    lessonName: string;
    /** 当前所处的环节id 没有开启对环节则为 -1 */
    sessionId: number;
    /** 当前所处的环节名称 没有开启对环节则为空 */
    sessionName: string;
  };

  type ClassSession = {
    /** id */
    id: number;
    /** 课时id */
    classHourId: number;
    /** 环节名称 */
    name: string;
    /** 学习任务单id */
    learningTaskId?: number;
    /** 知识点小测id */
    knowledgePointTestId: number;
    /** 完成度 0-100 */
    completionDegree: number;
    /** 完成状态：0（未完成）、1（已完成） 完成状态：0（未完成）、1（已完成） */
    completionStatus: number;
    /** 索引 */
    index: number;
  };

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

  type postGetClassHourListParams = {
    /** 当前页 */
    current: number;
    /** 每页多少条 */
    pageSize: number;
  };
}
