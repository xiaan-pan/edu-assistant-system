export default () => {
    // 在这里按照初始化数据定义项目中的权限，统一管理
    // 参考文档 https://umijs.org/docs/max/access
    // const canSeeAdmin = !!(
    //     initialState && initialState.name !== 'dontHaveAccess'
    // );
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 0;
    const isUser = user.role === 1;
    return {
        isAdmin,
        isUser,
        // canAccessRoute: (role: number) => {
        //     const user = JSON.parse(localStorage.getItem('user') || '{}');
        //     if (user) {
        //         return user.role === role;
        //     }
        //     return false;
        // },
    };
};
