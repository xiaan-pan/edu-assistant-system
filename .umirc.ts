import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: '@umijs/max',
    },
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/login',
            component: './Login',
            layout: false
        },
        {
            name: '首页',
            path: '/home',
            component: './Home',
        },
        {
            name: '课堂列表',
            path: '/lessonList',
            component: './LessonList',
            access: 'isAdmin',
        },
        {
            path: '/lessonDetail/:id',
            component: './LessonDetail',
            access: 'isAdmin',
        },
        {
            name: '课时列表',
            path: '/classHourList',
            component: './ClassHourList',
            access: 'isAdmin',
        },
        {
            path: '/classHourDetail',
            component: './ClassHourDetail',
            access: 'isAdmin',
        },
        {
            name: '学习任务单列表',
            path: '/learningTaskList',
            component: './LearningTaskList',
            access: 'isAdmin',
        },
        {
            name: '学习任务单',
            path: '/learningTask',
            component: './LearningTask',
            access: 'isUser',
        },
        {
            path: '/learningTaskDetail',
            component: './LearningTaskDetail',
            access: 'isAdmin',
        },
        {
            name: '知识点测试列表',
            path: '/knowledgePointTestList',
            component: './KnowledgePointTestList',
            access: 'isAdmin',
        },
        {
            name: '知识点小测',
            path: '/knowledgePointTest',
            component: './KnowledgePointTest',
            access: 'isUser',
        },
        {
            path: '/knowledgePointTestDetail',
            component: './KnowledgePointTestDetail',
            access: 'isAdmin',
        },
        // {
        //     name: '权限演示',
        //     path: '/access',
        //     component: './Access',
        // },
        // {
        //     name: ' CRUD 示例',
        //     path: '/table',
        //     component: './Table',
        // },
    ],
    npmClient: 'pnpm',
    plugins: [
        '@umijs/max-plugin-openapi'
    ],
    // openAPI: [
        // {
        //     requestLibPath: "import { request } from 'umi'",
        //     schemaPath: "http://127.0.0.1:4523/export/openapi/5?version=3.0",
        //     projectName: 'lessonApi',
        //     namespace: 'LessonApiInterface'
        // },
        // {
        //     requestLibPath: "import { request } from 'umi'",
        //     schemaPath: "http://127.0.0.1:4523/export/openapi/4?version=3.0",
        //     projectName: 'learningTaskApi',
        //     namespace: 'LearningTaskApiInterface'
        // },
        // {
        //     requestLibPath: "import { request } from 'umi'",
        //     schemaPath: "http://127.0.0.1:4523/export/openapi/6?version=3.0",
        //     projectName: 'knowledgePointTestApi',
        //     namespace: 'KnowledgePointTestApiInterface'
        // },
        // {
        //     requestLibPath: "import { request } from 'umi'",
        //     schemaPath: "http://127.0.0.1:4523/export/openapi/9?version=3.0",
        //     projectName: 'classHoursApi',
        //     namespace: 'ClassHoursApiInterface'
        // },
    // ],
    proxy: {
        "/api": { // 标识需要进行转换的请求的url
        //  "target": "http://127.0.0.1:4523/m1/999144-0-default", // 服务端域名
         "target": "http://127.0.0.1:3000/", // 服务端域名
         "changeOrigin": true, // 允许域名进行转换
        //  "pathRewrite": { "^/ci": ''}  // 将请求url里的ci去掉
        }
    }
      
});

