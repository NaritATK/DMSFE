// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'
import CustomChip from '@core/components/mui/Chip'

// import { GenerateHorizontalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/horizontalMenuData'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const params = useParams()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const navDict = dictionary['navigation'] as any

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor: 'var(--mui-palette-background-paper)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <SubMenu label={(navDict as any).dashboards} icon={<i className='tabler-smart-home' />}>
          <MenuItem href={`/${locale}/dashboards/crm`} icon={<i className='tabler-chart-pie-2' />}>
            {navDict.crm}
          </MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`} icon={<i className='tabler-trending-up' />}>
            {navDict.analytics}
          </MenuItem>
          <MenuItem href={`/${locale}/dashboards/ecommerce`} icon={<i className='tabler-shopping-cart' />}>
            {navDict.eCommerce}
          </MenuItem>
          <MenuItem href={`/${locale}/dashboards/academy`} icon={<i className='tabler-school' />}>
            {navDict.academy}
          </MenuItem>
          <MenuItem href={`/${locale}/dashboards/logistics`} icon={<i className='tabler-truck' />}>
            {navDict.logistics}
          </MenuItem>
        </SubMenu>
        <SubMenu label={navDict.apps} icon={<i className='tabler-mail' />}>
          <SubMenu label={navDict.eCommerce} icon={<i className='tabler-shopping-cart' />}>
            <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{navDict.dashboard}</MenuItem>
            <SubMenu label={navDict.products}>
              <MenuItem href={`/${locale}/apps/ecommerce/products/list`}>{navDict.list}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/add`}>{navDict.add}</MenuItem>
              <MenuItem href={`/${locale}/apps/ecommerce/products/category`}>
                {navDict.category}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.orders}>
              <MenuItem href={`/${locale}/apps/ecommerce/orders/list`}>{navDict.list}</MenuItem>
              <MenuItem
                href={`/${locale}/apps/ecommerce/orders/details/5434`}
                exactMatch={false}
                activeUrl='/apps/ecommerce/orders/details'
              >
                {navDict.details}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.customers}>
              <MenuItem href={`/${locale}/apps/ecommerce/customers/list`}>{navDict.list}</MenuItem>
              <MenuItem
                href={`/${locale}/apps/ecommerce/customers/details/879861`}
                exactMatch={false}
                activeUrl='/apps/ecommerce/customers/details'
              >
                {navDict.details}
              </MenuItem>
            </SubMenu>
            <MenuItem href={`/${locale}/apps/ecommerce/manage-reviews`}>
              {navDict.manageReviews}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/ecommerce/referrals`}>{navDict.referrals}</MenuItem>
            <MenuItem href={`/${locale}/apps/ecommerce/settings`}>{navDict.settings}</MenuItem>
          </SubMenu>
          <SubMenu label={navDict.academy} icon={<i className='tabler-school' />}>
            <MenuItem href={`/${locale}/apps/academy/dashboard`}>{navDict.dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/my-courses`}>{navDict.myCourses}</MenuItem>
            <MenuItem href={`/${locale}/apps/academy/course-details`}>
              {navDict.courseDetails}
            </MenuItem>
          </SubMenu>
          <SubMenu label={navDict.logistics} icon={<i className='tabler-truck' />}>
            <MenuItem href={`/${locale}/apps/logistics/dashboard`}>{navDict.dashboard}</MenuItem>
            <MenuItem href={`/${locale}/apps/logistics/fleet`}>{navDict.fleet}</MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/email`}
            icon={<i className='tabler-mail' />}
            exactMatch={false}
            activeUrl='/apps/email'
          >
            {navDict.email}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/chat`} icon={<i className='tabler-message-circle-2' />}>
            {navDict.chat}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/calendar`} icon={<i className='tabler-calendar' />}>
            {navDict.calendar}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/kanban`} icon={<i className='tabler-copy' />}>
            {navDict.kanban}
          </MenuItem>
          <SubMenu label={navDict.invoice} icon={<i className='tabler-file-description' />}>
            <MenuItem href={`/${locale}/apps/invoice/list`}>{navDict.list}</MenuItem>
            <MenuItem
              href={`/${locale}/apps/invoice/preview/4987`}
              exactMatch={false}
              activeUrl='/apps/invoice/preview'
            >
              {navDict.preview}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/edit/4987`} exactMatch={false} activeUrl='/apps/invoice/edit'>
              {navDict.edit}
            </MenuItem>
            <MenuItem href={`/${locale}/apps/invoice/add`}>{navDict.add}</MenuItem>
          </SubMenu>
          <SubMenu label={navDict.user} icon={<i className='tabler-user' />}>
            <MenuItem href={`/${locale}/apps/user/list`}>{navDict.list}</MenuItem>
            <MenuItem href={`/${locale}/apps/user/view`}>{navDict.view}</MenuItem>
          </SubMenu>
          <SubMenu label={navDict.rolesPermissions} icon={<i className='tabler-lock' />}>
            <MenuItem href={`/${locale}/apps/roles`}>{navDict.roles}</MenuItem>
            <MenuItem href={`/${locale}/apps/permissions`}>{navDict.permissions}</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu label={navDict.pages} icon={<i className='tabler-file' />}>
          <MenuItem href={`/${locale}/pages/user-profile`} icon={<i className='tabler-user-circle' />}>
            {navDict.userProfile}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/account-settings`} icon={<i className='tabler-settings' />}>
            {navDict.accountSettings}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/faq`} icon={<i className='tabler-help-circle' />}>
            {navDict.faq}
          </MenuItem>
          <MenuItem href={`/${locale}/pages/pricing`} icon={<i className='tabler-currency-dollar' />}>
            {navDict.pricing}
          </MenuItem>
          <SubMenu label={navDict.miscellaneous} icon={<i className='tabler-file-info' />}>
            <MenuItem href={`/${locale}/pages/misc/coming-soon`} target='_blank'>
              {navDict.comingSoon}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/misc/under-maintenance`} target='_blank'>
              {navDict.underMaintenance}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/misc/404-not-found`} target='_blank'>
              {navDict.pageNotFound404}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/misc/401-not-authorized`} target='_blank'>
              {navDict.notAuthorized401}
            </MenuItem>
          </SubMenu>
          <SubMenu label={navDict.authPages} icon={<i className='tabler-shield-lock' />}>
            <SubMenu label={navDict.login}>
              <MenuItem href={`/${locale}/pages/auth/login-v1`} target='_blank'>
                {navDict.loginV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/login-v2`} target='_blank'>
                {navDict.loginV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.register}>
              <MenuItem href={`/${locale}/pages/auth/register-v1`} target='_blank'>
                {navDict.registerV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-v2`} target='_blank'>
                {navDict.registerV2}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/register-multi-steps`} target='_blank'>
                {navDict.registerMultiSteps}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.verifyEmail}>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v1`} target='_blank'>
                {navDict.verifyEmailV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/verify-email-v2`} target='_blank'>
                {navDict.verifyEmailV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.forgotPassword}>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v1`} target='_blank'>
                {navDict.forgotPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/forgot-password-v2`} target='_blank'>
                {navDict.forgotPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.resetPassword}>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v1`} target='_blank'>
                {navDict.resetPasswordV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/reset-password-v2`} target='_blank'>
                {navDict.resetPasswordV2}
              </MenuItem>
            </SubMenu>
            <SubMenu label={navDict.twoSteps}>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v1`} target='_blank'>
                {navDict.twoStepsV1}
              </MenuItem>
              <MenuItem href={`/${locale}/pages/auth/two-steps-v2`} target='_blank'>
                {navDict.twoStepsV2}
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label={navDict.wizardExamples} icon={<i className='tabler-dots' />}>
            <MenuItem href={`/${locale}/pages/wizard-examples/checkout`}>{navDict.checkout}</MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/property-listing`}>
              {navDict.propertyListing}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/wizard-examples/create-deal`}>
              {navDict.createDeal}
            </MenuItem>
          </SubMenu>
          <MenuItem href={`/${locale}/pages/dialog-examples`} icon={<i className='tabler-square' />}>
            {navDict.dialogExamples}
          </MenuItem>
          <SubMenu label={navDict.widgetExamples} icon={<i className='tabler-chart-bar' />}>
            <MenuItem href={`/${locale}/pages/widget-examples/basic`}>{navDict.basic}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/advanced`}>{navDict.advanced}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/statistics`}>
              {navDict.statistics}
            </MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/charts`}>{navDict.charts}</MenuItem>
            <MenuItem href={`/${locale}/pages/widget-examples/actions`}>{navDict.actions}</MenuItem>
          </SubMenu>

        </SubMenu>
        <SubMenu label={navDict.formsAndTables} icon={<i className='tabler-file-invoice' />}>
          <MenuItem href={`/${locale}/forms/form-layouts`} icon={<i className='tabler-layout' />}>
            {navDict.formLayouts}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-validation`} icon={<i className='tabler-checkup-list' />}>
            {navDict.formValidation}
          </MenuItem>
          <MenuItem href={`/${locale}/forms/form-wizard`} icon={<i className='tabler-git-merge' />}>
            {navDict.formWizard}
          </MenuItem>
          <MenuItem href={`/${locale}/react-table`} icon={<i className='tabler-table' />}>
            {navDict.reactTable}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-checkbox' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {navDict.formELements}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-layout-board-split' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {navDict.muiTables}
          </MenuItem>
        </SubMenu>
        <SubMenu label={navDict.charts} icon={<i className='tabler-chart-donut-2' />}>
          <MenuItem href={`/${locale}/charts/apex-charts`} icon={<i className='tabler-chart-ppf' />}>
            {navDict.apex}
          </MenuItem>
          <MenuItem href={`/${locale}/charts/recharts`} icon={<i className='tabler-chart-sankey' />}>
            {navDict.recharts}
          </MenuItem>
        </SubMenu>
        <SubMenu label={navDict.others} icon={<i className='tabler-dots' />}>
          <MenuItem
            icon={<i className='tabler-cards' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {navDict.foundation}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-atom' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {navDict.components}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-list-search' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            {navDict.menuExamples}
          </MenuItem>
          <MenuItem
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href='https://pixinvent.ticksy.com'
            icon={<i className='tabler-lifebuoy' />}
          >
            {navDict.raiseSupport}
          </MenuItem>
          <MenuItem
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            icon={<i className='tabler-book-2' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
          >
            {navDict.documentation}
          </MenuItem>
          <MenuItem
            suffix={<CustomChip label='New' size='small' color='info' round='true' />}
            icon={<i className='tabler-notification' />}
          >
            {navDict.itemWithBadge}
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-link' />}
            href='https://pixinvent.com'
            target='_blank'
            suffix={<i className='tabler-external-link text-xl' />}
          >
            {navDict.externalLink}
          </MenuItem>
          <SubMenu label={navDict.menuLevels} icon={<i className='tabler-menu-2' />}>
            <MenuItem>{navDict.menuLevel2}</MenuItem>
            <SubMenu label={navDict.menuLevel2}>
              <MenuItem>{navDict.menuLevel3}</MenuItem>
              <MenuItem>{navDict.menuLevel3}</MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem disabled>{navDict.disabledMenu}</MenuItem>
        </SubMenu>
      </Menu>
      {/* <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <GenerateHorizontalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </HorizontalNav>
  )
}

export default HorizontalMenu
