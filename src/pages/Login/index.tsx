import { postLogin } from '@/services/demo/userApi';
import { isSuccessResponse } from '@/utils';
import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import icon from '@/assets/icon.jpg';
import background from '@/assets/background.jpg';

// type LoginType = 'phone' | 'account';
enum LoginType {
    admin = '0',
    user = '1'
}

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

const Page = () => {
    const [loginType, setLoginType] = useState<LoginType>(LoginType.user);
    const { token } = theme.useToken();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || "{}");
        if (Object.keys(user).length > 0) {
            message.success('用户已登录');
            setTimeout(() => {
                location.href = '/home';
            }, 500);
        }
    }, []);

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
            }}
        >
            <LoginFormPage
                backgroundImageUrl={background}
                logo={icon}
                title="iStudy"
                containerStyle={{
                    // backgroundColor: 'rgba(0, 0, 0,0.65)',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    backdropFilter: 'blur(4px)',
                }}
                subTitle="支持课堂即时反馈的辅助教育系统"
                onFinish={
                    async (formData: any) => {
                        // console.log(formData)
                        const response = await postLogin({
                            ...formData,
                            role: Number(loginType)
                        });
                        if (isSuccessResponse(response.code)) {
                            message.success(response.message);
                            localStorage.setItem('user', JSON.stringify(response.data));
                            location.href = '/home';
                        } else {
                            message.error(response.message);
                        }
                    }
                }
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                    </div>
                }
            >
                <Tabs
                    centered
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                >
                    <Tabs.TabPane key={LoginType.user} tab={'学生登录'} />
                    <Tabs.TabPane key={LoginType.admin} tab={'教师管理员登录'} />
                </Tabs>
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: (
                                <UserOutlined
                                    style={{
                                        color: token.colorText,
                                    }}
                                    className={'prefixIcon'}
                                />
                            ),
                        }}
                        placeholder={'请输入用户名'}
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: (
                                <LockOutlined
                                    style={{
                                        color: token.colorText,
                                    }}
                                    className={'prefixIcon'}
                                />
                            ),
                        }}
                        placeholder={'请输入密码'}
                        rules={[
                            {
                                required: true,
                                message: '请输入密码！',
                            },
                        ]}
                    />
            </LoginFormPage>
        </div>
    );
};

export default () => {
    return (
        <ProConfigProvider>
            <Page />
        </ProConfigProvider>
    );
};