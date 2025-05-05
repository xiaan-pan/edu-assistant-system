// @ts-ignore

import { request } from 'umi';

export async function postLogin(
    body: {
        username: string;
        password: string;
        role: number;
    },
    options?: { [key: string]: any },
) {
    return request<{
        code: number;
        message: string;
        data: {
            id: number;
            username: string;
            password: string;
            role: number;
        };
    }>('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}