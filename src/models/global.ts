// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import getUser from '@/utils/getUser';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  // const user = getUser();
  return {
    // user,
    name,
    setName,
  };
};

export default useUser;
