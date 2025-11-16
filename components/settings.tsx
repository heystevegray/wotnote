'use client';

import { convertToFlat, PIANO_KEYS, PIANO_SCALES } from '@/lib/core/piano';
import useParams from '@/lib/hooks/use-params';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';

const Settings = () => {
  const { key, scale, color, pushParams } = useParams();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Key</SidebarGroupLabel>
      <Select
        defaultValue={key}
        onValueChange={(value) => pushParams('key', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Key" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PIANO_KEYS.map((key) => {
              const flatKey = convertToFlat(key);
              return (
                <SelectItem key={key} value={key}>
                  {capitalizeFirstLetter(key)}{' '}
                  {flatKey && flatKey !== key
                    ? `(${capitalizeFirstLetter(flatKey)})`
                    : ''}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <SidebarGroupLabel>Scale</SidebarGroupLabel>
      <Select
        defaultValue={scale}
        onValueChange={(value) => pushParams('scale', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Scale" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PIANO_SCALES.map((scale) => (
              <SelectItem key={scale} value={scale}>
                {capitalizeFirstLetter(scale.replace(/-/g, ' '))}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <SidebarGroupLabel>Color</SidebarGroupLabel>
      <Input
        type="color"
        defaultValue={color}
        onChange={(e) => pushParams('color', e.target.value)}
      />
    </SidebarGroup>
  );
};

export default Settings;
