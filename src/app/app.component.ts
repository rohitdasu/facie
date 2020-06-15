import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Peer from "peerjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "facie";

  videoPlayer: HTMLVideoElement;

  @ViewChild("videoPlayer")
  set mainVideoEl(el: ElementRef) {
    this.videoPlayer = el.nativeElement;
  }
  peer;
  anotherid;
  mypeerid;
  msg;
  mymsg;
  ngOnInit() {
    var n = <any>navigator;
    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    this.peer = new Peer({
      host: "peerjs-server-backend.herokuapp.com",
      path: "/peerjs/myapp",
      port: 80,
    });
    setTimeout(() => {
      this.mypeerid = this.peer.id;
      console.log(this.mypeerid);
    }, 3000);

    this.peer.on("connection", function (conn) {
      conn.on("data", function (data) {
        console.log(data);
      });
    });

    this.peer.on("call", function (call) {
      n.getUserMedia(
        { video: true, audio: true },
        function (stream) {
          call.answer(stream);
          call.on("stream", function (remotestream) {
            this.videoPlayer.src = URL.createObjectURL(remotestream);
            this.videoPlayer.play();
          });
        },
        function (err) {
          console.log("Failed to get stream", err);
        }
      );
    });
  }
  send() {
    var x = this.mymsg;
    var conn = this.peer.connect(this.anotherid);
    conn.on("open", function () {
      conn.send(x);
    });
  }
  videoconnect() {
    var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;

    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    n.getUserMedia(
      { video: true, audio: true },
      function (stream) {
        var call = localvar.call(fname, stream);
        call.on("stream", function (remotestream) {
          this.videoPlayer.src = URL.createObjectURL(remotestream);
          this.videoPlayer.play();
        });
      },
      function (err) {
        console.log("Failed to get stream", err);
      }
    );
  }
}
