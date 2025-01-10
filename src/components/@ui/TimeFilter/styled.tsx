import styled from 'styled-components/macro'

// theme css file

const DateRangeWrapper = styled.div`
  .rdrCalendarWrapper {
    background: transparent;
  }
  .rdrMonthAndYearPickers select {
    -moz-appearance: none;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    padding: 10px 15px;
    border-radius: 4px;
    outline: 0;
    color: ${({ theme }) => theme.colors.neutral2}!important;
    cursor: pointer;
    text-align: center;
  }

  .rdrSelected,
  .rdrInRange,
  .rdrStartEdge,
  .rdrEndEdge {
    background: ${({ theme }) => theme.colors.primary1};
  }
  .rdrDayNumber span {
    color: ${({ theme }) => theme.colors.neutral2}!important;
  }
  .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
  .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
  .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span,
  .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span,
  .rdrInRange {
    color: ${({ theme }) => theme.colors.neutral8}!important;
  }
  .rdrDayPassive .rdrDayNumber span {
    color: ${({ theme }) => theme.colors.neutral4}!important;
  }
  .rdrMonthAndYearPickers select {
    border: 1px solid ${({ theme }) => theme.colors.neutral5};
  }
  .rdrNextPrevButton,
  .rdrNextPrevButton {
    background: ${({ theme }) => theme.colors.neutral6};
    border: 1px solid ${({ theme }) => theme.colors.neutral4};
  }
  .rdrPprevButton i {
    border-color: transparent ${({ theme }) => theme.colors.primary1} transparent transparent;
  }
  .rdrNextButton i {
    margin: 0 0 0 6px;
    border-color: transparent transparent transparent ${({ theme }) => theme.colors.primary1};
  }
  .rdrDateDisplayWrapper {
    background: ${({ theme }) => theme.colors.neutral5};
  }
  .rdrDateDisplayItemActive input {
    color: ${({ theme }) => theme.colors.neutral2}!important;
  }
  .rdrDateDisplayItem {
    background-color: ${({ theme }) => theme.colors.neutral7};
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.neutral4};
  }
  .rdrDayDisabled {
    background-color: ${({ theme }) => theme.colors.neutral7};
    .rdrDayNumber span {
      color: ${({ theme }) => theme.colors.neutral4}!important;
    }
  }
  .rdrDateInput.rdrDateDisplayItem input {
    font-size: 12px;
  }
`

export default DateRangeWrapper
