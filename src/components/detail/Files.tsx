import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { TreeView, TreeItem, treeItemClasses } from '@mui/lab'
import { Chip, Box, Theme } from '@mui/material'
import React from 'react'

import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'
import { File } from '@/types/ghTrs'

interface Item {
  children?: Item[]
  id: string
  itemType: 'file' | 'dir'
  label: string
  type?: 'primary' | 'secondary'
  url?: string
}

const extractItems = (files: File[], parent: string): Item[] => {
  const items: Item[] = []
  const dirs: Record<string, File[]> = {}
  files.forEach((file) => {
    const parts = (file.target || '').split('/')
    if (parts.length > 1) {
      // dir
      if (!(parts[0] in dirs)) {
        dirs[parts[0]] = []
      }
      dirs[parts[0]].push({
        target: parts.slice(1).join('/'),
        type: file.type,
        url: file.url,
      })
    } else {
      // file
      items.push({
        id: `${parent}/${file.target || ''}`.replace(/^\/+|\/$/g, ''),
        itemType: 'file',
        label: file.target || '',
        type: file.type,
        url: file.url,
      })
    }
  })
  Object.keys(dirs).forEach((dir) => {
    items.push({
      children: extractItems(
        dirs[dir],
        `${parent}/${dir}`.replace(/^\/+|\/$/g, '')
      ),
      id: `${parent}/${dir}`.replace(/^\/+|\/$/g, ''),
      itemType: 'dir',
      label: dir,
    })
  })
  return items
}

interface TreeItemsProps {
  items: Item[]
}

const TreeItems: React.VFC<TreeItemsProps> = (props: TreeItemsProps) => {
  return (
    <React.Fragment>
      {props.items.map((item) => {
        return (
          <TreeItem
            children={
              item.children ? <TreeItems items={item.children} /> : null
            }
            key={item.id}
            label={
              <Box sx={{ alignItems: 'center', display: 'flex', my: 0.5 }}>
                {item.itemType === 'file' ? (
                  <InsertDriveFileOutlinedIcon
                    sx={{
                      color: 'primary.main',
                      fontSize: 18,
                    }}
                  />
                ) : (
                  <FolderOutlinedIcon
                    sx={{
                      color: 'primary.main',
                      fontSize: 18,
                    }}
                  />
                )}
                <Box children={item.label} sx={{ ml: 2 }} />
                {item.type === 'primary' ? (
                  <Chip
                    color='primary'
                    label='Primary Workflow'
                    size='small'
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      ml: 2,
                    }}
                  />
                ) : null}
              </Box>
            }
            nodeId={item.id}
            sx={(theme: Theme) => ({
              my: 0.5,
              [`.${treeItemClasses.content}`]: {
                '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
                  bgcolor:
                    item.itemType === 'file'
                      ? theme.palette.secondary.light
                      : null,
                  [`.${treeItemClasses.label}`]: {
                    fontWeight: 600,
                  },
                },
                borderRadius: theme.spacing(0.5),
              },
            })}
          />
        )
      })}
    </React.Fragment>
  )
}

interface Props {
  sx?: object
  wf: PublishedWorkflow | DraftWorkflow
}

const Files: React.VFC<Props> = (props: Props) => {
  const items = extractItems(props.wf.config.workflow.files, '')
  return (
    <Box
      sx={(theme: Theme) => ({
        border: '1px solid',
        borderColor: theme.palette.grey[500],
        borderRadius: theme.spacing(0.5),
        p: 2,
        ...props.sx,
      })}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
        defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 20 }} />}
        sx={{
          '.MuiTreeItem-iconContainer svg': {
            color: 'primary.main',
            fontSize: 24,
          },
        }}>
        <TreeItems items={items} />
      </TreeView>
    </Box>
  )
}

export default Files