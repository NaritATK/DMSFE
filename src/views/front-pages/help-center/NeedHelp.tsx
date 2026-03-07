// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Hooks
import { useDictionary } from '@/hooks/useDictionary'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const NeedHelp = () => {
  const { t } = useDictionary()

  return (
    <section
      className={classnames(
        'flex flex-col justify-center items-center gap-4 md:plb-[100px] plb-[50px]',
        frontCommonStyles.layoutSpacing
      )}
    >
      <Typography variant='h4' className='text-center'>
        {t('dms.frontPages.helpCenter.needHelp.title')}
      </Typography>
      <Typography className='text-center'>{t('dms.frontPages.helpCenter.needHelp.subtitle')}</Typography>
      <div className='flex flex-wrap items-center justify-center gap-4'>
        <Button variant='contained'>{t('dms.frontPages.helpCenter.needHelp.communityCta')}</Button>
        <Button variant='contained'>{t('dms.frontPages.helpCenter.needHelp.contactCta')}</Button>
      </div>
    </section>
  )
}

export default NeedHelp
