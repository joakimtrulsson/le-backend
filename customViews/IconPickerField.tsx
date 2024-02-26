import React, { useState, useEffect } from 'react';

import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';
import { type controller } from '@keystone-6/core/fields/types/json/views';
import { type FieldProps } from '@keystone-6/core/types';

import { IconPicker } from './components/IconPicker/IconPicker';

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [iconName, setIconName] = useState('');

  useEffect(() => {
    if (!value) {
      return;
    }
    setIconName(JSON.parse(value).iconName);
  }, [value]);

  const handleSave = (iconName: string) => {
    if (onChange) {
      setIconName(iconName);
      onChange(JSON.stringify({ iconName }));
    }
  };

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldDescription id={field.label}>Choose an icon</FieldDescription>
      <IconPicker
        value={iconName}
        onChange={handleSave}
        field={field}
        autoFocus={autoFocus}
        itemValue={value}
      />
    </FieldContainer>
  );
};
