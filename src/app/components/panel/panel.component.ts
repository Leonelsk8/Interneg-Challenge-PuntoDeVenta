import { Component} from "@angular/core";

@Component({
  selector: 'panel-component',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class panelComponent{
  constructor(){}
  optionClientOrProduct:number = 1;
  activePanelMobile:boolean = false;

  changeOption(opt:number){
    this.optionClientOrProduct = opt
  }

  changePanelToggle(value: boolean){
    this.activePanelMobile = value;
  }

}