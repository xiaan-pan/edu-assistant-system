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
import getUser from '@/utils/getUser';

const { confirm } = Modal;


const LearningTaskList: React.FC<unknown> = () => {
    const actionRef = useRef<ActionType>(null);
    const user = getUser();

    const columns: ProColumns<KnowledgePointTestApiInterface.KnowledgePointTest>[] = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 30
        },
        {
            title: '知识点',
            dataIndex: 'knowledgePoint',
            width: 100
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
                    <a href={`/knowledgePointTestDetail?id=${record.id}`}>
                        详情
                    </a>
                    <Divider type="vertical" />
                    <a href={`/knowledgePointTestDetail?id=${record.id}&isEdit=1`}>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={async () => {
                            confirm({
                                title: '请确认是否删除',
                                icon: <ExclamationCircleFilled />,
                                content: `即将删除知识点测试：${record.knowledgePoint}`,
                                onOk: async () => {
                                    const response = await postDelKnowledgePointTest({
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
                title: '知识点测试列表',
            }}
        >
            <ProTable<LearningTaskApiInterface.LearningTask>
                headerTitle="知识点测试列表"
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
                            location.href = '/knowledgePointTestDetail'
                        }}
                    >
                        新建
                    </Button>,
                ]}
                request={async (params) => {
                    console.log('params', params)
                    const { data, message: msg, code } = await postGetKnowledgePointTestList(params as LearningTaskApiInterface.postGetLearningTaskListParams);

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
