import { Trans } from '@lingui/macro'
import { CopySimple, DotsThreeOutlineVertical, PencilSimpleLine, Trash, Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useReducer, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsApi } from 'apis/copyTradeApis'
import SectionTitle from 'components/@ui/SectionTitle'
import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import CopyTradeCloneDrawer from 'components/CopyTradeCloneDrawer'
import CopyTradeEditDrawer from 'components/CopyTradeEditDrawer'
import DeleteCopyTradeModal from 'components/CopyTradeForm/DeleteCopyTradeModal'
import { CopyTradeData } from 'entities/copyTrade.d'
import { UserData } from 'entities/user'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import usePageChange from 'hooks/helpers/usePageChange'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Pagination from 'theme/Pagination'
import Tag from 'theme/Tag'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'

import { renderTrader } from './renderProps'

export default function MyCopiesTable({ myProfile }: { myProfile: UserData }) {
  const hasCopyPermission = useCopyTradePermission()
  const [newSession, setNewSession] = useReducer((prev) => prev + 1, 0)
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'copies-page' })
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, currentPage, newSession],
    () =>
      getCopyTradeSettingsApi({
        limit: 1000,
        offset: pageToOffset(currentPage, 1000),
        userId: myProfile.id ?? '',
      }),
    { enabled: !!myProfile.id && hasCopyPermission, retry: 0, keepPreviousData: true }
  )
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openCloneDrawer, setOpenCloneDrawer] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const copyTradeData = useRef<CopyTradeData>()

  const onSelect = (data?: CopyTradeData) => {
    copyTradeData.current = data
  }

  const handleCloseDrawer = () => {
    onSelect(undefined)
    setOpenDrawer(false)
  }

  const handleCloseCloneDrawer = () => {
    onSelect(undefined)
    setOpenCloneDrawer(false)
  }

  const handleCloseDeleteModal = () => {
    onSelect(undefined)
    setOpenDeleteModal(false)
  }

  const columns = useMemo(() => {
    const handleOpenDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDrawer(true)
    }

    const handleOpenCloneDrawer = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenCloneDrawer(true)
    }

    const handleOpenDeleteModal = (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDeleteModal(true)
    }

    const result: ColumnData<CopyTradeData>[] = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '100px' },
        render: (item) => (
          <Type.Caption maxWidth={100} color="neutral1" sx={{ ...overflowEllipsis(), display: 'block' }}>
            {item.title ? item.title : '--'}
          </Type.Caption>
        ),
      },
      {
        title: 'Address',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '120px' },
        render: (item) => renderTrader({ protocol: item.protocol, address: item.account }),
      },
      {
        title: 'Balance',
        dataIndex: 'bingXBalance',
        key: 'bingXBalance',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Type.Caption color="neutral1">{formatNumber(item.bingXBalance)}$</Type.Caption>,
      },
      {
        title: 'Vol/Order',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Type.Caption color="neutral1">{formatNumber(item.volume)}$</Type.Caption>,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Type.Caption color="neutral1">x{formatNumber(item.leverage)}</Type.Caption>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '100px', paddingLeft: '24px' },
        render: (item) => <Tag width={70} status={item.status} bg="neutral5" />,
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', textAlign: 'right' },
        render: (item) => (
          <Flex justifyContent="end">
            <Dropdown
              hasArrow={false}
              menuSx={{
                bg: 'neutral7',
                width: 100,
              }}
              menu={
                <>
                  <ActionItem
                    title={<Trans>Edit</Trans>}
                    icon={<PencilSimpleLine size={18} />}
                    onSelect={() => handleOpenDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Clone</Trans>}
                    icon={<CopySimple size={18} />}
                    onSelect={() => handleOpenCloneDrawer(item)}
                  />
                  <ActionItem
                    title={<Trans>Remove</Trans>}
                    icon={<Trash size={18} />}
                    onSelect={() => handleOpenDeleteModal(item)}
                  />
                </>
              }
              sx={{}}
              buttonSx={{
                border: 'none',
                height: '100%',
                p: 0,
                // '&:hover,&:focus,&:active': {
                //   bg: 'neutral7',
                // },
              }}
              placement="topRight"
            >
              <IconButton
                size={24}
                type="button"
                icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
                variant="ghost"
                sx={{
                  color: 'neutral3',
                }}
              />
            </Dropdown>
          </Flex>
        ),
      },
    ]
    return result
  }, [])

  const { xl } = useResponsive()

  return (
    <>
      <Box px={12} pt={16}>
        <SectionTitle icon={<Users size={24} />} title="Copies Details" />
      </Box>
      <Box flex="1" overflowX="auto" overflowY="hidden" height={{ _: 'auto', xl: '100%' }} pb={{ _: 12, xl: 0 }}>
        <Table
          restrictHeight={xl}
          data={data?.data}
          columns={columns}
          isLoading={isLoading}
          footer={
            <Pagination
              totalPage={data?.meta?.totalPages ?? 0}
              currentPage={currentPage}
              onPageChange={changeCurrentPage}
            />
          }
        />
      </Box>

      {openDrawer && (
        <CopyTradeEditDrawer
          isOpen={openDrawer}
          onDismiss={handleCloseDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={() => setNewSession()}
        />
      )}
      {openCloneDrawer && (
        <CopyTradeCloneDrawer
          isOpen={openCloneDrawer}
          onDismiss={handleCloseCloneDrawer}
          copyTradeData={copyTradeData.current}
          onSuccess={() => setNewSession()}
        />
      )}
      {openDeleteModal && (
        <DeleteCopyTradeModal
          copyTradeId={copyTradeData.current?.id}
          account={copyTradeData.current?.account}
          onDismiss={handleCloseDeleteModal}
          onSuccess={() => setNewSession()}
        />
      )}
    </>
  )
}

function ActionItem({
  title,
  icon,
  onSelect,
}: {
  title: ReactNode
  icon: ReactNode
  onSelect: (data?: CopyTradeData) => void
}) {
  return (
    <DropdownItem onClick={() => onSelect()}>
      <Flex alignItems="center" sx={{ gap: 10 }}>
        <IconBox icon={icon} color="neutral3" />
        <Type.Caption>{title}</Type.Caption>
      </Flex>
    </DropdownItem>
  )
}
