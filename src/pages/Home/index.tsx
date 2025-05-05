import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import getUser from '@/utils/getUser';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
    const user = getUser();
  
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name='iStudy' />
      </div>
    </PageContainer>
  );
};

export default HomePage;
