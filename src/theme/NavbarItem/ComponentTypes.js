import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import LocaleToggle from '@site/src/components/LocaleToggle';

// Adds the phone language switch as a navbar item type (custom types need the "custom-" prefix).
export default {
  ...ComponentTypes,
  'custom-localeToggle': LocaleToggle,
};
