import { PositionImp } from './../../interface/positionImp';
import { Component, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-cio-dropdown',
  templateUrl: './cio-dropdown.component.html',
  styleUrls: ['./cio-dropdown.component.scss']
})
export class CioDropdownComponent implements OnInit {
  @Input() positions: PositionImp[];
  @Output() selected: string;
  constructor() {}

  ngOnInit() {}
}
