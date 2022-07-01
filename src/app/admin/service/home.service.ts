import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CropTips } from '../models/croptips.models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient) { }

  private _croptips = new BehaviorSubject([]);


  get AllcropTips()
  {
    return this._croptips.asObservable();
  }

  fetchAlltips()
  {
    return this.http.get<{[key:string]:CropTips}>("https://greens9go-green-default-rtdb.firebaseio.com/croptips.json").pipe(
      map(data=>{
        const tips = [];
        for(const key in data)
        {
          if(data.hasOwnProperty(key))
          {
            tips.push({
              tipsId:key,
              title:data[key].title,
              subtitle:data[key].subtitle,
              information:data[key].information
            })
          }
        }

        return tips
      }),
      tap(data=>{
        this._croptips.next(data)
      })
    )
  }

  addTips(
    title:string,
    subtitle:string,
    information:string
  )
  {

    let genId:string;
    const newCropTip = {
      tipsId:Math.random().toString(),
      title:title,
      subtitle:subtitle,
      information:information
    }
    return this.http.post<{name:string}>("https://greens9go-green-default-rtdb.firebaseio.com/croptips.json",{...newCropTip,tipsId:null}).pipe(
      take(1),
      switchMap(data=>{
        genId = data.name

        return this.AllcropTips
      }),
      tap(tips=>{
        newCropTip.tipsId = genId
        this._croptips.next(tips)
      })
    )
  }

  getTip(cropTipId:string)
  {
    return this.http.get<CropTips>(`https://greens9go-green-default-rtdb.firebaseio.com/croptips/${cropTipId}.json`).pipe(
      take(1),
      map(data=>{
        return{
          cropTipId:cropTipId,
          title:data.title,
          subtitle:data.subtitle,
          information:data.information
        }
      })
    )
  }

  updateTip(
    id:string,
    title:string,
    subtitle:string,
    information:string
  )
  {

    let updatedtips:CropTips[];
    return this.AllcropTips.pipe(
      take(1),
      switchMap(tips=>{
        if(!tips || tips.length <=0)
        {
          return this.fetchAlltips();
        }
        else
        {
          return of(tips)
        }
      }),
      switchMap(tips=>{
        const index = tips.findIndex(p=>p.tipsId === id)
        const oldtip = tips[index]

        updatedtips = [...tips]

        updatedtips[index] = {
          tipsId:id,
          title:title,
          subtitle:subtitle,
          information:information
        }

        return this.http.put(`https://greens9go-green-default-rtdb.firebaseio.com/croptips/${id}.json`,{...updatedtips[index],tipsId:null})
      }),
      tap(()=>{
        this._croptips.next(updatedtips)
      })
    )
  }

  CancelTip(id:string)
  {
    return this.http.delete(`https://greens9go-green-default-rtdb.firebaseio.com/croptips/${id}.json`).pipe(
      take(1),
      switchMap(()=>{
        return this.AllcropTips;
      }),
      tap(tips=>{
        this._croptips.next( tips.filter( p =>p.cropId !==id));
      })
    )
  }



}
