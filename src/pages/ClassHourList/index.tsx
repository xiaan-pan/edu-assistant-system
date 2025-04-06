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
import { postDelKnowledgePointTest, postGetKnowledgePointTestList } from '@/services/knowledgePointTestApi/knowledgePointTestApi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { postDelClassHour, postGetClassHourList } from '@/services/classHoursApi/classHoursApi';

const { confirm } = Modal;


const LearningTaskList: React.FC<unknown> = () => {
    const actionRef = useRef<ActionType>(null);

    const columns: ProColumns<ClassHoursApiInterface.ClassHour>[] = [
        {
            title: '课时名',
            dataIndex: 'name',
            width: 100
        },
        {
            title: '所属课堂',
            dataIndex: 'lessonName'
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            width: 140,
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
        </PageContainer>
    );
};

export default LearningTaskList;
