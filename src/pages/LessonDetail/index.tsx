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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useParams } from '@umijs/max';

const { confirm } = Modal;

const { postGetLessonDetail, postDelLessonMembers, postAddLessonMembers } =
    services.lessonApi;

const LessonDetail: React.FC<unknown> = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>(null);
    const pageParams = useParams();

    const columns: ProDescriptionsItemProps<LessonApiInterface.ClassMembers>[] = [
        {
            title: '学号',
            dataIndex: 'memberNo',
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
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 60,
            render: (_, record) => (
                <>
                    <a
                        onClick={async () => {
                            confirm({
                                title: '请确认是否删除',
                                icon: <ExclamationCircleFilled />,
                                content: `即将删除课堂成员：${record.memberNo}`,
                                onOk: async () => {
                                    const response = await postDelLessonMembers({
                                        id: Number(pageParams.id),
                                        memberList: [record.memberNo]
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
                title: '课堂详情',
            }}
            breadcrumb={{
                items: [
                    {
                        href: '/lessonList',
                        title: '课堂列表'
                    },
                    {
                        href: location.href,
                        title: '课堂详情'
                    }
                ]
            }}
        >
            <ProTable<LessonApiInterface.ClassMembers>
                headerTitle="课堂成员"
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
                            handleModalVisible(true);
                        }}
                    >
                        新建
                    </Button>,
                ]}
                request={async () => {
                    const id = Number(pageParams.id);
                    const { data, message: msg, code } = await postGetLessonDetail({ id });
                    
                    if (isSuccessResponse(code)) {
                        return {
                            data: data.classMemberList || []
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
                <ProTable<LessonApiInterface.Lesson, LessonApiInterface.ClassMembers>
                    onSubmit={async (value) => {
                        console.log('value', value)
                        const response = await postAddLessonMembers({ id: Number(pageParams.id), memberList: [value.memberNo] });
                        if (isSuccessResponse(response.code)) {
                            handleModalVisible(false);
                            message.success('创建成功');
                            actionRef.current?.reload();
                        }
                    }}
                    rowKey="id"
                    type="form"
                    columns={columns}
                />
            </Modal>
        </PageContainer>
    );
};

export default LessonDetail;
