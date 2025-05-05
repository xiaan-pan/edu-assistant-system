import React, { useEffect, useState } from 'react';
import { AliwangwangFilled, DownOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import { postGetLessonList } from '@/services/lessonApi/lessonApi';

export default function SilderFooter({
    user
}) {
    const [menuList, setMenuList] = useState([]);
    const [lessonBySelected, setLessonBySelected] = useState('');

    useEffect(async () => {
        const { data: { list: lessonList } } = await postGetLessonList({
            memberNo: user.username
        });
        setMenuList(lessonList.length > 0 ? lessonList.map((item) => ({
            ...item,
            key: `${item.id}-${item.name}`,
            label: `${item.id}-${item.name}`,
        })) : [{
            'label': '暂无课程',
            'key': '0',
            disabled: true,
        }]);
        const defaultLesson = localStorage.getItem('defaultLesson');
        if (defaultLesson) {
            setLessonBySelected(defaultLesson);
        }
    }, [user]);

    return (
        <div style={{
            width: '100%',
            paddingLeft: '12px',
            fontSize: '16px'
        }}>
            {user.role === 1 && (
                <div style={{
                    height: '25px',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    textWrap: 'nowrap',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    <PushpinFilled style={{ fontSize: '20px', marginRight: '5px', color: '#69b1ff' }} />
                    课堂：
                    <Dropdown
                        menu={{
                            items: menuList,
                            selectable: true,
                            defaultSelectedKeys: [lessonBySelected],
                            onSelect: ({ key }) => {
                                setLessonBySelected(key);
                                localStorage.setItem('defaultLesson', key);
                                location.reload();
                            }
                        }}
                    >
                        
                        <Typography.Link>
                            <Space>
                                { lessonBySelected.length > 8 ? lessonBySelected.slice(0, 8) + '...' : (lessonBySelected || '请选择课堂') }
                                <DownOutlined />
                            </Space>
                        </Typography.Link>
                    </Dropdown>
                </div>
            )}
            <div style={{
                height: '25px',
                display: 'flex',
                flexWrap: 'nowrap',
                textWrap: 'nowrap',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <AliwangwangFilled style={{ fontSize: '20px', marginRight: '5px', color: '#69b1ff' }} />
                用户：
                <Dropdown
                    menu={{
                        items: [{
                            label: '登出',
                            key: '1'
                        }],
                        selectable: true,
                        onSelect: ({ key }) => {
                            if (key === '1') {
                                localStorage.removeItem('user');
                                localStorage.removeItem('defaultLesson');
                                location.href = '/login';
                            }
                        }
                    }}
                >
                    <Typography.Link>
                        <Space>
                            { user.username }
                            <DownOutlined />
                        </Space>
                    </Typography.Link>
                </Dropdown>
            </div>
        </div>
    )
}