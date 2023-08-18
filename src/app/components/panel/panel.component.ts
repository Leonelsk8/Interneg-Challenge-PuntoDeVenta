import { Component } from "@angular/core";

@Component({
  selector: 'panel-component',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class panelComponent{
  constructor(){}
  option:number = 1;

  changeOption(opt:number){
    this.option = opt
  }

}