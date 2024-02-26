import { useEffect, useState } from 'react';
import { IconLookup, IconName, library } from '@fortawesome/fontawesome-svg-core';
import { IconPrefix, IconPathData } from '@fortawesome/fontawesome-svg-core';

type Icon = {
  prefix: IconPrefix;
  icon: [number, number, string[], string, IconPathData];
  iconName: IconName;
};

export const useFontAwesomeIconPack = () => {
  const [iconPack, setIconPack] = useState<Icon[] | undefined>();

  useEffect(() => {
    if (!iconPack) {
      import('@fortawesome/free-solid-svg-icons').then((module) => {
        const fas = { ...module.fas };
        delete fas.faCookie;
        delete fas.faFontAwesomeLogoFull;

        const icons = Object.values(fas).map((icon) => ({
          prefix: icon.prefix,
          icon: icon.icon,
          iconName: icon.iconName,
        }));

        import('@fortawesome/free-brands-svg-icons').then((module) => {
          const fab = { ...module.fab };

          const brandIcons = Object.values(fab).map((icon) => ({
            prefix: icon.prefix,
            icon: icon.icon,
            iconName: icon.iconName,
          }));

          const allIcons = [...icons, ...brandIcons];

          library.add(...allIcons);

          setIconPack(allIcons);
        });
      });
    }
  }, [iconPack]);

  return iconPack;
};
