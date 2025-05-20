import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Accordion from 'theme/Accordion'
import { Box, Flex, Type } from 'theme/base'

const AccordionHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  padding: 16px 0;
`

const AccordionBody = styled(Type.Body)`
  padding: 0 0 24px;
  text-align: left;
  width: 100%;
  color: ${({ theme }) => theme.colors.neutral3};
`

interface FAQItem {
  question: React.ReactNode
  answer: React.ReactNode
  display: string[]
}

const faqItems: FAQItem[] = [
  {
    question: <Trans>What payment methods do you accept?</Trans>,
    answer: (
      <>
        <Trans>
          We use CoinPayments as our payment gateway, which allows you to pay using many different blockchains.
        </Trans>
      </>
    ),
    display: ['PRICING', 'MY_SUBSCRIPTION'],
  },
  {
    question: <Trans>Do you accept payment in crypto?</Trans>,
    answer: (
      <>
        <Trans>
          Yes, we do! We support payments in 3 cryptocurrencies through our payment gateway, including USDC, USDT and
          ETH.
        </Trans>
      </>
    ),
    display: ['PRICING', 'MY_SUBSCRIPTION'],
  },
  {
    question: <Trans>How do I change my subscription plan?</Trans>,
    answer: (
      <>
        <Trans>
          On Navbar, Go to User Menu &gt; My Subscription, then upgrade to the subscription you want. You can upgrade at
          any time, and the new features will be available immediately.
        </Trans>
      </>
    ),
    display: ['PRICING'],
  },
  {
    question: <Trans>What happens if I exceed my plan limits?</Trans>,
    answer: (
      <>
        <Trans>
          If you reach your plan&apos;s limits (such as API calls, watchlist traders, etc.), you&apos;ll receive a
          notification. You can either upgrade to a higher tier plan or wait until your limits reset in the next billing
          cycle.
        </Trans>
      </>
    ),
    display: ['PRICING', 'MY_SUBSCRIPTION'],
  },
  {
    question: <Trans>What happens when I upgrade my plan?</Trans>,
    answer: (
      <>
        <Trans>
          When you upgrade, the remaining value of your current plan is converted into extra time on the new plan, based
          on the price ratio. E.g. 6 months on a $299 plan = ~1.8 months on a $999 plan. Your new plan starts
          immediately.
        </Trans>
      </>
    ),
    display: ['MY_SUBSCRIPTION'],
  },
  {
    question: <Trans>What happens when I downgrade my plan?</Trans>,
    answer: (
      <>
        <Trans>
          When you downgrade, your current plan is canceled immediately. The new plan starts from the time of purchase,
          and the remaining time of previous plan will be added to the new plan.
        </Trans>
      </>
    ),
    display: ['MY_SUBSCRIPTION'],
  },
]

const FAQ: React.FC<{ displayCase?: 'PRICING' | 'MY_SUBSCRIPTION' }> = ({ displayCase = 'PRICING' }) => {
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set())

  const handleToggleAccordion = (index: number) => {
    const newOpenAccordions = new Set(openAccordions)

    if (newOpenAccordions.has(index)) {
      newOpenAccordions.delete(index)
    } else {
      newOpenAccordions.add(index)
    }

    setOpenAccordions(newOpenAccordions)
  }

  return (
    <Box mt={48} mb={24}>
      <Type.H3 textAlign="left" mb={12}>
        <Trans>FAQ</Trans>
      </Type.H3>

      {faqItems
        .filter((item) => item.display.includes(displayCase))
        .map((item, index) => (
          <Box sx={{ borderBottom: 'small', borderColor: 'neutral5' }} key={index}>
            <Accordion
              header={
                <AccordionHeader onClick={() => handleToggleAccordion(index)}>
                  <Type.Body width="100%" textAlign="left">
                    {item.question}
                  </Type.Body>
                </AccordionHeader>
              }
              body={<AccordionBody>{item.answer}</AccordionBody>}
              isOpen={openAccordions.has(index)}
              wrapperSx={{ padding: 0 }}
              headerWrapperSx={{ padding: 0 }}
            />
          </Box>
        ))}
    </Box>
  )
}

export default FAQ
