/**
 * Created by Osei Fortune on 6/5/16.
 */
import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, RequestOptionsArgs} from '@angular/http';
import geolocation = require("nativescript-geolocation");
import * as dialogs from 'ui/dialogs';
import app = require('application');
import {Observable} from 'rxjs/Rx';
import moment = require('moment');
import config = require('../config');
let api = config.SERVER_API;
declare var zonedCallback: Function;
@Injectable()
export class TabsService {
    weatherData;
    hasData;
    rows;
    db;
    constructor(private http: Http) { }

    getLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!geolocation.isEnabled()) {
                var promise = geolocation.enableLocationRequest();
                promise.then((res) => {
                    const location = geolocation.getCurrentLocation({ timeout: 30000 })
                        .then((loc) => {
                            resolve(loc);
                        }, (e) => {
                            reject(e);
                        })
                }, (err) => {
                    console.log('not granted')
                })
            } else {
                const location = geolocation.getCurrentLocation({ timeout: 30000 })
                    .then((loc) => {
                        resolve(loc);
                    }, (e) => {
                        reject(e);
                    })
            }
        });
    }
    getForcast(loc): Observable<any> {
        return Observable.forkJoin(
            this.http.get(`${api}/api/location/reverse?latitude=${loc.latitude}&longitude=${loc.longitude}`).map((res: Response) => res.json()),
            this.http.get(`${api}/api/weather/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}`).map((res: Response) => res.json()),
            this.http.get(`${api}/api/images/location/500px?latitude=${loc.latitude}&longitude=${loc.longitude}`).map((res: Response) => res.json())
        )
    }
    getBackGround() {
        //4 = Nature
        return this.http.get(`${api}/api/images/random/4`)
            .map((res) => {
                return res.json();
            })
            .catch(e => {
                return Observable.throw(e);
            })
    }
    getTime() {
        return moment().format(' h:mm a');
    }

}