import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Crop } from 'src/app/models/crop.model';
// import { CropTips } from '../models/croptips.models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient) { }

  private _crops = new BehaviorSubject<Crop[]>(
    [
      {
        'name':'Onion',
        'img':'assets/project_images/onion.jfif'
      },
      {
        'name':'Carrot',
        'img':'assets/project_images/carrot.jfif'
      },
      {
        'name':'Ginger',
        'img':'assets/project_images/ginger.jfif'
      }
      ,
      {
        'name':'Pottato',
        'img':'assets/project_images/pottato.jfif'
      },
      {
        'name':'Turmeric',
        'img':'assets/project_images/turmeric.png'
      },
      {
        'name':'Paddy',
        'img':'assets/project_images/paddy.jpg'
      }
    ]
  );

  private _showingTips = new BehaviorSubject([
    "Carrots (Daucus carota) like a sun and light, well-drained soil. If your soil is stony,shallow or heavy clay, you may end up with stunted or forked carrots, so try short-rooted types or grow them in raised beds or containers. Carrots are drought resistant, so rarely need watering.",
    "Carrots (Daucus carota) like a sun and light, well-drained soil. If your soil is stony,shallow or heavy clay, you may end up with stunted or forked carrots, so try short-rooted types or grow them in raised beds or containers. Carrots are drought resistant, so rarely need watering.",
    "Carrots (Daucus carota) like a sun and light, well-drained soil. If your soil is stony,shallow or heavy clay, you may end up with stunted or forked carrots, so try short-rooted types or grow them in raised beds or containers. Carrots are drought resistant, so rarely need watering.",
    "Carrots (Daucus carota) like a sun and light, well-drained soil. If your soil is stony,shallow or heavy clay, you may end up with stunted or forked carrots, so try short-rooted types or grow them in raised beds or containers. Carrots are drought resistant, so rarely need watering.",
    "Carrots (Daucus carota) like a sun and light, well-drained soil. If your soil is stony,shallow or heavy clay, you may end up with stunted or forked carrots, so try short-rooted types or grow them in raised beds or containers. Carrots are drought resistant, so rarely need watering.",

  ])


  private _cropDisease = new BehaviorSubject([]);


  get Allcrops()
  {
    return this._crops.asObservable();
  }

  get AllSawTips()
  {
    return this._showingTips.asObservable()
  }

  // fetchAllcrops()
  // {
  //   return this.http.get<{[key:string]:CropTips}>("https://greenproject-6f3b9-default-rtdb.firebaseio.com/croptips.json").pipe(
  //     map(data=>{
  //       const tips = [];
  //       for(const key in data)
  //       {
  //         if(data.hasOwnProperty(key))
  //         {
  //           tips.push({
  //             tipsId:key,
  //             title:data[key].title,
  //             subtitle:data[key].subtitle,
  //             information:data[key].information
  //           })
  //         }
  //       }

  //       return tips
  //     }),
  //     tap(data=>{
  //       this._croptips.next(data)
  //     })
  //   )
  // }

  addCrop(
    name:string,
    img:string,
  )
  {

    let genId:string;

    const newCrop = {
      cropId:Math.random().toString(),
      name:name,
      img:img,
    }

    return this.Allcrops.pipe(
      take(1),
      tap(crops=>{
        this._crops.next(crops.concat(newCrop))
      })
    )

  }

  getCrop(cropId:string)
  {
    return this.Allcrops.pipe(
      take(1),
      map(crops=>{
        return {...crops.find(p=>p.name === cropId)}
      })
    )
  }

  // CancelTip(id:string)
  // {
  //   return this.http.delete(`https://greenproject-6f3b9-default-rtdb.firebaseio.com/croptips/${id}.json`).pipe(
  //     take(1),
  //     switchMap(()=>{
  //       return this.AllcropTips;
  //     }),
  //     tap(tips=>{
  //       this._croptips.next( tips.filter( p =>p.cropId !==id));
  //     })
  //   )
  // }

  updateCrop(id: string, name: string, img: string) {
    return this.Allcrops.pipe(
      take(1),
      tap(crops => {
        const updatedCropIndex = crops.findIndex(pl => pl.name === name);
        const updatedCrops = [...crops];
        const oldCrop = updatedCrops[updatedCropIndex];
        updatedCrops[updatedCropIndex] = {
          name:name,
          img:oldCrop.img
        };
        this._crops.next(updatedCrops);
      })
    );
  }



}
