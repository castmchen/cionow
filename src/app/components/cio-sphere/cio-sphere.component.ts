import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cio-sphere',
  templateUrl: './cio-sphere.component.html',
  styleUrls: ['./cio-sphere.component.scss']
})
export class CioSphereComponent implements OnInit {
  // private options: EChartOption = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       data: [820, 932, 901, 934, 1290, 1330, 1320],
  //       type: 'gauge'
  //     }
  //   ]
  // };
  private options: any = {
    backgroundColor: '#000',
    globe: {
      baseTexture: 'data-gl/asset/world.topo.bathy.200401.jpg',
      heightTexture: 'data-gl/asset/world.topo.bathy.200401.jpg',
      displacementScale: 0.04,
      shading: 'realistic',
      environment: 'data-gl/asset/starfield.jpg',
      realisticMaterial: {
        roughness: 0.9
      },
      postEffect: {
        enable: true
      },
      light: {
        main: {
          intensity: 5,
          shadow: true
        },
        ambientCubemap: {
          texture: 'data-gl/asset/pisa.hdr',
          diffuseIntensity: 0.2
        }
      }
    }
  };
  constructor() {}

  ngOnInit() {}
}
