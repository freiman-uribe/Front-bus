import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export default function DrawerIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return (
    <Ionicons size={24}  {...rest} />
  )
}