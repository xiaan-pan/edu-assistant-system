import {
    FormListActionType,
    PageContainer,
    ProCard,
    ProForm,
    ProFormInstance,
    ProFormList,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isSuccessResponse, noop } from '@/utils';


import { postAddKnowledgePointTest, postGetKnowledgePointTestDetail, postUpdateKnowledgePointTest } from '@/services/knowledgePointTestApi/knowledgePointTestApi';

const { confirm } = Modal;

const ClassHourDetail: React.FC<unknown> = () => {
    const formRef = useRef<ProFormInstance>(null);
    const actionRef = useRef<
        FormListActionType<{
            answer: string;
        }>
    >();
    const [data, setData] = useState(null);

    const urlObject = new URL(location.href);
    const pageParams = new URLSearchParams(urlObject.search);
    const isAdd = !pageParams.get('id');
    const isEdit = !!pageParams.get('isEdit');
    const actionText = isAdd ? '创建' : (isEdit ? '编辑' : '详情');
    const disabled = !isAdd && !isEdit;
    const fetchData = async () => {
        const { data, message: msg, code } = await postGetKnowledgePointTestDetail({
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
                title: `课时${actionText}`,
            }}
            breadcrumb={{
                items: [
                    {
                        href: '/knowledgePointTestList',
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
                    if (!formData.questionList?.length) {
                        message.error('测试题不能为空');
                        return;
                    }
                    if (isAdd) {
                        const { message: msg, code } = await postAddKnowledgePointTest({
                            ...formData
                        });
                        if (isSuccessResponse(code)) {
                            message.success('知识点测试创建成功');
                            history.back();
                            return;
                        }
                        message.error(msg);
                    } else if (isEdit) {
                        const { message: msg, code } = await postUpdateKnowledgePointTest({
                            id: Number(pageParams.get('id')),
                            ...formData
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
                <ProFormList
                    name="questionList"
                    label="测试题"
                    actionRef={actionRef}
                    fieldExtraRender={() => null}
                    creatorButtonProps={{ creatorButtonText: '新增测试题' }}
                    itemRender={({ action }, listData) => {
                        const { record, index } = listData;
                        console.log({ record, index })
                        return (
                            <ProCard
                                bordered
                                style={{ marginBlockEnd: 8 }}
                                title={`测试${index + 1}`}
                                extra={action}
                                bodyStyle={{ paddingBlockEnd: 0 }}
                            >
                                <ProFormText
                                    name="question"
                                    label="题目"
                                    placeholder="请输入题目"
                                    required
                                    rules={[{ required: true }]}
                                />
                                <ProFormText
                                    name="options"
                                    label="答案选项"
                                    placeholder="请输入答案选项"
                                    tooltip="选项（_分隔）"
                                    required
                                    rules={[{ required: true }]}
                                />
                                <ProFormText
                                    name="answer"
                                    label="答案"
                                    placeholder="请输入答案"
                                    required
                                    rules={[{ required: true }]}
                                />
                            </ProCard>
                        );
                    }}
                >
                </ProFormList>
            </ProForm>
        </PageContainer>
    );
};

export default ClassHourDetail;
