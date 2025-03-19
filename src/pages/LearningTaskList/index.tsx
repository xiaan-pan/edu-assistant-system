import services from '@/services/lessonApi';
import {
    ActionType,
    PageContainer,
    ProColumns,
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { isSuccessResponse } from '@/utils';
import { postUpdateLesson } from '@/services/lessonApi/lessonApi';
import { postGetLearningTaskList } from '@/services/learningTaskApi/learningTaskApi';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const { postAddLesson, postDelLesson } =
    services.lessonApi;

enum FORM_TYPE {
    CREATE_FORM,
    UPDATE_FORM
};

const LearningTaskList: React.FC<unknown> = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>(null);
    const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.CREATE_FORM);
    const [defaultFormValue, setDefaultFormValue] = useState<Partial<LessonApiInterface.Lesson>>({});

    const columns: ProColumns<LessonApiInterface.Lesson>[] = [
        {
            title: '知识点',
            dataIndex: 'knowledgePoint'
        },
        {
            title: '引言',
            dataIndex: 'introduction'
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 140,
            render: (_, record) => (
                <>
                    <a href={`/lessonDetail/${record.id}`}>
                        详情
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            setFormType(FORM_TYPE.UPDATE_FORM);
                            setDefaultFormValue(record);
                            handleModalVisible(true);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={async () => {
                            confirm({
                                title: '请确认是否删除',
                                icon: <ExclamationCircleFilled />,
                                content: `即将删除课堂：${record.name}`,
                                onOk: async () => {
                                    const response = await postDelLesson({
                                        ids: [record.id]
                                    });
                                    if (isSuccessResponse(response.code)) {
                                        message.success('删除成功');
                                        actionRef.current?.reload();
                                    }
                                },
                                onCancel() {
                                    message.success('已取消删除');
                                },
                            });

                        }}
                    >
                        删除
                    </a>
                </>
            ),
        },
    ];

    return (
        <PageContainer
            header={{
                title: '课堂列表',
            }}
        >
            <ProTable<LearningTaskApiInterface.LearningTask>
                headerTitle="课堂列表"
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => {
                            location.href = '/learningTaskDetail'
                            // setFormType(FORM_TYPE.CREATE_FORM);
                            // setDefaultFormValue({});
                            // handleModalVisible(true);
                        }}
                    >
                        新建
                    </Button>,
                ]}
                request={async (params) => {
                    console.log('params', params)
                    const { data, message: msg, code } = await postGetLearningTaskList(params as LearningTaskApiInterface.postGetLearningTaskListParams);

                    if (isSuccessResponse(code)) {
                        return {
                            data: data.list || [],
                            total: data.total
                        };
                    }
                    message.error(msg);
                    return {
                        data: [],
                        total: 0
                    };
                }}
                columns={columns}
                rowSelection={false}
                search={false}
                pagination={{
                    pageSize: 10
                }}
            />
            <Modal
                destroyOnClose
                title="新建"
                width={420}
                open={createModalVisible}
                onCancel={() => handleModalVisible(false)}
                footer={null}
            >
                <ProForm onFinish={async (e) => console.log(e)}>
                    <ProFormText
                        name="knowledgePoint"
                        label="知识点"
                        placeholder="请输入知识点"
                        required
                    />
                    <ProFormTextArea
                        name="introduction"
                        label="引言"
                        placeholder="请输入引言"
                        required
                    />
                    <ProFormTextArea
                        name="question"
                        label="题目"
                        tooltip="填空字符串（%s 为挖空占位）"
                        placeholder="请输入题目"
                        required
                    />
                    
                </ProForm>
            </Modal>
        </PageContainer>
    );
};

export default LearningTaskList;
