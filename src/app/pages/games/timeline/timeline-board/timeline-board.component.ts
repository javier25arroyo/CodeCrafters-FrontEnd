import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineStore } from '../../../../services/gameService/timeline-store.service';
import { TimelineSocketService } from '../../../../services/gameService/timeline-socket.service';

@Component({
  standalone: true,
  selector: 'app-timeline-board',
  imports: [CommonModule],
  templateUrl: './timeline-board.component.html',
  styleUrls: ['./timeline-board.component.scss']
})
export class TimelineBoardComponent {
  constructor(public store:TimelineStore, private sock:TimelineSocketService){}
  play(cardId:string, position:number){ this.sock.sendAction({ type:'PLAY_CARD', cardId, position }); }
}
