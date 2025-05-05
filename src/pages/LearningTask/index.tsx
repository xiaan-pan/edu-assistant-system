import services from '@/services/lessonApi';
import {
    ActionType,
    FormListActionType,
    PageContainer,
    ProDescriptionsItemProps,
    ProForm,
    ProFormInstance,
    ProFormList,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, Typography, message, Modal, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isSuccessResponse, noop } from '@/utils';
import { ExclamationCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { postAddLearningTask, postGetLearningTaskDetail, postSubmitAnswer, postUpdateLearningTask } from '@/services/learningTaskApi/learningTaskApi';
import getUser from '@/utils/getUser';

const { confirm } = Modal;

const { postGetLessonDetail, postDelLessonMembers, postAddLessonMembers } =
    services.lessonApi;

const LearningTaskDetail: React.FC<unknown> = () => {
    const formRef = useRef<ProFormInstance>(null);
    const actionRef = useRef<
        FormListActionType<{
            answer: string;
        }>
    >();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const user = getUser();

    
    const fetchData = async () => {
        const lessonInfo = localStorage.getItem('defaultLesson');
        if (!lessonInfo) {
            return;
        }
        const lessonId = Number(lessonInfo.split('-')[0]);
        const { data, message: msg, code } = await postGetLearningTaskDetail({
            lessonId,
            username: user.username
        });

        if (isSuccessResponse(code)) {
            setData(data);
            setTimeout(() => {
                formRef.current?.setFieldsValue({
                    ...data,
                    ...data.questionInfo,
                    answerList: Array(data.questionInfo.answerList.length).fill({
                        answer: ''
                    })
                })
            });
            return noop;
        } else {
            setMsg(msg);
            message.error(msg);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return 'Loading...';
    }

    if (!data) {
        return (
            <PageContainer
                header={{
                    title: `任务单`
                }}
            >
                <p>{ msg }</p>
            </PageContainer>
        )
    }

    const hasSubmit = !!data.answerStr;
    const answerList = data.answerStr?.split('_') || [];

    return (
        <PageContainer
            header={{
                title: `任务单`,
                subTitle: `${data.lessonInfo.name}——${data.classHourInfo.name}——${data.classSessionInfo.name}`
            }}
        >
            <ProForm
                formRef={formRef}
                disabled={hasSubmit}
                onFinish={async (formData: any) => {
                    console.log(formData)
                    const { code, message: msg } = await postSubmitAnswer({
                        username: user.username,
                        classHourId: data.classHourInfo.id,
                        answerStr: formData.answerList.map(item => item.answer).join('_')
                    });
                    if (isSuccessResponse(code)) {
                        message.success(msg);
                    }
                }}
            >
                <Descriptions
                    items={[{
                        key: 'knowledgePoint',
                        label: '知识点',
                        children: data.knowledgePoint,
                        span: 1
                    }]}
                />
                <br />
                <Descriptions
                    items={[{
                        key: 'introduction',
                        label: '引言',
                        children: data.introduction,
                        span: 2
                    }]}
                />
                <br />
                <Descriptions
                    items={[{
                        key: 'question',
                        label: '题目',
                        children: <div>
                            {data.questionInfo.question.split('%s').map(
                            (text, index) => {
                                return (
                                    <>
                                        {index > 0 && (
                                            hasSubmit ? (
                                                <Typography.Text type='danger'>
                                                    {data.questionInfo.answerList[index - 1].answer}
                                                </Typography.Text>      
                                            ) : (
                                                <Tag bordered={false} style={{
                                                        marginLeft: '5px',
                                                        marginRight: '5px'
                                                    }} color="#55acee" icon={<QuestionCircleFilled />}>
                                                    问题{index}
                                                </Tag>
                                            )
                                        )}
                                        <Typography.Text>
                                            {text}
                                        </Typography.Text>
                                    </>
                                    
                                )
                            }
                        )}
                        </div>,
                    }]}
                />
                <br />
                <h3>答案</h3>
                {!hasSubmit ? (
                    <ProFormList
                        name="answerList"
                        actionRef={actionRef}
                        fieldExtraRender={() => null}
                        creatorButtonProps={false}
                        itemRender={({ }, listData) => {
                            const { record, index } = listData;
                            return (
                                <ProFormText
                                    name="answer"
                                    label={`问题${index + 1}的答案`}
                                    placeholder={`请输入问题${index + 1}的答案`}
                                    required
                                    rules={[{ required: true }]}
                                />
                            );
                        }}
                    >
                    </ProFormList>
                ) : (
                    <div>
                        {data.questionInfo.answerList.map((item, index) => {
                            const isCorrect = item.answer === answerList[index];
                            return (
                                <div>
                                    <h4>{`问题${index + 1}：`}</h4>
                                    <div>你的答案：<span style={{ color: isCorrect ? '' : 'red' }}>{ answerList[index] }</span></div>
                                    {!isCorrect && (
                                        <div>正确答案：<span style={{ color: 'red' }}>{ item.answer }</span></div>
                                    )}
                                    <br />
                                </div>
                            )
                        })}
                        <h3>解析：</h3>
                        <div>{ data.questionInfo.analyze }</div>
                        <br />

                    </div>
                )}
                
            </ProForm>
        </PageContainer>
    );
};

export default LearningTaskDetail;
