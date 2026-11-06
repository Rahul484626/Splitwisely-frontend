import { TestBed } from '@angular/core/testing';

import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, isThemeId, themeById } from './theme';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_STORAGE_KEY);
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it('starts on the default theme when nothing is applied', () => {
    service.init();
    expect(service.current()).toBe(DEFAULT_THEME);
  });

  it('adopts the theme already painted on the document', () => {
    document.documentElement.dataset['theme'] = 'ocean';
    service.init();
    expect(service.current()).toBe('ocean');
  });

  it('falls back to the default for an unknown stored value', () => {
    document.documentElement.dataset['theme'] = 'not-a-theme';
    service.init();
    expect(service.current()).toBe(DEFAULT_THEME);
  });

  it('applies and persists the selected theme', () => {
    service.init();
    service.set('daylight');

    expect(service.current()).toBe('daylight');
    expect(document.documentElement.dataset['theme']).toBe('daylight');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('daylight');
    expect(service.definition().scheme).toBe('light');
  });

  it('exposes a complete catalog with unique ids', () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const theme of THEMES) {
      expect(theme.swatches.length).toBe(3);
      expect(themeById(theme.id)).toBe(theme);
      expect(isThemeId(theme.id)).toBe(true);
    }
    expect(isThemeId('nope')).toBe(false);
  });
});
