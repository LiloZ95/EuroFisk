import * as migration_20260828_175756_website_content_expansion from './20260828_175756_website_content_expansion';
import * as migration_20260913_094734_isolated_section_images from './20260913_094734_isolated_section_images';

export const migrations = [
  {
    up: migration_20260828_175756_website_content_expansion.up,
    down: migration_20260828_175756_website_content_expansion.down,
    name: '20260828_175756_website_content_expansion',
  },
  {
    up: migration_20260913_094734_isolated_section_images.up,
    down: migration_20260913_094734_isolated_section_images.down,
    name: '20260913_094734_isolated_section_images',
  },
];
