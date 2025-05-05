import {
    FormListActionType,
    PageContainer,
    ProCard,
    ProForm,
    ProFormInstance,
    ProFormList,
    ProFormSelect,
    ProFormText
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isSuccessResponse, noop } from '@/utils';


import { postGetKnowledgePointTestList } from '@/services/knowledgePointTestApi/knowledgePointTestApi';
import { postGetLessonList } from '@/services/lessonApi/lessonApi';
import { postGetLearningTaskList } from '@/services/learningTaskApi/learningTaskApi';
import { postAddClassHour, postGetClassHourDetail, postUpdateClassHour } from '@/services/classHoursApi/classHoursApi';
import getUser from '@/utils/getUser';

const ClassHourDetail: React.FC<unknown> = () => {
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
        const { data, message: msg, code } = await postGetClassHourDetail({
            id: Number(pageParams.get('id')),
        });
        if (isSuccessResponse(code)) {
            setData(data);
            setTimeout(() => {
                formRef.current?.setFieldsValue({
                    ...data,
                    lessonId: {
                        label: data.lessonName,
                        value: data.lessonId
                    },
                    sessionList: data.sessionList.map((item) => ({
                        name: item.name,
                        knowledgePointTestId: {
                            label: `${item.knowledgePointTestId}-${item.knowledgePointTestName}`,
                            value: item.knowledgePointTestId
                        },
                        learningTaskId: {
                            label: `${item.learningTaskId}-${item.learningTaskName}`,
                            value: item.learningTaskId
                        },
                    }))
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
                title: `课时${actionText}`,
            }}
            breadcrumb={{
                items: [
                    {
                        href: '/classHourList',
                        title: '课时列表'
                    },
                    {
                        href: location.href,
                        title: `课时${actionText}`
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
                    console.log(formData);
                    if (!formData.sessionList?.length) {
                        message.error('请添加活动');
                        return;
                    }
                    if (isAdd) {
                        const { message: msg, code } = await postAddClassHour({
                            ...formData,
                            lessonId: Number(formData.lessonId.split('-')[0]),
                            lessonName: formData.lessonId.split('-')[1],
                            sessionList:  formData.sessionList.map((item) => {

                                return {
                                    ...item,
                                    ...({
                                        knowledgePointTestId: Number(item.knowledgePointTestId.split('-')[0]),
                                        knowledgePointTestName: item.knowledgePointTestId.split('-')[1],    
                                    }),
                                    ...({
                                        learningTaskId: Number(item.learningTaskId.split('-')[0]),
                                        learningTaskName: item.learningTaskId.split('-')[1],
                                    })
                                }
                            })
                        });
                        if (isSuccessResponse(code)) {
                            message.success('知识点测试创建成功');
                            history.back();
                            return;
                        }
                        message.error(msg);
                    } else if (isEdit) {
                        const { message: msg, code } = await postUpdateClassHour({
                            id: Number(pageParams.get('id')),
                            ...data,
                            ...formData,
                            lessonId: formData.lessonId.value,
                            lessonName: formData.lessonId.label,
                            sessionList: formData.sessionList.map((item) => {
                                // if (item.knowledgePointTestId.label) {
                                    
                                // }
                                return {
                                    ...item,
                                    ...(item.knowledgePointTestId.label ? {
                                        knowledgePointTestId: item.knowledgePointTestId.value,
                                        knowledgePointTestName: item.knowledgePointTestId.label.split('-')[1],    
                                    } : {
                                        knowledgePointTestId: item.knowledgePointTestId.split('-')[0],
                                        knowledgePointTestName: item.knowledgePointTestId.split('-')[1],
                                    }),
                                    ...(item.learningTaskId.label ? {
                                        learningTaskId: item.learningTaskId.value,
                                        learningTaskName: item.learningTaskId.label.split('-')[1]    
                                    } : {
                                        learningTaskId: item.learningTaskId.split('-')[0],
                                        learningTaskName: item.learningTaskId.split('-')[1],
                                    }),
                                }
                            })
                        });
                        if (isSuccessResponse(code)) {
                            message.success('知识点测试更新成功');
                            history.back();
                            return;
                        }
                        message.error(msg);
                    }
                }}
            >
                <ProFormText
                    name="name"
                    label="课时名"
                    placeholder="请输入知识点"
                    required
                    rules={[{ required: true }]}
                />
                <ProFormSelect
                    name="lessonId"
                    label="课堂"
                    placeholder="请选择课堂"
                    request={async () => {
                        const { code, data } = await postGetLessonList();
                        if (isSuccessResponse(code)) {
                            return data.list.map((item) => ({
                                label: `${item.name}`,
                                value: `${item.id}-${item.name}`
                            }));
                        }
                        return [];
                    }}
                    rules={[{ required: true }]}
                />
                <ProFormList
                    name="sessionList"
                    label="活动"
                    actionRef={actionRef}
                    fieldExtraRender={() => null}
                    creatorButtonProps={{ creatorButtonText: '新增活动' }}
                    itemRender={({ action }, listData) => {
                        const { record, index } = listData;
                        console.log({ record, index })
                        return (
                            <ProCard
                                bordered
                                style={{ marginBlockEnd: 8 }}
                                title={`活动${index + 1}`}
                                extra={action}
                                bodyStyle={{ paddingBlockEnd: 0 }}
                            >
                                <ProFormText
                                    name="name"
                                    label="活动名"
                                    placeholder="请输入活动名"
                                    required
                                    rules={[{ required: true }]}
                                />
                                <ProFormSelect
                                    name="learningTaskId"
                                    label="学习任务单"
                                    placeholder="请选择学习任务单"
                                    request={async () => {
                                        const { code, data } = await postGetLearningTaskList();
                                        if (isSuccessResponse(code)) {
                                            return data.list.map((item) => ({
                                                label: `【${item.id}】${item.knowledgePoint}-${item.introduction.length > 20 ? item.introduction.slice(0, 20) + '...' : item.introduction}`,
                                                value: `${item.id}-${item.knowledgePoint}`
                                            }));
                                        }
                                        return [];
                                    }}
                                    rules={[{ required: true }]}
                                />
                                <ProFormSelect
                                    name="knowledgePointTestId"
                                    label="知识点小测"
                                    placeholder="请选择知识点小测"
                                    request={async () => {
                                        const { code, data } = await postGetKnowledgePointTestList();
                                        if (isSuccessResponse(code)) {
                                            return data.list.map((item) => ({
                                                label: `【${item.id}】${item.knowledgePoint}-${item.introduction.length > 20 ? item.introduction.slice(0, 20) + '...' : item.introduction}`,
                                                value: `${item.id}-${item.knowledgePoint}`
                                            }));
                                        }
                                        return [];
                                    }}
                                    rules={[{ required: true }]}
                                />
                            </ProCard>
                        );
                    }}
                >
                </ProFormList>
                {/* <ProFormSelect
                    name="curSession"
                    label="当前活动"
                    placeholder="请选择当前活动"
                    request={async () => {
                        const { code, data } = await postGetLessonList();
                        if (isSuccessResponse(code)) {
                            return data.list.map((item) => ({
                                label: `${item.name}`,
                                value: `${item.id}-${item.name}`
                            }));
                        }
                        return [];
                    }}
                /> */}
            </ProForm>
        </PageContainer>
    );
};

export default ClassHourDetail;
