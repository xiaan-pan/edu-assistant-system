import services from '@/services/lessonApi';
import {
    ActionType,
    PageContainer,
    ProDescriptionsItemProps,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { isSuccessResponse } from '@/utils';
import { postUpdateLesson } from '@/services/lessonApi/lessonApi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import getUser from '@/utils/getUser';
import { useModel } from '@umijs/max';

const { confirm } = Modal;

const { postGetLessonList, postAddLesson, postDelLesson } =
    services.lessonApi;

enum FORM_TYPE {
    CREATE_FORM,
    UPDATE_FORM
};

const TableList: React.FC<unknown> = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>(null);
    const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.CREATE_FORM);
    const [defaultFormValue, setDefaultFormValue] = useState<Partial<LessonApiInterface.Lesson>>({});
    const user = getUser();

    const columns: ProDescriptionsItemProps<LessonApiInterface.Lesson>[] = [
        {
            title: '课堂名称',
            dataIndex: 'name',
            width: 140,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '名称为必填项',
                    },
                ],
            },
        },
        {
            title: '描述',
            dataIndex: 'description',
            valueType: 'textarea',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '名称为必填项',
                    },
                ],
            },
        },
        {
            title: '创建人',
            dataIndex: 'owner',
            valueType: 'text',
            formItemProps: {
                hidden: true
            },
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
            <ProTable<LessonApiInterface.Lesson>
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
                            setFormType(FORM_TYPE.CREATE_FORM);
                            setDefaultFormValue({});
                            handleModalVisible(true);
                        }}
                    >
                        新建
                    </Button>,
                ]}
                request={async (params) => {
                    console.log('params', params)
                    const { data, message: msg, code } = await postGetLessonList(params as LessonApiInterface.CommonTablePageParam);

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
            // rowSelection={{
            //     // onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            //     alwaysShowAlert: false
            // }}
            />
            <Modal
                destroyOnClose
                title="新建"
                width={420}
                open={createModalVisible}
                onCancel={() => handleModalVisible(false)}
                footer={null}
            >
                <ProTable<LessonApiInterface.Lesson, LessonApiInterface.Lesson>
                    onSubmit={async (value) => {
                        console.log('value', value)
                        value.owner = value.owner || user.username;
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
                />
            </Modal>
        </PageContainer>
    );
};

export default TableList;
