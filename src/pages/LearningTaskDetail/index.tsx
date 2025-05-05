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
import { Button, Divider, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isSuccessResponse, noop } from '@/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { postAddLearningTask, postGetLearningTaskDetail, postUpdateLearningTask } from '@/services/learningTaskApi/learningTaskApi';
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
    const user = getUser();

    const urlObject = new URL(location.href);
    const pageParams = new URLSearchParams(urlObject.search);
    const isAdd = !pageParams.get('id');
    const isEdit = !!pageParams.get('isEdit');
    const actionText = isAdd ? '创建' : (isEdit ? '编辑' : '详情');
    const disabled = !isAdd && !isEdit;
    const fetchData = async () => {
        const { data, message: msg, code } = await postGetLearningTaskDetail({
            id: Number(pageParams.get('id')),
        });
        if (isSuccessResponse(code)) {
            setData(data);
            setTimeout(() => {
                formRef.current?.setFieldsValue({
                    ...data,
                    ...data.questionInfo
                })
            });
            return noop;
        }
        message.error(msg);
    }
    useEffect(() => {
        if (!pageParams.get('id')) {
            return noop;
        }

        fetchData();
        return noop;
    }, []);

    if (!data && !isAdd) {
        return 'Loading...';
    }
    
    return (
        <PageContainer
            header={{
                title: `任务单${actionText}`,
            }}
            breadcrumb={{
                items: [
                    {
                        href: '/learningTaskList',
                        title: '任务单列表'
                    },
                    {
                        href: location.href,
                        title: `任务单${actionText}`
                    }
                ]
            }}
        >
            <ProForm
                formRef={formRef}
                disabled={disabled}
                onChange={(e) => {
                    const { id, value } = e.target || {};
                    if (id === 'question') {
                        const questionCount = value.split('%s').length - 1;
                        const curCount = actionRef.current?.getList()?.length || 0;
                        if (questionCount > curCount) {
                            for(let i = curCount; i < questionCount; i++) {
                                actionRef.current?.add({});
                            }
                        } else if (questionCount < curCount) {
                            for(let i = curCount; i > questionCount; i--) {
                                actionRef.current?.remove(i - 1);
                            }
                        }
                    }
                }}
                onFinish={async (formData: any) => {
                    if (!formData.answerList?.length) {
                        message.error('答案不能为空');
                        return;
                    }
                    if (isAdd) {
                        const { message: msg, code } = await postAddLearningTask({
                            introduction: formData.introduction,
                            knowledgePoint: formData.knowledgePoint,
                            questionInfo: {
                                question: formData.question,
                                analyze: '',
                                answerList: formData.answerList.map((item, index) => ({
                                    positionIndex: index,
                                    answer: item.answer,
                                }))
                            }
                        });
                        if (isSuccessResponse(code)) {
                            message.success('任务单创建成功');
                            history.back();
                            return;
                        }
                        message.error(msg);
                    } else if (isEdit) {
                        const { message: msg, code } = await postUpdateLearningTask({
                            id: Number(pageParams.get('id')),
                            introduction: formData.introduction,
                            knowledgePoint: formData.knowledgePoint,
                            questionInfo: {
                                question: formData.question,
                                analyze: '',
                                answerList: formData.answerList.map((item, index) => ({
                                    positionIndex: index,
                                    answer: item.answer,
                                }))
                            }
                        });
                        if (isSuccessResponse(code)) {
                            message.success('任务单创建成功');
                            history.back();
                            return;
                        }
                        message.error(msg);
                    }
                }}
            >
                <ProFormText
                    name="knowledgePoint"
                    label="知识点"
                    placeholder="请输入知识点"
                    required
                    rules={[{ required: true }]}
                />
                <ProFormTextArea
                    name="introduction"
                    label="引言"
                    placeholder="请输入引言"
                    required
                    rules={[{ required: true }]}
                />
                <ProFormTextArea
                    name="question"
                    label="题目"
                    tooltip="填空字符串（%s 为挖空占位）"
                    placeholder="请输入题目"
                    required
                    rules={[{ required: true }]}
                    onMetaChange={(meta) => {
                        console.log('meta', meta)
                    }}
                />
                <ProFormList
                    name="answerList"
                    label="答案"
                    actionRef={actionRef}
                    fieldExtraRender={() => null}
                    creatorButtonProps={false}
                    itemRender={({}, listData) => {
                        const { record, index } = listData;
                        return (
                            <ProFormText
                                name="answer"
                                label={`答案${index + 1}`}
                                placeholder="请输入知识点"
                                required
                                rules={[{ required: true }]}
                            />
                        );
                    }}
                >
                </ProFormList>
            </ProForm>
        </PageContainer>
    );
};

export default LearningTaskDetail;
