import { Funnel } from '@phosphor-icons/react'
import React, { useEffect } from 'react'

import { UserData } from 'entities/user'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Dropdown from 'theme/Dropdown'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { PositionSideEnum, PositionStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { POSITION_STATUS_TRANS } from 'utils/config/translations'

import { MainSectionState } from './MainSection'
import MenuCheckbox from './MenuCheckbox'
import MyCopyPositionTable, { historyTabColumns } from './MyCopyPositionTable'
import NoDataOrSelect from './NoDataOrSelect'
import SelectedTag from './SelectedTag'
import useSelectMultiple from './useSelectMultiple'

export default function PositionsTab({
  myProfile,
  selectedCopies,
  handleUnSelectCopies,
  selectedCopyMapping,
  handleSelectAllCopies,
  isLoadingOutsource,
}: {
  myProfile: UserData
  selectedCopies: string[]
  selectedCopyMapping: MainSectionState['selectedCopyMapping']
  handleUnSelectCopies: (id: string) => void
  handleSelectAllCopies?: () => void
  isLoadingOutsource?: boolean
}) {
  const { setSearchParams } = useSearchParams()
  const resetParams = () => {
    setSearchParams({ [URL_PARAM_KEYS.MY_PROFILE_HISTORY_PAGE]: null, [URL_PARAM_KEYS.MY_PROFILE_HISTORY_LIMIT]: null })
  }
  useEffect(() => {
    resetParams()
  }, [selectedCopies])
  const defaultSelectedStatus = [PositionStatusEnum.OPEN, PositionStatusEnum.CLOSE]
  const {
    selected: positionStatus,
    checkIsSelected: checkIsStatusChecked,
    handleToggleSelect: handleToggleStatus,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_POSITIONS_STATUS,
    defaultSelected: defaultSelectedStatus,
  })

  const defaultSelectedEntry = ['isLong', 'isShort']
  const {
    selected: positionEntry,
    checkIsSelected: checkIsEntryChecked,
    handleToggleSelect: handleToggleEntry,
  } = useSelectMultiple({
    paramKey: URL_PARAM_KEYS.MY_POSITIONS_ENTRY_STATUS,
    defaultSelected: defaultSelectedEntry,
  })
  if (!selectedCopies.length)
    return (
      <NoDataOrSelect
        type="noSelectCopies"
        actionButton={
          handleSelectAllCopies ? (
            <Button variant="primary" mt={3} onClick={handleSelectAllCopies} isLoading={isLoadingOutsource}>
              Select All Copies
            </Button>
          ) : null
        }
      />
    )
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'start', gap: 3, width: '100%', pt: 3, mb: 1, flexShrink: 0, px: 3 }}>
        <Flex sx={{ gap: 2, flex: '1', overflow: 'auto', pb: 2 }}>
          {selectedCopies.map((copyId) => {
            return (
              <SelectedTag
                key={copyId}
                title={selectedCopyMapping[copyId]?.title ?? ''}
                handleDelete={() => handleUnSelectCopies(copyId)}
              />
            )
          })}
        </Flex>
        <Dropdown
          buttonSx={{ p: 0, mt: 1, border: 'none', color: 'primary1', position: 'relative' }}
          menuSx={{ p: 3 }}
          hasArrow={false}
          menuDismissable
          dismissable={false}
          menu={
            <>
              <Type.Body mb={3}>Status</Type.Body>
              <MenuCheckbox
                checked={checkIsStatusChecked(PositionStatusEnum.OPEN)}
                onChange={() => handleToggleStatus({ status: PositionStatusEnum.OPEN })}
                title={POSITION_STATUS_TRANS[PositionStatusEnum.OPEN]}
                color="green3"
              />
              <Box mb={12} />
              <MenuCheckbox
                checked={checkIsStatusChecked(PositionStatusEnum.CLOSE)}
                onChange={() => handleToggleStatus({ status: PositionStatusEnum.CLOSE })}
                title={POSITION_STATUS_TRANS[PositionStatusEnum.CLOSE]}
                color="neutral3"
              />
              <Type.Body mt={24} mb={3}>
                Entry
              </Type.Body>
              <MenuCheckbox
                checked={checkIsEntryChecked('isLong')}
                onChange={() => {
                  resetParams()
                  handleToggleEntry({ status: 'isLong' })
                }}
                title={<Tag width={70} status={PositionSideEnum.LONG} />}
                color="green1"
              />
              <Box mb={3} />
              <MenuCheckbox
                checked={checkIsEntryChecked('isShort')}
                onChange={() => {
                  resetParams()
                  handleToggleEntry({ status: 'isShort' })
                }}
                title={<Tag width={70} status={PositionSideEnum.SHORT} />}
                color="red2"
              />
            </>
          }
        >
          <Funnel size={24} />
          <Box
            sx={{
              width: 16,
              height: 16,
              lineHeight: '16px',
              textAlign: 'center',
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              bg: 'red2',
              color: 'neutral1',
              borderRadius: '50%',
            }}
          >
            {positionStatus.length + positionEntry.length}
          </Box>
        </Dropdown>
      </Flex>
      {!!myProfile?.id && (
        <MyCopyPositionTable
          key={positionEntry.join('') + positionStatus.join('') + selectedCopies.join('')}
          pageParamKey={URL_PARAM_KEYS.MY_PROFILE_HISTORY_PAGE}
          limitParamKey={URL_PARAM_KEYS.MY_PROFILE_HISTORY_LIMIT}
          isInfiniteLoad={false}
          userId={myProfile.id}
          queryParams={{
            status: positionStatus.length === 1 ? positionStatus : undefined,
            isLong: positionEntry.length === 1 ? (positionEntry[0] === 'isLong' ? true : false) : undefined,
            copyTrades: selectedCopies,
          }}
          title="History"
          hideTitle
          tableSettings={historyTabColumns}
          defaultSortBy="status"
          tableHeadSx={{
            '& th:first-child': {
              pl: 3,
            },
            '& th': {
              pr: 3,
              border: 'none',
            },
          }}
          tableBodySx={{
            borderSpacing: ' 0px 4px',
            'td:first-child': {
              pl: 3,
            },
            '& td': {
              pr: 3,
              bg: 'neutral6',
            },
            '& tbody tr:hover td': {
              bg: 'neutral5',
            },
          }}
        />
      )}
    </Flex>
  )
}
