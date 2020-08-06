import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from './Preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private static DEFAULT = {
    nerd_mode: false,
  };
  private static PREFERENCES_KEY = 'pnlp-preferences';
  private preferences: BehaviorSubject<Preferences>;
  public observablePreferences: Observable<Preferences>;

  constructor() {
    const prefs = this.initializeFromLocalStorage();
    this.preferences = new BehaviorSubject(prefs);
    this.observablePreferences = this.preferences.asObservable();
  }

  public setPreference(partial: Partial<Preferences>) {
    const new_preferences = {
      ...this.preferences.value,
      ...partial,
    };
    this.preferences.next(new_preferences);
    localStorage.setItem(PreferencesService.PREFERENCES_KEY, JSON.stringify(new_preferences));
  }

  public initializeFromLocalStorage(): Preferences {
    let preferences = PreferencesService.DEFAULT;
    try {
      const saved_preferences = localStorage.getItem(PreferencesService.PREFERENCES_KEY);
      if (!saved_preferences) {
        throw new Error('No preferences found');
      }
      preferences = JSON.parse(saved_preferences);
    } catch (err) {
      localStorage.removeItem(PreferencesService.PREFERENCES_KEY);
      console.log('No local preferences were found or old preference format was found. Ignoring saved preferences...');
    }
    return preferences;
  }
}
