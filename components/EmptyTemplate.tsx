import React from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty'
import { Loader, LucideIcon } from 'lucide-react'

type EmptyTemplateProps = {
    icon?: LucideIcon;
    title?: string;
    description?: string;
}

const EmptyTemplate = ({icon: Icon, title, description} : EmptyTemplateProps) => {
  return (
     <div className='h-full w-full flex items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            {Icon ? <Icon/> : <Loader/>}
          </EmptyMedia>
          <EmptyTitle>{title ? title : "Still Thinking..."}</EmptyTitle>
          <EmptyDescription>
            {description ? description : "Nope, not an AI thing... Just empty for now."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

export default EmptyTemplate