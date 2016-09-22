import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppModule} from './ng2.component';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
