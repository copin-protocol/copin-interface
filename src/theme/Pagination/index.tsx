import { CaretCircleLeft, CaretCircleRight, CaretLeft, CaretRight, DotsThree } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { ApiMeta } from 'apis/api'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Input from 'theme/Input'
import { DOTS, usePagination } from 'theme/Pagination/usePagination'
import { Box, Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { DEFAULT_LIMIT_VALUES } from 'utils/config/constants'

export type PaginationProps = {
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
  hideArrows?: boolean
}

const DottedButton = styled(ButtonWithIcon)`
  padding: 4px;
  border: none;
  width: 24px;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: auto;
  pointer-events: none;

  background-color: transparent;

  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: transparent;
    & > div:first-child svg {
      opacity: 0;
    }
    & > :not(:first-child) {
      opacity: 1;
    }
  }
  & > :not(:first-child) {
    transition: all 0.2s ease-in-out;

    opacity: 0;
    position: absolute;
    top: 10px;
    right: 12px;
  }
`

const Pagination = ({
  currentPage,
  totalPage,
  onPageChange,
  siblingCount = 1 /*, hideArrows = false */,
  ...props
}: PaginationProps & BoxProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalPage,
    siblingCount,
  })

  const handleOnClick = (page: number) => {
    onPageChange(page)
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const lastPage = paginationRange[paginationRange.length - 1]

  if (totalPage <= 1) return <></>

  return (
    <Flex {...props}>
      <IconButton
        icon={<CaretLeft size={24} />}
        mr={1}
        borderRadius="md"
        size={24}
        sx={{
          px: 1,
          py: '4px',
          borderRadius: '4px',
          '&[disable]': {
            opacity: 0.5,
          },
          color: 'neutral1',
        }}
        disabled={currentPage === 1}
        onClick={onPrevious}
      />
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return <DottedButton key={`${DOTS}${i + 1}`} icon={<DotsThree size={14} />} sx={{ color: 'neutral6' }} />
        }

        return (
          <Button
            key={pageNumber}
            onClick={() => handleOnClick(Number(pageNumber))}
            size="xs"
            type="button"
            mr={1}
            p={1}
            sx={{
              border: 'none',
              bg: 'neutral6',
              borderRadius: '4px',
              minWidth: 24,
              color: pageNumber === currentPage ? 'neutral1' : 'neutral3',
              fontWeight: pageNumber === currentPage ? '600' : '400',
              fontSize: '13px',
            }}
          >
            {pageNumber}
          </Button>
        )
      })}
      <IconButton
        icon={<CaretRight size={24} />}
        borderRadius="md"
        size={24}
        sx={{
          px: 1,
          py: '4px',
          borderRadius: '4px',
          '&[disable]': {
            opacity: 0.5,
          },
          color: 'neutral1',
        }}
        disabled={!lastPage || currentPage === lastPage}
        onClick={onNext}
      />
    </Flex>
  )
}

export default Pagination

export function PaginationWithLimit({
  currentPage,
  currentLimit,
  onPageChange,
  onLimitChange,
  defaultLimit,
  apiMeta,
  menuPosition,
  ...props
}: {
  currentPage: number
  currentLimit: number
  defaultLimit?: number | number[]
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  apiMeta?: ApiMeta
  menuPosition?: 'top' | 'bottom'
} & BoxProps) {
  const { lg } = useResponsive()
  const { total = 0, totalPages = 0 } = apiMeta ?? {}
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.value = currentPage.toString()
  }, [currentPage])

  if (totalPages === 0) return <></>
  const { sx = {}, ...rest } = props ?? {}

  const limitValues =
    defaultLimit != null
      ? typeof defaultLimit === 'number'
        ? Array.from({ length: 3 }, (_, v) => Math.pow(2, v) * defaultLimit)
        : defaultLimit
      : DEFAULT_LIMIT_VALUES

  return (
    <Flex
      sx={{ columnGap: [1, 1, 2], rowGap: 2, alignItems: 'center', justifyContent: 'space-between', px: 2, ...sx }}
      {...rest}
    >
      <Flex sx={{ gap: [1, 1, 2], alignItems: 'center' }}>
        <Type.Caption>Per page</Type.Caption>
        <Dropdown
          menuPosition={menuPosition}
          buttonSx={{
            border: 'small',
            bg: 'neutral6',
            height: 32,
            py: 8,
            borderColor: 'transparent',
            px: [1, 1, 1, 1, 2],
          }}
          iconSize={12}
          menuSx={{ minWidth: 'auto', width: '52px', bg: 'neutral8' }}
          menu={
            <>
              {limitValues.map((v) => {
                return (
                  <DropdownItem
                    key={v}
                    role="button"
                    onClick={() => onLimitChange(v)}
                    sx={{ py: '4px !important', color: 'neutral1' }}
                    isActive={v === currentLimit}
                  >
                    {v}
                  </DropdownItem>
                )
              })}
            </>
          }
        >
          <Type.Caption>{currentLimit}</Type.Caption>
        </Dropdown>
        <Type.Caption>of {total} records</Type.Caption>
      </Flex>
      <Box display={['none', 'none', 'block']} sx={{ flexShrink: 0, width: '1px', height: 32, bg: 'neutral6' }} />
      <PaginationWithSelect
        currentPage={currentPage}
        apiMeta={apiMeta}
        onPageChange={onPageChange}
        disabledInput={!lg}
      />
    </Flex>
  )
}

export function PaginationWithSelect({
  currentPage,
  onPageChange,
  apiMeta,
  sx = {},
  disabledInput = false,
}: {
  currentPage: number
  onPageChange: (page: number) => void
  apiMeta?: ApiMeta
  sx?: any
  disabledInput?: boolean
}) {
  const { totalPages = 0 } = apiMeta ?? {}
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.value = currentPage.toString()
  }, [currentPage])

  if (totalPages === 0) return <></>

  return (
    <Flex sx={{ gap: [1, 1, 2, 2, 2], alignItems: 'center', ...sx }}>
      {!disabledInput && (
        <>
          <Type.Caption>Go to page</Type.Caption>
          <Input
            ref={inputRef}
            type="number"
            sx={{
              lineHeight: '16px',
              width: '40px',
              height: '32px',
              py: 0,
              px: [1, 1, 2, 2, 2],
              bg: 'neutral6',
              borderColor: 'transparent',
            }}
            // value={currentPage}
            disabled={!totalPages || totalPages === 1}
            defaultValue={currentPage}
            onBlur={(e) => {
              e.target.value = currentPage.toString()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                let newPage = 1
                const input = e.target as HTMLInputElement
                const value = Number(input.value)
                if (isNaN(value)) return
                if (value % 1 !== 0) return
                newPage = value
                if (value < 1) newPage = 1
                if (value > totalPages) newPage = totalPages
                onPageChange(newPage)
                setTimeout(() => input.blur(), 0)
              }
            }}
          />
        </>
      )}
      <Flex
        sx={{
          height: '32px',
          alignItems: 'center',
          gap: [1, 2],
          px: [1, 2],
          bg: 'neutral6',
          border: 'small',
          borderColor: 'transparent',
          borderRadius: 'sm',
          '&:hover': {
            borderColor: 'neutral3',
          },
        }}
      >
        <IconButton
          icon={<CaretCircleLeft size={20} weight="thin" />}
          borderRadius="md"
          size={20}
          variant="ghost"
          sx={{ p: 0, borderRadius: '50%' }}
          disabled={!totalPages || currentPage === 1}
          onClick={() => onPageChange(currentPage === 1 ? 1 : currentPage - 1)}
        />
        <Type.Caption>
          {currentPage}/{totalPages}
        </Type.Caption>
        <IconButton
          icon={<CaretCircleRight size={20} weight="thin" />}
          borderRadius="md"
          size={20}
          variant="ghost"
          sx={{ p: 0, borderRadius: '50%' }}
          disabled={!totalPages || currentPage === totalPages}
          onClick={() => onPageChange(currentPage === totalPages ? totalPages : currentPage + 1)}
        />
      </Flex>
    </Flex>
  )
}
