// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Third-party Imports
import classnames from 'classnames'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Faqs = () => {
  const { t } = useDictionary()

  const faqsData = [
    {
      id: 'panel1',
      question: t('dms.frontPages.pricing.faq.items.0.question'),
      answer: t('dms.frontPages.pricing.faq.items.0.answer')
    },
    {
      id: 'panel2',
      question: t('dms.frontPages.pricing.faq.items.1.question'),
      answer: t('dms.frontPages.pricing.faq.items.1.answer'),
      defaultExpanded: true
    },
    {
      id: 'panel3',
      question: t('dms.frontPages.pricing.faq.items.2.question'),
      answer: t('dms.frontPages.pricing.faq.items.2.answer')
    },
    {
      id: 'panel4',
      question: t('dms.frontPages.pricing.faq.items.3.question'),
      answer: t('dms.frontPages.pricing.faq.items.3.answer')
    },
    {
      id: 'panel5',
      question: t('dms.frontPages.pricing.faq.items.4.question'),
      answer: t('dms.frontPages.pricing.faq.items.4.answer')
    }
  ]

  return (
    <section className={classnames('md:plb-[100px] plb-[50px]', frontCommonStyles.layoutSpacing)}>
      <div className='flex flex-col text-center gap-2 mbe-6'>
        <Typography variant='h4'>{t('dms.frontPages.pricing.faq.title')}</Typography>
        <Typography>{t('dms.frontPages.pricing.faq.subtitle')}</Typography>
      </div>
      <div>
        {faqsData.map((data, index) => {
          return (
            <Accordion key={index} defaultExpanded={data.defaultExpanded}>
              <AccordionSummary aria-controls={data.id + '-content'} id={data.id + '-header'} className='font-medium'>
                <Typography component='span'>{data.question}</Typography>
              </AccordionSummary>
              <AccordionDetails className='text-textSecondary'>{data.answer}</AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </section>
  )
}

export default Faqs
