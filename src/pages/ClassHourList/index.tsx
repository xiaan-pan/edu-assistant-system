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
import { Button, Divider, Dropdown, message, Modal, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { isSuccessResponse } from '@/utils';
import { postDelKnowledgePointTest, postGetKnowledgePointTestList } from '@/services/knowledgePointTestApi/knowledgePointTestApi';
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { postDelClassHour, postGetClassHourList, postUpdateCurSession } from '@/services/classHoursApi/classHoursApi';
import getUser from '@/utils/getUser';

const { confirm } = Modal;


const LearningTaskList: React.FC<unknown> = () => {
    const actionRef = useRef<ActionType>(null);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);

    const user = getUser();
    
    const columns: ProColumns<ClassHoursApiInterface.ClassHour>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 30
        },
        {
            title: '课时名',
            dataIndex: 'name',
            width: 100
        },
        {
            title: '所属课堂',
            dataIndex: 'lessonName',
            render: (dom, entity) => {
                console.log(entity)
                return `${entity.lessonId}-${entity.lessonName}`;
            }
        },
        {
            title: '当前环节',
            dataIndex: 'sessionName',
            render: (dom, entity) => {
                console.log(entity)
                return `${entity.sessionId}-${entity.sessionName}`;
            }
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 230,
            render: (_, record) => (
                <>
                    <a href={`/classHourDetail?id=${record.id}`}>
                        详情
                    </a>
                    <Divider type="vertical" />
                    <a href={`/classHourDetail?id=${record.id}&isEdit=1`}>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <Dropdown
                        menu={{
                            items: record.sessionList?.map((item) => ({
                                ...item,
                                label: `${item.id}-${item.name}`,
                                key: `${item.id}-${item.name}`
                            })),
                            selectable: true,
                            defaultSelectedKeys: [`${record.sessionId}-${record.sessionName}`],
                            onSelect: async ({ key }) => {
                                const [sessionId, sessionName] = key.split('-');
                                const { code } = await postUpdateCurSession({
                                    classHourId: record.id,
                                    sessionId: Number(sessionId),
                                    sessionName
                                });
                                if (isSuccessResponse(code)) {
                                    message.success('切换成功');
                                    actionRef.current?.reload();
                                }
                            }
                        }}
                    >
                        <Typography.Link>
                            <Space>
                            切换环节
                                <DownOutlined />
                            </Space>
                        </Typography.Link>
                    </Dropdown>
                    
                    <Divider type="vertical" />
                    <a
                        onClick={async () => {
                            confirm({
                                title: '请确认是否删除',
                                icon: <ExclamationCircleFilled />,
                                content: `即将删除课时：${record.name}`,
                                onOk: async () => {
                                    const response = await postDelClassHour({
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
                title: '课时列表',
            }}
        >
            <ProTable<ClassHoursApiInterface.ClassHour>
                headerTitle="课时列表"
                actionRef={actionRef}
                rowKey="id"
                toolBarRender={() => [
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => {
                            location.href = '/classHourDetail'
                        }}
                    >
                        新建
                    </Button>,
                ]}
                request={async (params) => {
                    const { data, message: msg, code } = await postGetClassHourList(params as LearningTaskApiInterface.postGetLearningTaskListParams);

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
                title="切换环节"
                width={420}
                open={createModalVisible}
                onCancel={() => handleModalVisible(false)}
                footer={null}
            >
                
                {/* <ProTable<LessonApiInterface.Lesson, LessonApiInterface.Lesson>
                    onSubmit={async (value) => {
                        console.log('value', value)
                        const response = formType === FORM_TYPE.CREATE_FORM ? await postAddLesson(value) : await postUpdateLesson({ ...defaultFormValue, ...value });
                        if (isSuccessResponse(response.code)) {
                            handleModalVisible(false);
                            message.success(formType === FORM_TYPE.CREATE_FORM ? '创建成功' : '更新成功');
                            actionRef.current?.reload();
                        }
                    }}
                    rowKey="id"
                    type="form"
                    form={{ initialValues: defaultFormValue }}
                    columns={columns}
                /> */}
            </Modal>
        </PageContainer>
    );
};

export default LearningTaskList;
