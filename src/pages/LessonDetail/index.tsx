import services from '@/services/lessonApi';
import {
    ActionType,
    PageContainer,
    ProDescriptionsItemProps,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Dropdown, message, Modal, Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { isSuccessResponse } from '@/utils';
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import getUser from '@/utils/getUser';
import { postGetClassHourList } from '@/services/classHoursApi/classHoursApi';
import { postUpdateClassHourInfo } from '@/services/lessonApi/lessonApi';

const { confirm } = Modal;

const { postGetLessonDetail, postDelLessonMembers, postAddLessonMembers } =
    services.lessonApi;

const LessonDetail: React.FC<unknown> = () => {
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>(null);
    const pageParams = useParams();
    const [menuList, setMenuList] = useState([]);
    const [classHourBySelected, setClassHourBySelected] = useState('');
    const user = getUser();

    const fetchData = async () => {
        const { code, data } = await postGetClassHourList({
            lessonId: Number(pageParams.id)
        });
        if (isSuccessResponse(code)) {
            setMenuList(data.list.map((item) => ({
                ...item,
                key: `${item.id}-${item.name}`,
                label: `${item.id}-${item.name}`,
            })));
        }
        
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: ProDescriptionsItemProps<LessonApiInterface.ClassMembers>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            formItemProps: {
                hidden: true
            },
        },
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
            <div style={{
                marginBottom: '20px',
                fontSize: '16px'
            }}>
                当前课时：
                <Dropdown
                    menu={{
                        items: menuList,
                        selectable: true,
                        onSelect: async ({ key }) => {
                            const [activedClassHourId, activedClassHourName] = key.split('-');
                            const { code } = await postUpdateClassHourInfo({
                                activedClassHourId: Number(activedClassHourId),
                                activedClassHourName,
                                lessonId: Number(pageParams.id)
                            });
                            if (isSuccessResponse(code)) {
                                message.success('更新成功');
                                setClassHourBySelected(key);
                            } else {
                                message.error('更新失败，请刷新重试');
                            }
                        }
                    }}
                >
                    <Typography.Link>
                        <Space>
                            { classHourBySelected || '请选择课时' }
                            <DownOutlined />
                        </Space>
                    </Typography.Link>
                </Dropdown>
            </div>
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
                        const { activedClassHourId, activedClassHourName } = data;
                        if (activedClassHourId > 0) {
                            setClassHourBySelected(`${activedClassHourId}-${activedClassHourName}`);
                        }
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
