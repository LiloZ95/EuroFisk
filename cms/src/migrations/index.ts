import * as migration_20260828_175756_website_content_expansion from './20260828_175756_website_content_expansion';

export const migrations = [
  {
    up: migration_20260828_175756_website_content_expansion.up,
    down: migration_20260828_175756_website_content_expansion.down,
    name: '20260828_175756_website_content_expansion'
  },
];
