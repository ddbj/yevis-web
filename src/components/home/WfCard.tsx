import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import doiLogo from '@/assets/doi-logo.svg'
import Authors from '@/components/home/Authors'
import WfTypeAvatar from '@/components/home/WfTypeAvatar'
import {
  extractAuthors,
  extractConceptDoi,
  extractConfig,
  extractVersion,
  extractWfType,
  generateAgoStr,
  isPublished,
  isVerified,
} from '@/store/getters'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface Props {
  wf: PublishedWorkflow | DraftWorkflow
  sx?: object
}

const WfCard: React.VFC<Props> = (props: Props) => {
  const config = extractConfig(props.wf)
  const wfType = extractWfType(props.wf)
  const verified = isVerified(props.wf)
  const published = isPublished(props.wf)
  const authors = extractAuthors(props.wf)
  const version = extractVersion(props.wf)
  const agoStr = generateAgoStr(props.wf)
  const doi = extractConceptDoi(props.wf)

  return (
    <Card sx={props.sx}>
      <CardContent sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            height: '100%',
          }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <WfTypeAvatar
              sx={{ width: '1.4rem', height: '1.4rem' }}
              wfType={wfType}
            />
            <Link
              component={RouterLink}
              sx={{
                color: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
              to={`workflows/${config.id}`}
              underline='none'>
              {config.workflow.name}
            </Link>
            {verified ? (
              <CheckRoundedIcon
                color='success'
                sx={{ width: '1.4rem', height: '1.4rem' }}
              />
            ) : null}
            {published ? null : (
              <BuildRoundedIcon
                color='error'
                sx={{ width: '1.2rem', height: '1.2rem' }}
              />
            )}
          </Stack>
          <Box
            sx={{
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}>
            <Authors authors={authors} sx={{ flexGrow: 1 }} />
            {doi ? (
              <Stack
                direction='row'
                spacing={1}
                sx={{ mt: 2, alignItems: 'center' }}>
                <Avatar
                  src={doiLogo}
                  sx={{ width: '1.2rem', height: '1.2rem' }}
                  variant='square'
                />
                <Link
                  href={`https://doi.org/${doi}`}
                  sx={{
                    color: 'primary.main',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                  }}>
                  {doi}
                </Link>
              </Stack>
            ) : null}
            <Stack
              direction='row'
              spacing={2}
              sx={{ alignItems: 'center', mt: 2 }}>
              <Button
                color='secondary'
                component={RouterLink}
                size='small'
                sx={{ textTransform: 'none' }}
                to={`workflows/${config.id}/versions/${version}`}
                variant='outlined'>
                Version {version}
              </Button>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'light' }}>
                {agoStr}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WfCard