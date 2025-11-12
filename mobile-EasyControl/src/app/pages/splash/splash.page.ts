import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SplashPage implements OnInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.playVideo();
    });
  }

  playVideo() {
    const video = this.videoPlayer.nativeElement;
    
    video.play().catch(error => {
      console.log('Erro ao reproduzir vídeo:', error);
      this.goToLogin();
    });

    video.addEventListener('ended', () => {
      this.goToLogin();
    });

    video.addEventListener('click', () => {
      this.goToLogin();
    });
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }


}