export type PaginationProps = {
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
  hideArrows?: boolean
}
