declare namespace LessonApiInterface {
  type ClassMembers = {
    /** id */
    id: number;
    /** 课堂id */
    lessonId: number;
    /** 成员（username） */
    memberNo: string;
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

  type Lesson = {
    /** id */
    id: number;
    /** 课堂名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 创建人 用户名 */
    owner: string;
  };
}
