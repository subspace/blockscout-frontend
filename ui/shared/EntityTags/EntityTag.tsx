import { chakra, Image, Skeleton, Tag } from '@chakra-ui/react';
import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import IconSvg from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

import EntityTagLink from './EntityTagLink';
import EntityTagPopover from './EntityTagPopover';
import { getTagLinkParams } from './utils';

interface Props {
  data: TEntityTag;
  isLoading?: boolean;
  truncate?: boolean;
}

const EntityTag = ({ data, isLoading, truncate }: Props) => {

  if (isLoading) {
    return <Skeleton borderRadius="sm" w="100px" h="24px"/>;
  }

  const hasLink = Boolean(getTagLinkParams(data));
  const iconColor = data.meta?.textColor ?? 'gray.400';

  const name = (() => {
    if (data.meta?.warpcastHandle) {
      return `@${ data.meta.warpcastHandle }`;
    }

    return data.name;
  })();

  const icon = (() => {
    if (data.meta?.tagIcon) {
      return <Image boxSize={ 3 } mr={ 1 } flexShrink={ 0 } src={ data.meta.tagIcon } alt={ `${ data.name } icon` }/>;
    }

    if (data.tagType === 'name') {
      return <IconSvg name="publictags_slim" boxSize={ 3 } mr={ 1 } flexShrink={ 0 } color={ iconColor }/>;
    }

    if (data.tagType === 'protocol' || data.tagType === 'generic') {
      return <chakra.span color={ iconColor } whiteSpace="pre"># </chakra.span>;
    }

    return null;
  })();

  return (
    <EntityTagPopover data={ data }>
      <Tag
        display="flex"
        alignItems="center"
        minW={ 0 }
        maxW={ truncate ? { base: '125px', lg: '300px' } : undefined }
        bg={ data.meta?.bgColor }
        color={ data.meta?.textColor }
        colorScheme={ hasLink ? 'gray-blue' : 'gray' }
        _hover={ hasLink ? { opacity: 0.76 } : undefined }
      >
        <EntityTagLink data={ data }>
          { icon }
          <TruncatedValue value={ name } tooltipPlacement="top"/>
        </EntityTagLink>
      </Tag>
    </EntityTagPopover>
  );
};

export default React.memo(EntityTag);
