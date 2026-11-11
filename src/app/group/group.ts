import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { GroupContext } from './services/group-context';

@Component({
  imports: [RouterOutlet],
  selector: 'app-group',
  styleUrl: './group.scss',
  templateUrl: './group.html',
  providers: [GroupContext],
})
export class GroupC implements OnInit {
  private route = inject(ActivatedRoute);
  private groupContext = inject(GroupContext);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.groupContext.ensureLoaded(id).subscribe({
        error: (error) => {
          console.error('Не удалось загрузить группу:', error);
        },
      });
    }
  }
}
