import { Component, ViewEncapsulation } from '@angular/core';
import {
    Location,
    GermanAddress,
  } from '@angular-material-extensions/google-maps-autocomplete';
@Component({
    selector     : 'example',
    templateUrl  : './project.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{
    latitude: number;
    longitude: number;
    /**
     * Constructor
     */
    constructor()
    {
    }
    onLocationSelected(location: Location) {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
        console.log('latitude', this.latitude);
        console.log('longitude', this.longitude);
        return location;
      }
}
