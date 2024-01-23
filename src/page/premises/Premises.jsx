import { Banner, Content, LeftSidebar, Main, PageLayout } from '@atlaskit/page-layout'
import { setGlobalTheme, token } from '@atlaskit/tokens';

import { signOut } from 'aws-amplify/auth'
import { Outlet } from 'react-router-dom'

import Button from '@atlaskit/button'
import { Box, Stack, Inline } from '@atlaskit/primitives'

// Navigation Button Glyphs
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'
import EditorDateIcon from '@atlaskit/icon/glyph/editor/date'
import BillingFilledIcon from '@atlaskit/icon/glyph/billing-filled'
import OfficeBuildingIcon from '@atlaskit/icon/glyph/office-building'

const Premises = () => {

  setGlobalTheme({
    colorMode: 'dark'
  });

  return (
    <PageLayout>
      {
        <Banner id="banner" skipLinkTitle="Banner" height={60}>
          <Inline >
            <h1>Premises Managment</h1>
          </Inline>
        </Banner>
      }
      <Content testId="content">
        {
          <LeftSidebar id="navigation" skipLinkTitle="Navigation" width={125} isFixed='true'>
            <Box padding='space.150' style={{backgroundColor: token('color.background.neutral')}}>
              <Stack space='space.100'>
                <Button
                  onClick={() => { }}
                  iconAfter={<BillingFilledIcon label="" size="medium" />}
                  style={{ textAlign: 'left' }}>Cleaning Orders</Button>

                <Button
                  onClick={() => { }}
                  iconAfter={<EditorDateIcon label="" size="medium" />}
                  style={{ textAlign: 'left' }}>Ward Management</Button>

                <Button
                  onClick={() => { }}
                  iconAfter={<EditorDateIcon label="" size="medium" />}
                  style={{ textAlign: 'left' }}>Treatment Management</Button>

                <Button
                  onClick={() => { }}
                  iconAfter={<OfficeBuildingIcon label="" size="medium" />}
                  style={{ textAlign: 'left' }}>Building Management</Button>

                <Button
                  onClick={async () => await signOut()}
                  iconAfter={<SignOutIcon label="" size="medium" />}
                  style={{ textAlign: 'left' }}>Logout</Button>
              </Stack>
            </Box>

          </LeftSidebar>
        }
        {
          <Main testId="main" id="main" skipLinkTitle="Main Content">
            {/* <Outlet /> */}
            <Box>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel amet consequatur, nemo minus cum debitis sit, reiciendis harum maiores quaerat minima repellat soluta, unde asperiores eligendi et recusandae vitae numquam.
              </p>
            </Box>
          </Main>
        }
      </Content>
    </PageLayout>
  )
}

export default Premises