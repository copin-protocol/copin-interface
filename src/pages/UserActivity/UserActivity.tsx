import { XCircle } from '@phosphor-icons/react';
import { useResponsive } from 'ahooks';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getUserActivityLogsApi } from 'apis/activityLogApis';
import Container from 'components/@ui/Container';
import Table from 'components/@ui/Table';
import CopyTradePositionDetails from 'components/CopyTradePositionDetails';
import useIsMobile from 'hooks/helpers/useIsMobile';
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange';
import IconButton from 'theme/Buttons/IconButton';
import Drawer from 'theme/Modal/Drawer';
import { PaginationWithLimit } from 'theme/Pagination';
import { Box, Flex } from 'theme/base';
import { DEFAULT_LIMIT } from 'utils/config/constants';
import { QUERY_KEYS } from 'utils/config/keys';
import { pageToOffset } from 'utils/helpers/transform';
import ListActivityMobile from './ListActivityMobile';
import { CopySelection, ExternalSource, userActivityColumns } from './configs';


export default function UserActivity() {
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  });
  const { data, isFetching } = useQuery([QUERY_KEYS.GET_USER_ACTIVITY_LOGS, currentPage, currentLimit], () => getUserActivityLogsApi({ limit: currentLimit, offset: pageToOffset(currentPage, currentLimit) })
  );
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false);
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopySelection>();
  const handleSelectCopyItem = async (data: CopySelection) => {
    setCurrentCopyPosition(data);
    setOpenCopyDrawer(true);
  };
  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false);
    setCurrentCopyPosition(undefined);
  };
  const externalSource: ExternalSource = {
    handleSelectCopyItem,
  };
  const isMobile = useIsMobile();
  const { lg } = useResponsive();
  return (
    <>
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
          {lg ? (
            <Table
              data={data?.data}
              restrictHeight
              columns={userActivityColumns}
              isLoading={isFetching}
              externalSource={externalSource}
              wrapperSx={{ 'table': { borderSpacing: '8px 0' }, '& tbody tr': { bg: 'neutral6' } }} />
          ) : (
            <ListActivityMobile data={data?.data} isLoading={isFetching} externalSource={externalSource} />
          )}
        </Box>
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={data?.meta} />
      </Flex>
      {openCopyDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openCopyDrawer}
          onDismiss={handleCopyDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral5"
        >
          <Container sx={{ position: 'relative', height: '100%' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
              onClick={handleCopyDismiss} />
            <CopyTradePositionDetails id={currentCopyPosition?.id ?? ''} />
          </Container>
        </Drawer>
      )}
    </>
  );
}
