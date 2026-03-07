// MUI Imports
import IconButton from '@mui/material/IconButton'

const socialButtons = [
  { iconClass: 'tabler-brand-facebook-filled', className: 'text-facebook' },
  { iconClass: 'tabler-brand-twitter-filled', className: 'text-twitter' },
  { iconClass: 'tabler-brand-github-filled', className: 'text-textPrimary' },
  { iconClass: 'tabler-brand-google-filled', className: 'text-error' }
]

const AuthSocialButtons = () => {
  return (
    <div className='flex justify-center items-center gap-1.5'>
      {socialButtons.map(button => (
        <IconButton key={button.iconClass} className={button.className} size='small'>
          <i className={button.iconClass} />
        </IconButton>
      ))}
    </div>
  )
}

export default AuthSocialButtons
