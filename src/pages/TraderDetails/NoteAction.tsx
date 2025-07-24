import { Check, MagnifyingGlass, Pencil, Plus, Trash, X } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import isEqual from 'lodash/isEqual'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import {
  createTraderLabelApi,
  createTraderNoteApi,
  deleteTraderNoteApi,
  getAllNoteLabelsApi,
  getTraderLabelsApi,
  getTraderNoteCountApi,
  getTraderNotesApi,
} from 'apis/traderNoteApis'
import { AccountInfo } from 'components/@ui/AccountInfo'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ToastBody from 'components/@ui/ToastBody'
import TraderLabels from 'components/@ui/TraderLabels'
import { TraderNoteData } from 'entities/trader'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import Input, { Textarea } from 'theme/Input'
import InputField from 'theme/InputField'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import Popconfirm from 'theme/Popconfirm'
import Select from 'theme/Select'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { formatLocalDate } from 'utils/helpers/format'

const LABEL_MAX_LENGTH = 16

const NoteItem = ({
  note,
  searchTerms,
  userId,
  onDelete,
}: {
  note: TraderNoteData
  searchTerms?: string[]
  userId?: string
  onDelete: () => void
}) => {
  return (
    <Flex flexDirection="column" sx={{ gap: 2, pr: 2, mb: 2 }}>
      <Flex justifyContent="space-between" mt={3} sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 2 }} flex="1">
          <Box
            sx={{
              borderRadius: '50%',
              width: 8,
              height: 8,
              backgroundColor: 'transparent',
              border: 'small',
              borderColor: 'neutral3',
            }}
          ></Box>
          <Type.CaptionBold
            color="primary2"
            sx={{
              backgroundColor: searchTerms?.some((term) => note.username.toLowerCase().includes(term))
                ? themeColors.neutral4
                : 'transparent',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {note.username}
          </Type.CaptionBold>
        </Flex>
        <Type.Caption color="neutral3" width="150px" textAlign="right">
          {formatLocalDate(note.createdAt, DAYJS_FULL_DATE_FORMAT)}
        </Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2, alignItems: 'center', height: 'fit-content', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: '4px', height: '100%', width: '1px', bg: 'neutral5' }} />
        <Flex flex="1" sx={{ gap: 2, alignItems: 'center' }}>
          <Type.Caption sx={{ flex: 1, ml: 3, whiteSpace: 'pre-wrap' }}>
            {note.note.split(' ').map((word, index) => {
              // Check if word is a URL

              const isHighlighted = searchTerms && searchTerms.some((term) => word.toLowerCase().includes(term))
              const isTraderLink = word.startsWith('https://app.copin.io/trader/')

              if (isTraderLink) {
                const [, , , , address, protocol] = word.split('?')[0].split('/')

                return (
                  <Flex key={`${word}-${index}`} sx={{ alignItems: 'center' }}>
                    <AccountInfo
                      size={24}
                      isOpenPosition
                      address={address}
                      protocol={protocol.toUpperCase() as ProtocolEnum}
                      hasHover={false}
                      sx={{
                        backgroundColor: isHighlighted ? 'neutral4' : 'transparent',
                      }}
                    />
                    {index !== note.note.split(' ').length - 1 && ' '}
                  </Flex>
                )
              }
              const isUrl = /^(https?:\/\/|www\.)/i.test(word)
              if (isUrl) {
                const url = word.startsWith('www.') ? `https://${word}` : word
                return (
                  <span key={`${word}-${index}`}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: themeColors.neutral1,
                        textDecoration: 'underline',
                        backgroundColor: isHighlighted ? themeColors.neutral4 : 'transparent',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {word}
                    </a>
                    {index !== note.note.split(' ').length - 1 && ' '}
                  </span>
                )
              }

              return (
                <span key={`${word}-${index}`}>
                  {isHighlighted ? <span style={{ backgroundColor: themeColors.neutral4 }}>{word}</span> : word}
                  {index !== note.note.split(' ').length - 1 && ' '}
                </span>
              )
            })}
          </Type.Caption>
          {userId === note.userId && (
            <Popconfirm
              action={
                <IconButton
                  size={16}
                  type="button"
                  variant="ghostDanger"
                  icon={<Trash size={16} />}
                  sx={{ color: 'neutral3' }}
                />
              }
              title="Delete Note"
              description="Are you sure you want to delete this note?"
              confirmButtonProps={{
                variant: 'ghostDanger',
              }}
              onConfirm={() => {
                onDelete()
              }}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

const Labels = ({ account, protocol }: { account: string; protocol: ProtocolEnum }) => {
  const [creatingLabel, setCreatingLabel] = useState(false)
  const [newLabel, setNewLabel] = useState<string | undefined>(undefined)
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false)
  const refetchQueries = useRefetchQueries()
  const newLabelRef = useRef<HTMLInputElement>(null)
  const { data: allLabels, refetch: refetchAllLabels } = useQuery(QUERY_KEYS.GET_ALL_NOTE_LABELS, () =>
    getAllNoteLabelsApi()
  )
  const { data: labels, refetch: refetchLabels } = useQuery(
    [QUERY_KEYS.GET_TRADER_IF_LABELS, account, protocol],
    () => {
      return getTraderLabelsApi({ account, protocol, limit: 1, offset: 0 })
    },
    {
      enabled: !!account && !!protocol,
    }
  )

  const createLabelMutation = useMutation({
    mutationFn: createTraderLabelApi,
    onSuccess: () => {
      toast.success(<ToastBody title="Success" message="Updated labels successfully" />)
      setCreatingLabel(false)

      setNewLabel(undefined)
      refetchAllLabels()
      refetchLabels()
      setTimeout(() => {
        refetchQueries([QUERY_KEYS.GET_TRADER_DETAIL])
      }, 1000)
      if (newLabelRef.current) {
        newLabelRef.current.value = ''
      }
    },
  })

  const traderLabel = labels?.[0]

  const labelOptions = allLabels?.map((label) => ({
    label,
    value: label,
  }))

  useEffect(() => {
    if (traderLabel) {
      setSelectedLabels(traderLabel.labels.filter((label) => allLabels?.includes(label)))
    }
  }, [traderLabel, allLabels])

  const hasChangedLabels = useMemo(() => {
    return !isEqual(selectedLabels, traderLabel?.labels)
  }, [selectedLabels, traderLabel])

  if (!isEditingLabels) {
    return (
      <>
        <Box>
          <Flex flex="1" sx={{ gap: 1, alignItems: 'center' }}>
            <Type.Caption color="neutral2">IF Tags</Type.Caption>
            <ButtonWithIcon
              icon={<Pencil size={16} />}
              size="xs"
              variant="ghostPrimary"
              onClick={() => setIsEditingLabels(true)}
            >
              {traderLabel?.labels?.length ? 'Edit' : 'Add'}
            </ButtonWithIcon>
          </Flex>
          <Flex sx={{ flexWrap: 'wrap', gap: 2, mt: 2, mb: 3 }}>
            <TraderLabels
              labels={
                traderLabel?.labels?.map((label) => ({
                  key: label,
                  title: label,
                })) ?? []
              }
              isIF
              shouldShowTooltip={false}
            />
          </Flex>
        </Box>
        <Divider mb={16} />
      </>
    )
  }

  return (
    <>
      {!creatingLabel && (
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Type.Caption color="neutral2">Edit IF Tags</Type.Caption>

          <ButtonWithIcon
            icon={<Plus />}
            size="xs"
            variant="outline"
            sx={{ mb: 0 }}
            onClick={() => setCreatingLabel(true)}
          >
            New Label
          </ButtonWithIcon>
        </Flex>
      )}
      {creatingLabel ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!newLabel) return
            createLabelMutation.mutate({
              account,
              protocol,
              labels: [...(traderLabel?.labels || []), newLabel.trim()],
            })
          }}
        >
          <InputField
            block
            placeholder="Enter label name"
            ref={newLabelRef}
            label="New Labels"
            suffix={
              <Flex sx={{ gap: 2 }}>
                <IconButton
                  size={24}
                  type="submit"
                  disabled={!newLabel}
                  variant="ghostSuccess"
                  icon={<Check size={16} />}
                />
                <IconButton
                  size={24}
                  type="button"
                  variant="ghost"
                  icon={<X size={16} />}
                  onClick={() => {
                    setCreatingLabel(false)
                    setNewLabel(undefined)
                  }}
                />
              </Flex>
            }
            annotation={`${newLabel?.length ?? 0}/${LABEL_MAX_LENGTH}`}
            onChange={(event) => {
              if (event.target.value.length <= LABEL_MAX_LENGTH) {
                setNewLabel(event.target.value)
              } else {
                event.target.value = newLabel || ''
              }
            }}
          />
        </form>
      ) : labelOptions ? (
        <>
          <Select
            className="select-container if-tag-select pad-right-0"
            closeMenuOnSelect={false}
            options={labelOptions}
            value={labelOptions?.filter?.((option) => selectedLabels.includes(option.value))}
            onChange={(newValue: any) => {
              setSelectedLabels(newValue.map((option: any) => option.value))
            }}
            placeholder="Select labels"
            components={{
              DropdownIndicator: () => <div></div>,
            }}
            isClearable={false}
            isSearchable
            menuIsOpen={labelOptions.length === traderLabel?.labels?.length ? false : undefined}
            isMulti
          />
          <Flex sx={{ justifyContent: 'end', gap: 2, mt: 2 }}>
            {/* <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedLabels(traderLabel?.labels || [])}
              disabled={!hasChangedLabels}
            >
              Reset
            </Button> */}
            <Button variant="ghost" size="xs" onClick={() => setIsEditingLabels(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="xs"
              sx={{ width: 'fit-content' }}
              disabled={!hasChangedLabels}
              onClick={() => {
                createLabelMutation.mutate({
                  account,
                  protocol,
                  labels: selectedLabels,
                })
                setIsEditingLabels(false)
              }}
            >
              Save Labels
            </Button>
          </Flex>
        </>
      ) : (
        <Box height={32}></Box>
      )}
      <Divider my={16} />
    </>
  )
}

const NoteActionContent = ({ account, protocol }: { account: string; protocol: ProtocolEnum }) => {
  const { profile } = useAuthContext()
  const [searchText, setSearchText] = useState<string>('')
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('')
  const [hasNote, setHasNote] = useState<boolean>(false)
  const refetchQueries = useRefetchQueries()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const noteInputRef = useRef<HTMLTextAreaElement>(null)
  const {
    data: notes,
    refetch: refetchNotes,
    isLoading: isLoadingNotes,
  } = useQuery(
    [QUERY_KEYS.GET_TRADER_NOTES, account, protocol],
    () => {
      return getTraderNotesApi({
        account,
        protocol,
        limit: 1000,
        offset: 0,
      })
    },
    {
      enabled: !!account && !!protocol,
    }
  )

  const createNoteMutation = useMutation({
    mutationFn: createTraderNoteApi,
    onSuccess: () => {
      toast.success(<ToastBody title="Success" message="Created note successfully" />)
      setHasNote(false)
      if (noteInputRef.current) {
        noteInputRef.current.value = ''
      }
      refetchNotes()
      refetchQueries([QUERY_KEYS.GET_TRADER_NOTE_COUNT])
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: deleteTraderNoteApi,
    onSuccess: () => {
      toast.success(<ToastBody title="Success" message="Deleted note successfully" />)
      refetchNotes()
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchText])

  const searchTerms = debouncedSearchText === '' ? undefined : debouncedSearchText.trim().toLowerCase().split(' ')

  return (
    <Flex flexDirection="column" px={16} height="100%">
      <Labels account={account} protocol={protocol} />
      <Textarea
        ref={noteInputRef}
        placeholder="Enter note"
        rows={2}
        sx={{ flexDirection: 'column', alignItems: 'flex-end' }}
        block
        suffix={
          <Button
            size="xs"
            variant="primary"
            sx={{ width: 'fit-content' }}
            disabled={createNoteMutation.isLoading || !hasNote}
            isLoading={createNoteMutation.isLoading}
            onClick={() => {
              createNoteMutation.mutate({
                account,
                protocol,
                note: noteInputRef.current?.value || '',
              })
            }}
          >
            Save Note
          </Button>
        }
        onChange={(event) => {
          if (event.target.value === '') {
            if (hasNote) {
              setHasNote(false)
            }
          } else {
            if (!hasNote) {
              setHasNote(true)
            }
          }
        }}
      />
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2, mt: 3, width: '100%' }}>
        <Input
          ref={searchInputRef}
          placeholder="Search Notes"
          block
          sx={{ height: '34px' }}
          affix={<IconBox icon={<MagnifyingGlass size={16} />} />}
          suffix={
            searchText === '' ? undefined : (
              <IconBox
                icon={<X size={16} />}
                onClick={() => {
                  setSearchText('')
                  if (searchInputRef.current) {
                    searchInputRef.current.value = ''
                  }
                }}
              />
            )
          }
          onChange={(event) => {
            setSearchText(event.target.value)
          }}
        />
      </Flex>
      <Box>
        {!!notes &&
          notes
            .filter((note) => {
              if (searchTerms === undefined) return true
              const validNote = searchTerms.some((term) => note.note.toLowerCase().includes(term))
              const validUsername = searchTerms.some((term) => note.username.toLowerCase().includes(term))
              return validNote || validUsername
            })
            .map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                searchTerms={searchTerms}
                userId={profile?.id}
                onDelete={() => {
                  if (!note.id) return
                  deleteNoteMutation.mutate(note.id)
                }}
              />
            ))}
        {isLoadingNotes && <Loading />}
        {!isLoadingNotes && notes?.length === 0 && <NoDataFound message="No notes found" />}
      </Box>
    </Flex>
  )
}

const NoteAction = ({ account, protocol }: { account: string; protocol: ProtocolEnum }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { sm } = useResponsive()
  const { data: noteCount } = useQuery([QUERY_KEYS.GET_TRADER_NOTE_COUNT, account, protocol], () =>
    getTraderNoteCountApi({
      account,
      protocol,
    })
  )
  return (
    <div>
      <ButtonWithIcon
        variant={noteCount ? 'ghostPrimary' : 'ghost'}
        icon={<Pencil size={16} />}
        onClick={() => setIsOpen(true)}
      >
        Notes
        {!!noteCount && ` (${noteCount})`}
      </ButtonWithIcon>
      <Drawer
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        mode={sm ? 'right' : 'bottom'}
        headSx={{ px: 16 }}
        hasClose
        size={sm ? '500px' : '100svh'}
        zIndex={Z_INDEX.TOASTIFY}
        title={
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.BodyBold>Trader Notes</Type.BodyBold>
            <AccountInfo size={32} isOpenPosition address={account} protocol={protocol} hasHover={false} />
          </Flex>
        }
      >
        <NoteActionContent account={account} protocol={protocol} />
      </Drawer>
    </div>
  )
}

export default NoteAction
