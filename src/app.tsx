// 运行时配置

import SilderFooter from "./components/SilderFooter";
import getUser from "./utils/getUser";
import icon from '@/assets/icon.jpg';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  const user = getUser(false);
  return { user };
}

export const layout = () => {
  return {
    logo: icon,
    menu: {
      locale: false
    },
    title: 'iStudy',

    rightRender: (props) => {
      return <SilderFooter {...props} />
    }
  };
};
