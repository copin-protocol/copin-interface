import { Trans } from '@lingui/macro'
import { ArrowLeft, ArrowSquareOut, MagnifyingGlass } from '@phosphor-icons/react'
import { useDebounce } from 'ahooks'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Input from 'theme/Input'
import RadioGroup from 'theme/RadioGroup'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

const TraderBookmark = ({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>()
  const [searchGroup, setSearchGroup] = useState<string>()
  const { bookmarks } = useTraderFavorites()
  const { bookmarkGroups, loadingBookmarkGroups } = useBotAlertContext()
  const { updateCustomAlert, submittingUpdate } = useCustomAlerts({
    onSuccess: () => {
      onSelect(selectedGroup as string)
    },
  })
  const debouncedSearchGroup = useDebounce(searchGroup, {
    wait: 300,
  })
  const groupOptions = useMemo(() => {
    return bookmarkGroups
      ?.filter(
        (alert) => !alert.enableAlert && alert.name?.toLowerCase().includes(debouncedSearchGroup?.toLowerCase() ?? '')
      )
      .map((alert) => {
        const traders = Object.keys(bookmarks).filter((key) => bookmarks[key].customAlertIds?.includes(alert.id))
        return {
          label: (
            <Flex sx={{ gap: 2, alignItems: 'center' }}>
              <Type.Caption>{alert.name}</Type.Caption>
              <Tag data-tooltip-id={`traders-bookmark-${alert.id}`}>{traders.length} Traders</Tag>
              {traders.length > 0 && (
                <Tooltip id={`traders-bookmark-${alert.id}`}>
                  <Box>
                    {traders.slice(0, 5).map((trader) => (
                      <AccountInfo
                        size={24}
                        isOpenPosition={false}
                        key={trader}
                        address={trader.split('-')[0]}
                        protocol={trader.split('-')[1] as ProtocolEnum}
                      />
                    ))}
                    {traders.length > 5 && (
                      <Tag bg="neutral5">
                        <Type.Caption color="neutral3">and {traders.length - 5} others</Type.Caption>
                      </Tag>
                    )}
                  </Box>
                </Tooltip>
              )}
            </Flex>
          ),
          value: alert.id,
        }
      })
  }, [bookmarkGroups, bookmarks, debouncedSearchGroup])

  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        p={8}
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      >
        <IconButton
          icon={<ArrowLeft size={20} />}
          size={20}
          variant="ghost"
          type="button"
          onClick={onBack}
          sx={{ p: 0 }}
        ></IconButton>
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Body sx={{ textTransform: 'uppercase' }}>
            <Trans>Unnotified Bookmark Groups</Trans>
          </Type.Body>
        </Flex>
        <Box width={20} />
      </Flex>
      <Flex px={12} pt={12} width="100%">
        <Input
          placeholder="Search Group"
          affix={<IconBox icon={<MagnifyingGlass size={16} />} />}
          block
          onChange={(e) => {
            setSearchGroup(e.target.value)
          }}
        />
      </Flex>

      {groupOptions?.length === 0 && !loadingBookmarkGroups && (
        <NoDataFound
          message={
            <Box>
              <Type.Caption>
                <Trans>No unnotified groups found.</Trans>
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <Trans>Create a new group in</Trans>
                  <Flex as={Link} to={ROUTES.BOOKMARKS.path} target="_blank" sx={{ gap: 1, alignItems: 'center' }}>
                    <Type.Caption>
                      <Trans>Bookmarks</Trans>
                    </Type.Caption>
                    <IconBox icon={<ArrowSquareOut size={14} />} />
                  </Flex>
                </Flex>
              </Type.Caption>
            </Box>
          }
        />
      )}

      <Box p={16} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {groupOptions && groupOptions?.length > 0 && (
          <RadioGroup
            options={groupOptions}
            direction="column"
            onChange={(value) => setSelectedGroup(value as string)}
          />
        )}
      </Box>
      <Flex justifyContent="end" mt="auto" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
        <Button
          variant="ghostPrimary"
          onClick={() => {
            if (!selectedGroup) return
            updateCustomAlert({ id: selectedGroup, data: { enableAlert: true, showAlert: true } })
          }}
          disabled={!selectedGroup || submittingUpdate}
        >
          <Trans>Enable</Trans>
        </Button>
      </Flex>
    </Flex>
  )
}

export default TraderBookmark
